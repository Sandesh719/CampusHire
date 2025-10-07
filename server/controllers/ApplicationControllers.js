// server/controllers/applicationController.js
import Job from '../models/JobModel.js'
import User from '../models/UserModel.js'
import Application from '../models/AppModel.js'
import cloudinary from '../config/cloudinaryConfig.js'
import mongoose from 'mongoose'

/**
 * Helper: upload a single file/string to Cloudinary if value looks like a base64/data URL.
 * If value is already a URL (http/https) it returns { public_id: null, url: value }.
 * If value is already { public_id, url } it returns it unchanged.
 * If falsy, returns null.
 */
const uploadIfData = async (value, folder) => {
  if (!value) return null;

  if (typeof value === 'object' && value.public_id && value.url) return value;

  if (typeof value === 'string' && (value.startsWith('http://') || value.startsWith('https://'))) {
    return { public_id: null, url: value };
  }

  // attempt upload (value could be base64 or local path)
  const uploaded = await cloudinary.v2.uploader.upload(value, {
    folder,
    resource_type: 'auto' // allow images, pdfs, etc.
  });
  return { public_id: uploaded.public_id, url: uploaded.secure_url };
};

// Creates a new application
export const createApplication = async (req, res) => {
  try {
    // only students can apply
    if (!req.user || req.user.role !== 'student') {
      return res.status(403).json({ success: false, message: 'Only students can apply to gigs' });
    }

    const jobId = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(jobId)) {
      return res.status(400).json({ success: false, message: 'Invalid job id' });
    }

    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({ success: false, message: 'Gig not found' });
    }

    // Only approved and active gigs allow applications
    if (!job.isApproved || job.status !== 'active') {
      return res.status(400).json({ success: false, message: 'This gig is not open for applications' });
    }

    // Deadline check
    if (job.deadline && new Date() > new Date(job.deadline)) {
      return res.status(400).json({ success: false, message: 'Application deadline has passed' });
    }

    // Check max applicants
    if (typeof job.maxApplicants === 'number' && job.applicationCount >= job.maxApplicants) {
      return res.status(400).json({ success: false, message: 'This gig has reached the maximum number of applicants' });
    }

    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(401).json({ success: false, message: 'User not found' });
    }

    // Prevent duplicate application: best check via Application collection
    const already = await Application.findOne({ job: job._id, applicant: user._id });
    if (already) {
      return res.status(400).json({ success: false, message: 'You have already applied to this gig' });
    }

    // Read application fields from req.body
    const {
      coverLetter,
      availabilityFrom,
      availabilityTo,
      expectedEarnings,
      portfolioLink,
      workSamples // expect array of urls/base64/objects
    } = req.body;

    // Prepare workSamples uploads if provided
    const samples = [];
    if (workSamples && Array.isArray(workSamples)) {
      for (const s of workSamples) {
        try {
          const up = await uploadIfData(s, 'work_samples');
          if (up) samples.push(up);
        } catch (e) {
          // skip failed upload but log; you may choose to fail instead
          console.warn('Work sample upload failed:', e.message);
        }
      }
    } else if (workSamples && typeof workSamples === 'string') {
      // single string passed
      try {
        const up = await uploadIfData(workSamples, 'work_samples');
        if (up) samples.push(up);
      } catch (e) {
        console.warn('Work sample upload failed:', e.message);
      }
    }

    // applicantResume: use user's resume if present; otherwise set minimal object
    const applicantResume = (user.resume && (user.resume.public_id || user.resume.url))
      ? { public_id: user.resume.public_id || null, url: user.resume.url || '' }
      : { public_id: null, url: '' };

    const applicationPayload = {
      job: job._id,
      applicant: user._id,
      applicantResume,
      coverLetter: coverLetter || '',
      availability: {
        from: availabilityFrom ? new Date(availabilityFrom) : undefined,
        to: availabilityTo ? new Date(availabilityTo) : undefined
      },
      expectedEarnings: expectedEarnings ? Number(expectedEarnings) : undefined,
      portfolioLink: portfolioLink || undefined,
      workSamples: samples
    };

    const application = await Application.create(applicationPayload);

    // Add application reference to user.appliedJobs (we store Application refs)
    user.appliedJobs = user.appliedJobs || [];
    user.appliedJobs.push(application._id);
    await user.save();

    // Increment job.applicationCount atomically
    await Job.findByIdAndUpdate(job._id, { $inc: { applicationCount: 1 } });

    res.status(201).json({
      success: true,
      message: 'Application created',
      application
    });
  } catch (err) {
    console.error('createApplication error:', err);
    res.status(500).json({
      success: false,
      message: err.message
    });
  }
};

