import Job from '../models/JobModel.js'
import User from '../models/UserModel.js'
import Application from '../models/AppModel.js'
import cloudinary from '../config/cloudinaryConfig.js'

//Get Jobs posted by logged in recruiter
export const getMyJobs = async (req, res, next) => {
  try {
    const recruiterId = req.user._id;

    const jobs = await Job.find({ postedBy: recruiterId })
      .populate("postedBy", "name email companyName companyDescription avatar") 
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: jobs.length,
      jobs,
    });
  } catch (err) {
    console.error("Error fetching recruiter jobs:", err);
    next(err);
  }
};
// Get all jobs
export const getAllJobs = async (req,res) => {
    try{
        const jobs = await Job.find() ;

        res.status(200).json({
            success: true,
            jobs
        })

    }catch(err){
        res.status(500).json({
            success: false,
            message: err.message
        })
    }                
}

// Get all Users
export const getAllUsers = async (req,res) => {
    try{
        const users = await User.find() ;

        res.status(200).json({
            success: true,
            users
        })

    }catch(err){
        res.status(500).json({
            success: false,
            message: err.message
        })
    }
}

// Get all applications
export const getAllApp = async (req,res) => {
    try{
        const applications = await Application.find().populate("job applicant") ;

        res.status(200).json({
            success: true,
            applications
        })

    }catch(err){
        res.status(500).json({
            success: false,
            message: err.message
        })
    }
}

// Update Application Status
export const updateApplication = async (req,res) => {
    try{

        const application = await Application.findById(req.params.id) ;

        application.status = req.body.status ;

        await application.save() ;

        res.status(200).json({
            success: true,
            message: "Application Updated"
        })

    }catch(err){
        res.status(500).json({
            success: false,
            message: err.message
        })
    }
}
// Delete Application
export const deleteApplication = async (req,res) => {
    try{

        const application = await Application.findByIdAndRemove(req.params.id) ;

        res.status(200).json({
            success: true ,
            message: "Application Deleted"
        })

    }catch(err){
        res.status(500).json({
            success: false,
            message: err.message
        })
    }
}
// Get Application
export const getApplication = async (req, res) => {
  try {
    const application = await Application.findById(req.params.id)
      // --- populate job fields ---
      .populate({
        path: "job",
        select: `
          title companyName location experience category
          employmentType remoteType payType payMin payMax
          durationWeeks hoursPerWeek
        `
      })
      // --- populate applicant fields (student) ---
      .populate({
        path: "applicant",
        select: `
          name email college year skills
          bio portfolioLinks projects
          resume
        `,
      });

    if (!application) {
      return res.status(404).json({
        success: false,
        message: "Application not found",
      });
    }

    /** Construct a clean structured response */
    const formatted = {
      _id: application._id,
      status: application.status,
      coverLetter: application.coverLetter || "",
      expectedEarnings: application.expectedEarnings || 0,
      portfolioLink: application.portfolioLink || "",
      workSamples: application.workSamples || [],
      createdAt: application.createdAt,
      applicantResume: application.applicantResume,
      availability: application.availability || {},

      // Applicant (Student) details
      applicant: application.applicant
        ? {
            _id: application.applicant._id,
            name: application.applicant.name,
            email: application.applicant.email,
            college: application.applicant.college,
            year: application.applicant.year,
            skills: application.applicant.skills || [],
            bio: application.applicant.bio || "",
            portfolioLinks: application.applicant.portfolioLinks || [],
            projects: application.applicant.projects || [],
            resume: application.applicant.resume || {},
          }
        : null,

      // Job Details
      job: application.job
        ? {
            _id: application.job._id,
            title: application.job.title,
            companyName: application.job.companyName,
            location: application.job.location,
            experience: application.job.experience,
            category: application.job.category,
            employmentType: application.job.employmentType,
            remoteType: application.job.remoteType,
            payType: application.job.payType,
            payMin: application.job.payMin,
            payMax: application.job.payMax,
            durationWeeks: application.job.durationWeeks,
            hoursPerWeek: application.job.hoursPerWeek,
          }
        : null,
    };

    res.status(200).json({
      success: true,
      application: formatted,
    });
  } catch (err) {
    console.error("getApplication error:", err);
    res.status(500).json({
      success: false,
      message: err.message || "Server error while fetching application",
    });
  }
};


