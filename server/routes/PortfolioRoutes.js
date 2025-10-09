import express from 'express';
import { isAuthenticated } from '../middlewares/auth.js';
import Portfolio from '../models/portfoliomodel.js';

const router = express.Router();

// GET portfolio data
router.get('/portfolio', isAuthenticated, async (req, res) => {
  try {
    console.log('Fetching portfolio for user:', req.user._id);
    
    let portfolio = await Portfolio.findOne({ user: req.user._id });
    
    if (!portfolio) {
      console.log('No portfolio found, creating empty one');
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

// POST - Create or update portfolio
router.post('/portfolio', isAuthenticated, async (req, res) => {
  try {
    console.log('Received portfolio data for user:', req.user._id);
    console.log('Request body:', req.body);
    
    const { githubLink, linkedinLink, portfolioLink, description, projects } = req.body;
    
    let portfolio = await Portfolio.findOne({ user: req.user._id });
    
    const portfolioData = {
      githubLink: githubLink || "",
      linkedinLink: linkedinLink || "",
      portfolioLink: portfolioLink || "",
      description: description || "",
      projects: projects ? JSON.parse(projects) : []
    };
    
    if (portfolio) {
      portfolio = await Portfolio.findOneAndUpdate(
        { user: req.user._id },
        portfolioData,
        { new: true, runValidators: true }
      );
      console.log('Portfolio updated successfully');
    } else {
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