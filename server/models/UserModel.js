// server/models/User.js
import mongoose from 'mongoose';  
import validator from 'validator';

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please enter your name"],
  },

  email: {
    type: String,
    required: true,
    validate: [validator.isEmail, "Please enter a valid email address"],
    unique: true,
  },

  password: {
    type: String,
    required: [true, "Please enter a password"],
  },

  avatar: {
    public_id: {
      type: String,
      required: false,
    },
    url: {
      type: String,
      required: false,
    },
  },

  // Only two roles: student and recruiter
  role: {
    type: String,
    enum: ["student", "recruiter"],
    default: "student",
  },

  // --- Student-specific details ---
  college: {
    type: String,
    required: function() {
      return this.role === "student";
    },
  },
  year: {
    type: Number,
    required: false,
    enum: [1, 2, 3, 4], 
  },
  skills: [
    {
      type: String,
    },
  ],
  portfolioLinks: [
    {
      type: String,
    },
  ],
  resume: {
    public_id: { type: String, required: false },
    url: { type: String, required: false },
  },

  // --- Recruiter-specific details ---
  companyName: {
    type: String,
    required: function() {
      return this.role === "recruiter";
    },
  },
  companyDescription: {
    type: String,
    required: false,
  },
  verifiedRecruiter: {
    type: Boolean,
    default: false,
  },

  // --- Common for both ---
  bio: {
    type: String,
    maxlength: 1000,
  },
  contactNumber: {
    type: String,
  },

  savedJobs: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Job",
    },
  ],
  appliedJobs: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Application",
    },
  ],

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const User = mongoose.model("User", UserSchema);
export default User;