// Update User Role
export const updateUser = async (req,res) => {
    try{
        const user = await User.findById(req.params.id) ;

        user.role = req.body.role ;

        await user.save() ;

        res.status(200).json({
            success: true,
            message: "User Updated"
        })

    }catch(err){
        res.status(500).json({
            success: false,
            message: err.message
        })
    }
}

// Delete User
export const deleteUser = async (req,res) => {
    try{
        const user = await User.findByIdAndRemove(req.params.id) ;

        res.status(200).json({
            success: true,
            message: "User Deleted"
        })

    }catch(err){
        res.status(500).json({
            success: false,
            message: err.message
        })
    }
}

// Get User
export const getUser = async (req,res) => {
    try{
        const user = await User.findById(req.params.id) ;

        res.status(200).json({
            success: true,
            user
        })

    }catch(err){
        res.status(500).json({
            success: false,
            message: err.message
        })
    }
}


// Update Job
export const updateJob = async (req, res) => {
  try {
    // Allow only recruiters
    if (!req.user || req.user.role !== "recruiter") {
      return res.status(403).json({
        success: false,
        message: "Only recruiters can update gigs",
      });
    }

    // Find the existing job
    const job = await Job.findById(req.params.id);
    if (!job) {
      return res.status(404).json({
        success: false,
        message: "Job not found",
      });
    }

    // Ownership check — only the recruiter who posted it can edit
    if (job.postedBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to edit this job",
      });
    }

    const {
      title,
      description,
      companyName,
      location,
      skillsRequired,
      experience,
      payType,
      payMin,
      payMax,
      category,
      employmentType,
      durationWeeks,
      hoursPerWeek,
      remoteType,
      eligibilityMinYear,
      eligibilityMaxYear,
      maxApplicants,
      attachments,
      deadline,
    } = req.body;

    // Basic validations
    if (!title || !description || !companyName) {
      return res.status(400).json({
        success: false,
        message: "Please provide title, description, and companyName",
      });
    }

    // Employment type validation
    const allowedEmployment = [
      "micro-gig",
      "freelance",
      "internship",
      "part-time",
      "contract",
      "full-time",
    ];
    if (employmentType && !allowedEmployment.includes(employmentType)) {
      return res.status(400).json({
        success: false,
        message: `Invalid employmentType. Allowed: ${allowedEmployment.join(", ")}`,
      });
    }

    // Remote type validation
    const allowedRemote = ["remote", "on-site", "hybrid"];
    if (remoteType && !allowedRemote.includes(remoteType)) {
      return res.status(400).json({
        success: false,
        message: `Invalid remoteType. Allowed: ${allowedRemote.join(", ")}`,
      });
    }

    // Pay type validation
    const allowedPayTypes = ["fixed", "hourly", "stipend"];
    if (payType && !allowedPayTypes.includes(payType)) {
      return res.status(400).json({
        success: false,
        message: `Invalid payType. Allowed: ${allowedPayTypes.join(", ")}`,
      });
    }

    // Numeric logic validations
    if (payMin && payMax && Number(payMin) > Number(payMax)) {
      return res.status(400).json({
        success: false,
        message: "payMin cannot be greater than payMax",
      });
    }

    const minYear = eligibilityMinYear ? Number(eligibilityMinYear) : undefined;
    const maxYear = eligibilityMaxYear ? Number(eligibilityMaxYear) : undefined;
    if (
      (minYear && ![1, 2, 3, 4].includes(minYear)) ||
      (maxYear && ![1, 2, 3, 4].includes(maxYear))
    ) {
      return res.status(400).json({
        success: false,
        message: "Eligibility years must be one of [1,2,3,4]",
      });
    }
    if (minYear && maxYear && minYear > maxYear) {
      return res.status(400).json({
        success: false,
        message: "eligibilityMinYear cannot be greater than eligibilityMaxYear",
      });
    }

    // Skill processing
    let skills = [];
    if (Array.isArray(skillsRequired)) skills = skillsRequired;
    else if (typeof skillsRequired === "string" && skillsRequired.trim().length) {
      skills = skillsRequired.split(",").map((s) => s.trim()).filter(Boolean);
    }

    // (Optional) Handle attachments, if recruiter replaces or adds new ones
    const attachmentsArr = [];
    if (attachments && Array.isArray(attachments) && attachments.length > 0) {
      for (const a of attachments) {
        try {
          const up = await uploadIfData(a, "job_attachments");
          if (up) attachmentsArr.push(up);
        } catch (e) {
          console.warn("Attachment upload failed during update:", e.message);
        }
      }
    }

    // Update fields
    job.title = title;
    job.description = description;
    job.companyName = companyName;
    job.location = location || job.location;
    job.skillsRequired = skills;
    job.experience = experience || job.experience;
    job.category = category || job.category;
    job.employmentType = employmentType || job.employmentType;
    job.payType = payType || job.payType;
    job.payMin = payMin ? Number(payMin) : job.payMin;
    job.payMax = payMax ? Number(payMax) : job.payMax;
    job.durationWeeks = durationWeeks ? Number(durationWeeks) : job.durationWeeks;
    job.hoursPerWeek = hoursPerWeek ? Number(hoursPerWeek) : job.hoursPerWeek;
    job.remoteType = remoteType || job.remoteType;
    job.eligibility = {
      minYear: minYear || job.eligibility.minYear,
      maxYear: maxYear || job.eligibility.maxYear,
    };
    job.maxApplicants = maxApplicants
      ? Number(maxApplicants)
      : job.maxApplicants;
    job.deadline = deadline ? new Date(deadline) : job.deadline;

    if (attachmentsArr.length > 0) {
      job.attachments = attachmentsArr;
    }

    await job.save();

    return res.status(200).json({
      success: true,
      message: "Job updated successfully",
      job,
    });
  } catch (err) {
    console.error("updateJob error:", err);
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};


