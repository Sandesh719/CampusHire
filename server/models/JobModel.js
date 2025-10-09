// server/models/Job.js
import mongoose from "mongoose";

const JobSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please provide a job title']
  },

  description: {
    type: String,
    required: [true, 'Please provide a job description']
  },

  companyName: {
    type: String,
    required: [true, 'Please provide the company/organiser name']
  },

  // optional logo stored on Cloudinary (or similar)
  companyLogo: {
    public_id: { type: String, required: false },
    url: { type: String, required: false }
  },

  // Where the gig is located (city / campus / remote note)
  location: {
    type: String,
    required: false
  },

  // core skill tags expected from applicants
  skillsRequired: [
    {
      type: String
    }
  ],

  // category/tag for filtering e.g. design, frontend, data, content
  category: {
    type: String,
    required: false
  },

  // employment / gig type - student-focused additions included
  employmentType: {
    type: String,
    enum: ['micro-gig', 'freelance', 'internship', 'part-time', 'contract', 'full-time'],
    default: 'micro-gig'
  },

  // brief experience requirement (kept flexible)
  experience: {
    type: String,
    required: false,
    default: 'no experience'
  },

  // Student-focused pay structure
  payType: {
    type: String,
    enum: ['fixed', 'hourly', 'stipend'],
    default: 'fixed'
  },
  payMin: {
    type: Number,
    required: false,
    default: 0
  },
  payMax: {
    type: Number,
    required: false,
    default: 0
  },

  // expected duration & weekly hours (helpful for students)
  durationWeeks: {
    type: Number,
    required: false,
    default: 0
  },
  hoursPerWeek: {
    type: Number,
    required: false,
    default: 0
  },

  // remote / on-site / hybrid
  remoteType: {
    type: String,
    enum: ['remote', 'on-site', 'hybrid'],
    default: 'remote'
  },

  // eligibility for students (years 1-4)
  eligibility: {
    minYear: { type: Number, enum: [1, 2, 3, 4], default: 1 },
    maxYear: { type: Number, enum: [1, 2, 3, 4], default: 4 }
  },

  // maximum applicants allowed (helps control spam)
  maxApplicants: {
    type: Number,
    default: 50
  },

  // attachments like job spec pdfs (optional)
  attachments: [
    {
      public_id: { type: String, required: false },
      url: { type: String, required: false }
    }
  ],

  // the user who posted this gig (must be a recruiter)
  postedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },

  // moderation & visibility
  isStudentGig: {
    type: Boolean,
    default: true
  },
  isApproved: {
    type: Boolean,
    default: true
  },

  // overall status
  status: {
    type: String,
    enum: ['active', 'closed'],
    default: 'active'
  },

  // quick counter for UI (can be incremented on apply)
  applicationCount: {
    type: Number,
    default: 0
  },

  // optional application deadline
  deadline: {
    type: Date,
    required: false
  },

  createdAt: {
    type: Date,
    default: Date.now
  }
});

// (optional) add indexes to improve search/filtering performance
//JobSchema.index({ isStudentGig: 1 });
//JobSchema.index({ 'eligibility.minYear': 1, 'eligibility.maxYear': 1 });
//JobSchema.index({ payMin: 1, payMax: 1 });
//JobSchema.index({ skillsRequired: 1 });
//JobSchema.index({ title: 'text', description: 'text', category: 'text' });

const Job = mongoose.model('Job', JobSchema);
export default Job;