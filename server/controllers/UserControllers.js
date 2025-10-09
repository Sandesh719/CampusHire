// server/controllers/userController.js
import User from '../models/UserModel.js';
import bcrypt from 'bcrypt'
import { createToken } from '../middlewares/auth.js';

// -----------------------------------------------------------
//  Register Controller (direct Cloudinary uploads via Multer)
// -----------------------------------------------------------
export const register = async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      role = 'student',
      college,
      year,
      companyName,
      companyDescription,
      skills,
      portfolioLinks
    } = req.body;

    // ----------- Basic Validations -----------
    if (!['student', 'recruiter'].includes(role)) {
      return res
        .status(400)
        .json({ success: false, message: 'Invalid role. Must be "student" or "recruiter".' });
    }

    if (role === 'student' && !college) {
      return res.status(400).json({ success: false, message: 'College is required for students.' });
    }

    if (role === 'recruiter' && !companyName) {
      return res
        .status(400)
        .json({ success: false, message: 'Company name is required for recruiters.' });
    }

    // ----------- File URLs from Multer/Cloudinary -----------
    //  With CloudinaryStorage, Multer already uploads to Cloudinary
    //  and provides ready URLs in `req.files.<field>[0].path`
    const avatarFile = req.files?.avatar?.[0];
    const resumeFile = req.files?.resume?.[0];

    const avatarData = avatarFile
      ? { url: avatarFile.path, public_id: avatarFile.filename }
      : undefined;

    const resumeData = resumeFile
      ? { url: resumeFile.path, public_id: resumeFile.filename }
      : undefined;

    // ----------- Password Hashing -----------
    const hashedPassword = await bcrypt.hash(password, 10);

    // ----------- User Payload Construction -----------
    const userPayload = {
      name,
      email,
      password: hashedPassword,
      role,
      skills: Array.isArray(skills)
        ? skills
        : skills
        ? [skills]
        : [],
      portfolioLinks: Array.isArray(portfolioLinks)
        ? portfolioLinks
        : portfolioLinks
        ? [portfolioLinks]
        : [],
      avatar: avatarData,
    };

    if (role === 'student') {
      userPayload.college = college;
      if (year) userPayload.year = year;
      if (resumeData) userPayload.resume = resumeData;
    } else {
      userPayload.companyName = companyName;
      if (companyDescription) userPayload.companyDescription = companyDescription;
      userPayload.verifiedRecruiter = false;
      if (resumeData) userPayload.resume = resumeData;
    }

    // ----------- Create User -----------
    const user = await User.create(userPayload);

    // ----------- Generate Token -----------
    const token = createToken(user._id, user.email, user.role);

    // ----------- Response -----------
    res.status(201).json({
      success: true,
      message: 'User created successfully',
      user: await User.findById(user._id).select('-password'),
      token,
    });
  } catch (err) {
    console.log('Register Controller Error:', err);
    res.status(500).json({
      success: false,
      message: err.message || 'Server error during registration',
    });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User does not exist'
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Wrong Password'
      });
    }

   const token = createToken(user._id, user.email, user.role);

  res.status(200).json({
    success: true,
    message: 'User logged in successfully',
    user: await User.findById(user._id).select('-password'),
    token
  })
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message
    });
  }
};

export const isLogin = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (user) {
      return res.status(200).json({
        success: true,
        isLogin: true
      });
    } else {
      return res.status(200).json({
        success: true,
        isLogin: false
      });
    }
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message
    });
  }
};

export const me = async (req, res) => {
  try {
    // Find user, exclude password
    const user = await User.findById(req.user._id)
      .select("-password")
      .populate({
        path: "savedJobs",
        select: "title companyName employmentType category remoteType",
      })
      .populate({
        path: "appliedJobs",
        select: "status createdAt job",
        populate: {
          path: "job",
          select: "title companyName employmentType category",
        },
      });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Structure response, ensuring both roles get the fields they need
    const baseUser = {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      avatar: user.avatar,
      createdAt: user.createdAt,
      bio: user.bio || "",
      contactNumber: user.contactNumber || "",
    };

    let profileData = {};

    if (user.role === "student") {
      profileData = {
        college: user.college || "",
        year: user.year || null,
        skills: user.skills || [],
        portfolioLinks: user.portfolioLinks || [],
        resume: user.resume || { public_id: "", url: "" },
        savedJobs: user.savedJobs || [],
        appliedJobs: user.appliedJobs || [],
      };
    } else if (user.role === "recruiter") {
      profileData = {
        companyName: user.companyName || "",
        companyDescription: user.companyDescription || "",
        verifiedRecruiter: user.verifiedRecruiter || false,
        postedJobs: user.postedJobs || [], // optional, if you track it
      };
    }

    res.status(200).json({
      success: true,
      user: { ...baseUser, ...profileData },
    });
  } catch (err) {
    console.error("me() error:", err);
    res.status(500).json({
      success: false,
      message: err.message || "Server error retrieving user profile",
    });
  }
};