// Get a single application
export const getSingleApplication = async (req, res) => {
  try {
    const applicationId = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(applicationId)) {
      return res.status(400).json({ success: false, message: 'Invalid application id' });
    }

    const application = await Application.findById(applicationId)
      .populate({ path: 'job', populate: { path: 'postedBy', select: 'name companyName' } })
      .populate({ path: 'applicant', select: '-password' });

    if (!application) {
      return res.status(404).json({ success: false, message: 'Application not found' });
    }

    // Authorization: allow the applicant or the recruiter who posted the job
    const requesterId = req.user && req.user._id ? req.user._id.toString() : null;
    const isApplicant = requesterId === (application.applicant?._id?.toString());
    const isPoster = requesterId === (application.job?.postedBy?._id?.toString());

    if (!isApplicant && !isPoster) {
      return res.status(403).json({ success: false, message: 'Not authorized to view this application' });
    }

    return res.status(200).json({
      success: true,
      application
    });
  } catch (err) {
    console.error('getSingleApplication error:', err);
    res.status(500).json({
      success: false,
      message: err.message
    });
  }
};

// Gets all applications of the authenticated user (student)
export const getUsersAllApplications = async (req, res) => {
  try {
    const applicantId = req.user._id;

    // 1️⃣  Fetch all applications created by this student
    const allApplications = await Application.find({ applicant: applicantId })
      .populate({
        path: 'job',
        select:
          'title companyName companyLogo employmentType category location payMin payMax remoteType createdAt status', // choose the job fields you need
        populate: {
          path: 'postedBy',
          select: 'name companyName avatar companyLogo', // recruiter info
        },
      })
      .populate({
        path: 'applicant',
        select: 'name email college year skills avatar resume', // basic student info
      })
      .sort({ createdAt: -1 }); // most recent first

    // 2️⃣  Handle case: no applications found
    if (!allApplications) {
      return res.status(404).json({
        success: false,
        message: 'No applications found for this user',
      });
    }

    // 3️⃣  Send back applications
    res.status(200).json({
      success: true,
      count: allApplications.length,
      applications: allApplications,
    });
  } catch (err) {
    console.error('getUsersAllApplications error:', err);
    res.status(500).json({
      success: false,
      message: err.message || 'Server error while fetching applications',
    });
  }
};

// Delete application (only applicant can delete their application)
export const deleteApplication = async (req, res) => {
  try {
    const applicationId = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(applicationId)) {
      return res.status(400).json({ success: false, message: 'Invalid application id' });
    }

    const application = await Application.findById(applicationId);
    if (!application) {
      return res.status(404).json({ success: false, message: 'Application not found or already deleted' });
    }

    // Only the applicant can delete their application
    const requesterId = req.user && req.user._id ? req.user._id.toString() : null;
    if (requesterId !== application.applicant.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized to delete this application' });
    }

    // Remove application doc
    await Application.findByIdAndRemove(applicationId);

    // Remove application reference from user's appliedJobs
    const user = await User.findById(application.applicant);
    if (user) {
      user.appliedJobs = (user.appliedJobs || []).filter(aid => aid.toString() !== applicationId.toString());
      await user.save();
    }

    // Decrement job.applicationCount (ensure it doesn't go negative)
    await Job.findByIdAndUpdate(application.job, { $inc: { applicationCount: -1 } });

    return res.status(200).json({
      success: true,
      message: 'Application deleted'
    });
  } catch (err) {
    console.error('deleteApplication error:', err);
    res.status(500).json({
      success: false,
      message: err.message
    });
  }
};