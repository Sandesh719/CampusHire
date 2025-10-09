import mongoose from "mongoose";

const projectSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  projectLink: {
    type: String,
    default: ""
  },
  technologies: {
    type: String,
    default: ""
  }
}, { timestamps: true });

const portfolioSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  githubLink: {
    type: String,
    default: ""
  },
  linkedinLink: {
    type: String,
    default: ""
  },
  portfolioLink: {
    type: String,
    default: ""
  },
  description: {
    type: String,
    default: ""
  },
  projects: [projectSchema],
  resume: {
    public_id: String,
    url: String
  }
}, {
  timestamps: true
});

export default mongoose.model("Portfolio", portfolioSchema);