export const changePassword = async (req, res) => {
  try {
    const { oldPassword, newPassword, confirmPassword } = req.body;

    const user = await User.findById(req.user._id);

    const userPassword = user.password;

    const isMatch = await bcrypt.compare(oldPassword, userPassword);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Old password is wrong'
      });
    }

    if (newPassword === oldPassword) {
      return res.status(400).json({
        success: false,
        message: 'New password is same as old password'
      });
    }

    if (newPassword !== confirmPassword) {
      return res.status(401).json({
        success: false,
        message: 'New password and confirm password are not matching'
      });
    }

    const hashPass = await bcrypt.hash(newPassword, 10);

    user.password = hashPass;

    await user.save();

    res.status(200).json({
      success: true,
      message: 'User password changed'
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message
    });
  }
};

export const updateProfile = async (req, res) => {
  try {
    // Accept multiple optional new fields
    const {
      newName,
      newEmail,
      newAvatar,
      newResume,
      newSkills,
      newCollege,
      newYear,
      newCompanyName,
      newCompanyDescription,
      newPortfolioLinks
    } = req.body;

    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Replace avatar if newAvatar provided
    if (newAvatar) {
      // destroy old avatar if exists
      if (user.avatar && user.avatar.public_id) {
        try {
          await cloudinary.v2.uploader.destroy(user.avatar.public_id);
        } catch (e) {
          // log but don't fail the whole update
          console.warn('Could not destroy old avatar:', e.message);
        }
      }

      const myCloud1 = await cloudinary.v2.uploader.upload(newAvatar, {
        folder: 'avatar',
        crop: 'scale'
      });

      user.avatar = {
        public_id: myCloud1.public_id,
        url: myCloud1.secure_url
      };
    }

    // Replace resume if newResume provided
    if (newResume) {
      if (user.resume && user.resume.public_id) {
        try {
          await cloudinary.v2.uploader.destroy(user.resume.public_id);
        } catch (e) {
          console.warn('Could not destroy old resume:', e.message);
        }
      }

      const myCloud2 = await cloudinary.v2.uploader.upload(newResume, {
        folder: 'resume',
        crop: 'fit'
      });

      user.resume = {
        public_id: myCloud2.public_id,
        url: myCloud2.secure_url
      };
    }

    // Update common fields
    if (newName) user.name = newName;
    if (newEmail) user.email = newEmail;
    if (Array.isArray(newSkills)) user.skills = newSkills;
    else if (newSkills) user.skills = [newSkills];

    if (Array.isArray(newPortfolioLinks)) user.portfolioLinks = newPortfolioLinks;
    else if (newPortfolioLinks) user.portfolioLinks = [newPortfolioLinks];

    // Role-specific updates
    if (user.role === 'student') {
      if (newCollege) user.college = newCollege;
      if (newYear) {
        if (![1, 2, 3, 4].includes(Number(newYear))) {
          return res.status(400).json({
            success: false,
            message: 'Year must be one of [1,2,3,4]'
          });
        }
        user.year = Number(newYear);
      }
    } else if (user.role === 'recruiter') {
      if (newCompanyName) user.companyName = newCompanyName;
      if (newCompanyDescription) user.companyDescription = newCompanyDescription;
      // do NOT allow updating verifiedRecruiter from frontend
    }

    await user.save();

    res.status(200).json({
      success: true,
      message: 'Profile Updated',
      user: await User.findById(user._id).select('-password')
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message
    });
  }
};

export const deleteAccount = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    const isMatch = await bcrypt.compare(req.body.password, user.password);

    if (isMatch) {
      // optionally destroy stored media
      if (user.avatar && user.avatar.public_id) {
        try {
          await cloudinary.v2.uploader.destroy(user.avatar.public_id);
        } catch (e) {
          console.warn('Could not destroy avatar during delete:', e.message);
        }
      }
      if (user.resume && user.resume.public_id) {
        try {
          await cloudinary.v2.uploader.destroy(user.resume.public_id);
        } catch (e) {
          console.warn('Could not destroy resume during delete:', e.message);
        }
      }

      await User.findByIdAndRemove(req.user._id);
    } else {
      return res.status(200).json({
        success: false,
        message: 'Password does not match!'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Account Deleted'
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message
    });
  }
};