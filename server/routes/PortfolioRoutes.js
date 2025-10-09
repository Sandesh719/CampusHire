import express from 'express';
import { isAuthenticated } from '../middlewares/auth.js';
import Portfolio from '../models/portfoliomodel.js'; // Fixed import
import multer from 'multer';
import cloudinary from 'cloudinary';

const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  }
});

const upload = multer({ 
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  }
});

// GET portfolio data
router.get('/portfolio', isAuthenticated, async (req, res) => {
  try {
    console.log('Fetching portfolio for user:', req.user._id);
    
    let portfolio = await Portfolio.findOne({ user: req.user._id });
    
    if (!portfolio) {
      console.log('No portfolio found, creating empty one');
      // Create empty portfolio if doesn't exist
      portfolio = await Portfolio.create({ user: req.user._id });
    }
    
    res.status(200).json({
      success: true,
      portfolio
    });
  } catch (error) {
    console.error('Error fetching portfolio:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// POST - Create or update portfolio WITH file upload
router.post('/portfolio', isAuthenticated, upload.single('resume'), async (req, res) => {
  try {
    console.log('Received portfolio data for user:', req.user._id);
    console.log('Request body:', req.body);
    console.log('Request file:', req.file);
    
    const { githubLink, linkedinLink, portfolioLink, description, projects } = req.body;
    
    let portfolio = await Portfolio.findOne({ user: req.user._id });
    
    const portfolioData = {
      githubLink: githubLink || "",
      linkedinLink: linkedinLink || "",
      portfolioLink: portfolioLink || "",
      description: description || "",
      projects: projects ? JSON.parse(projects) : []
    };
    
    // Handle resume file upload to Cloudinary
    if (req.file) {
      try {
        console.log('Uploading resume to Cloudinary...');
        const result = await cloudinary.v2.uploader.upload(req.file.path, {
          folder: 'resumes',
          resource_type: 'raw' // For PDF files
        });
        
        portfolioData.resume = {
          public_id: result.public_id,
          url: result.secure_url
        };
        console.log('Resume uploaded successfully');
      } catch (uploadError) {
        console.error('Error uploading resume:', uploadError);
        return res.status(500).json({
          success: false,
          message: 'Error uploading resume file'
        });
      }
    }
    
    if (portfolio) {
      // Update existing portfolio
      portfolio = await Portfolio.findOneAndUpdate(
        { user: req.user._id },
        portfolioData,
        { new: true, runValidators: true }
      );
      console.log('Portfolio updated successfully');
    } else {
      // Create new portfolio
      portfolioData.user = req.user._id;
      portfolio = await Portfolio.create(portfolioData);
      console.log('Portfolio created successfully');
    }
    
    res.status(200).json({
      success: true,
      message: 'Portfolio saved successfully',
      portfolio
    });
  } catch (error) {
    console.error('Error saving portfolio:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

export default router;