// Get Single Job
export const getJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) {
      return res.status(404).json({ success: false, message: "Job not found" });
    }

    // Ensure only the owner recruiter can fetch
    if (job.postedBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: "Unauthorized" });
    }

    res.status(200).json({ success: true, job });
  } catch (err) {
    res
      .status(500)
      .json({ success: false, message: err.message || "Server error" });
  }
};

//Delete Single Job
export const deleteJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);

    if (!job)
      return res.status(404).json({ success: false, message: "Job not found" });

    // ✅ ensure recruiter owns this job
    if (job.postedBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized: cannot delete another recruiter’s job.",
      });
    }

    await job.deleteOne();

    res.status(200).json({ success: true, message: "Job deleted" });
  } catch (err) {
    res
      .status(500)
      .json({ success: false, message: err.message || "Server error" });
  }
};


export const getAllApplicationsForRecruiter = async (req, res) => {
  try {
    // Get recruiter’s jobs
    const recruiterJobs = await Job.find({ postedBy: req.user._id }).select("_id");

    if (!recruiterJobs.length) {
      return res.status(200).json({ success: true, applications: [] });
    }

    // Find applications for those job IDs
    const applications = await Application.find({
      job: { $in: recruiterJobs.map((job) => job._id) },
    })
      .populate("job", "title location category") // show basic job info
      .populate("applicant", "name email college year skills") // relevant applicant info
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: applications.length,
      applications,
    });
  } catch (err) {
    console.error("Error fetching recruiter applications:", err);
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};