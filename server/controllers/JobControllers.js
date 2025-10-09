// server/controllers/jobController.js
import Job from '../models/JobModel.js'
import User from '../models/UserModel.js'
import cloudinary from '../config/cloudinaryConfig.js'
import mongoose from 'mongoose'

/**
 * Helper: upload a single image/file to Cloudinary if value looks like a base64/data URL.
 * If value is already a URL, return it unchanged (no upload).
 * If value is falsy, return null.
 */
const uploadIfData = async (value, folder) => {
  if (!value) return null;

  // If it's already a URL (starts with http/https), assume it's an existing URL
  if (typeof value === 'string' && (value.startsWith('http://') || value.startsWith('https://'))) {
    return { public_id: null, url: value };
  }

  // If it's an object already shaped like { public_id, url }
  if (typeof value === 'object' && value.public_id && value.url) {
    return value;
  }

  // Otherwise try to upload (value may be a base64 data URI)
  const uploaded = await cloudinary.v2.uploader.upload(value, {
    folder,
    crop: 'scale'
  });

  return { public_id: uploaded.public_id, url: uploaded.secure_url };
};

export const createJob = async (req, res) => {
  try {
    // Make sure only recruiters create jobs (defence in depth)
    if (!req.user || req.user.role !== 'recruiter') {
      return res.status(403).json({
        success: false,
        message: 'Only recruiters can create gigs'
      });
    }

    const {
      title,
      description,
      companyName,
      companyLogo,
       location,
      skillsRequired,
      experience,
      // new pay fields
      payType,
      payMin,
      payMax,
      category,
      employmentType,
      // student-centric
      durationWeeks,
      hoursPerWeek,
      remoteType,
      eligibilityMinYear,
      eligibilityMaxYear,
      maxApplicants,
      attachments, // optional array of data URIs / urls / {public_id,url}
      deadline,
      isStudentGig = true
    } = req.body;

    // Basic required validations
    if (!title || !description || !companyName) {
      return res.status(400).json({
        success: false,
        message: 'Please provide title, description and companyName'
      });
    }

    // Validate enums (some redundancy with Mongoose but clearer errors)
    const allowedEmployment = ['micro-gig', 'freelance', 'internship', 'part-time', 'contract', 'full-time'];
    if (employmentType && !allowedEmployment.includes(employmentType)) {
      return res.status(400).json({
        success: false,
        message: `Invalid employmentType. Allowed: ${allowedEmployment.join(', ')}`
      });
    }

    const allowedRemote = ['remote', 'on-site', 'hybrid'];
    if (remoteType && !allowedRemote.includes(remoteType)) {
      return res.status(400).json({
        success: false,
        message: `Invalid remoteType. Allowed: ${allowedRemote.join(', ')}`
      });
    }

    const allowedPayTypes = ['fixed', 'hourly', 'stipend'];
    if (payType && !allowedPayTypes.includes(payType)) {
      return res.status(400).json({
        success: false,
        message: `Invalid payType. Allowed: ${allowedPayTypes.join(', ')}`
      });
    }

    // numeric validations
    if (payMin && payMax && Number(payMin) > Number(payMax)) {
      return res.status(400).json({
        success: false,
        message: 'payMin cannot be greater than payMax'
      });
    }

    // eligibility years, if provided, must be in 1..4
    const minYear = eligibilityMinYear ? Number(eligibilityMinYear) : undefined;
    const maxYear = eligibilityMaxYear ? Number(eligibilityMaxYear) : undefined;
    if ((minYear && ![1,2,3,4].includes(minYear)) || (maxYear && ![1,2,3,4].includes(maxYear))) {
      return res.status(400).json({
        success: false,
        message: 'Eligibility years must be one of [1,2,3,4]'
      });
    }
    if (minYear && maxYear && minYear > maxYear) {
      return res.status(400).json({
        success: false,
        message: 'eligibilityMinYear cannot be greater than eligibilityMaxYear'
      });
    }

    // process skillsRequired: allow string comma-separated or array
    let skills = [];
    if (Array.isArray(skillsRequired)) skills = skillsRequired;
    else if (typeof skillsRequired === 'string' && skillsRequired.trim().length) {
      skills = skillsRequired.split(',').map(s => s.trim()).filter(Boolean);
    }

    // Upload attachments array (optional)
    const attachmentsArr = [];
    if (attachments && Array.isArray(attachments) && attachments.length > 0) {
      for (const a of attachments) {
        try {
          const up = await uploadIfData(a, 'job_attachments');
          if (up) attachmentsArr.push(up);
        } catch (e) {
          // skip problematic file but log it
          console.warn('Attachment upload failed:', e.message);
        }
      }
    }

    // Create job document
    const newJob = await Job.create({
      title,
      description,
      companyName,
      companyLogo,
      location: location || undefined,
      skillsRequired: skills,
      experience: experience || undefined,
      category: category || undefined,
      employmentType: employmentType || 'micro-gig',
      payType: payType || 'fixed',
      payMin: payMin ? Number(payMin) : 0,
      payMax: payMax ? Number(payMax) : 0,
      durationWeeks: durationWeeks ? Number(durationWeeks) : 0,
      hoursPerWeek: hoursPerWeek ? Number(hoursPerWeek) : 0,
      remoteType: remoteType || 'remote',
      eligibility: {
        minYear: minYear || 1,
        maxYear: maxYear || 4
      },
      maxApplicants: maxApplicants ? Number(maxApplicants) : 50,
      attachments: attachmentsArr,
      deadline: deadline ? new Date(deadline) : undefined,
      postedBy: req.user._id,
      isStudentGig: isStudentGig === false ? false : true,
      // auto approve if recruiter is verified
      isApproved: req.user.verifiedRecruiter === true ? true : false
    });

    res.status(201).json({
      success: true,
      message: 'Gig created successfully',
      job: newJob
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: err.message
    });
  }
};

