import mongoose from "mongoose";

const ApplicationSchema = new mongoose.Schema({
  job: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Job',
    required: true
  },
  applicant: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  applicantResume: {
    public_id: {
      type: String,
      required: true
    },
    url: {
      type: String,
      required: true
    }
  },
  coverLetter: {
    type: String,
    maxlength: 2000
  },
  availability: {
    from: { type: Date },
    to: { type: Date }
  },
  expectedEarnings: {
    type: Number,
    default: 0
  },
  portfolioLink: {
    type: String
  },
  workSamples: [
    {
      public_id: { type: String, required: false },
      url: { type: String, required: false }
    }
  ],
  status: {
    type: String,
    enum: ['pending', 'accepted', 'rejected'],
    default: 'pending'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Application = mongoose.model('Application', ApplicationSchema);
export default Application;