export const allJobs = async (req, res) => {
  try {
    // --- 1. Extract query params
    const {
      q, // text query
      studentGigs, // 'true' | 'false'
      payMin, payMax,
      minYear, maxYear,
      skills, // comma separated list
      employmentType,
      remoteType,
      sort = "recent", // recent | payDesc | payAsc | deadline
      page = 1,
      limit = 12,
    } = req.query;

    // --- 2. Build base filter
    const filter = {
      isApproved: true,
      status: "active", // ✅ ensure only active listings
    };

    // By default, show student gigs only
    if (typeof studentGigs !== "undefined") {
      filter.isStudentGig = studentGigs === "true";
    } else {
      filter.isStudentGig = true;
    }

    // --- 3. Pay range filtering
    if (payMin)
      filter.payMax = { $gte: Number(payMin) };
    if (payMax)
      filter.payMin = { ...(filter.payMin || {}), $lte: Number(payMax) };

    // --- 4. Eligibility (year)
    if (minYear)
      filter["eligibility.minYear"] = { $lte: Number(minYear) };
    if (maxYear)
      filter["eligibility.maxYear"] = { $gte: Number(maxYear) };

    // --- 5. Employment type and location type
    if (employmentType) filter.employmentType = employmentType;
    if (remoteType) filter.remoteType = remoteType;

    // --- 6. Skills filtering
    if (skills) {
      const skillArr = skills
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);
      if (skillArr.length)
        filter.skillsRequired = { $all: skillArr };
    }

    // --- 7. Text search (q)
    let query = Job.find(filter);
    if (q && q.trim()) {
      query = Job.find({
        $text: { $search: q },
        ...filter,
      });
    }

    // --- 8. Sorting options
    switch (sort) {
      case "payDesc":
        query = query.sort({ payMax: -1 });
        break;
      case "payAsc":
        query = query.sort({ payMin: 1 });
        break;
      case "deadline":
        query = query.sort({ deadline: 1 });
        break;
      default:
        query = query.sort({ createdAt: -1 });
    }

    // --- 9. Pagination logic
    const pageNum = Number(page) || 1;
    const perPage = Math.min(Number(limit) || 12, 100);
    const skip = (pageNum - 1) * perPage;

    // Parallel queries (for performance)
    const [total, jobs] = await Promise.all([
      Job.countDocuments(filter),
      query
        .skip(skip)
        .limit(perPage)
        .populate(
          "postedBy",
          "name email companyName companyLogo verifiedRecruiter"
        ),
    ]);

    // --- 10. Respond
    res.status(200).json({
      success: true,
      total,
      page: pageNum,
      perPage,
      jobs,
    });
  } catch (err) {
    console.error("allJobs error:", err);
    res.status(500).json({
      success: false,
      message: err.message || "Server error fetching jobs",
    });
  }
};

export const oneJob = async (req, res) => {
  try {
    const jobId = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(jobId)) {
      return res.status(400).json({ success: false, message: 'Invalid job id' });
    }

    const job = await Job.findById(jobId).populate('postedBy', '-password');
    if (!job) {
      return res.status(404).json({ success: false, message: 'Gig not found' });
    }

    res.status(200).json({
      success: true,
      job
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: err.message
    });
  }
};

export const saveJob = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    const JobId = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(JobId)) {
      return res.status(400).json({ success: false, message: 'Invalid job id' });
    }

    const jobIdObjectId = new mongoose.Types.ObjectId(JobId);
    const isSaved = user.savedJobs.some(j => j.toString() === jobIdObjectId.toString());

    if (isSaved) {
      user.savedJobs = user.savedJobs.filter(jobid => jobid.toString() !== jobIdObjectId.toString());
      await user.save();

      return res.status(200).json({
        success: true,
        message: 'Gig unsaved'
      });
    } else {
      user.savedJobs.push(jobIdObjectId);
      await user.save();

      return res.status(200).json({
        success: true,
        message: 'Gig saved'
      });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: err.message
    });
  }
};

export const getSavedJobs = async (req, res) => {
  try {
    // 1️⃣  Find the current user and populate their saved jobs
    const user = await User.findById(req.user._id)
      .select('savedJobs')
      .populate({
        path: 'savedJobs',
        populate: {
          path: 'postedBy',
          select: 'name companyName avatar companyLogo', // choose what you need
        },
        select:                 // restrict Job fields returned
          'title companyName companyLogo employmentType category payMin payMax remoteType location createdAt',
      });

    // 2️⃣  Handle edge‑case: user not found
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    // 3️⃣  Return the populated jobs
    return res.status(200).json({
      success: true,
      count: user.savedJobs.length,
      savedJobs: user.savedJobs,
    });
  } catch (err) {
    console.error('getSavedJobs error:', err);
    res.status(500).json({
      success: false,
      message: err.message || 'Server error while fetching saved jobs',
    });
  }
};
