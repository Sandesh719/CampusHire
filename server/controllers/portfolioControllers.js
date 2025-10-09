// server/controllers/portfolioController.js
import User from "../models/UserModel.js";

export const updatePortfolio = async (req, res) => {
  try {
    const { portfolioLinks = [], bio, projects = [] } = req.body;

    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    // Student‑specific safeguard (optional)
    if (user.role !== "student") {
      return res
        .status(403)
        .json({ success: false, message: "Only students can update portfolios" });
    }

    // Update fields
    if (Array.isArray(portfolioLinks)) user.portfolioLinks = portfolioLinks;
    if (typeof bio !== "undefined") user.bio = bio;
    if (Array.isArray(projects)) user.projects = projects;

    await user.save();

    res.status(200).json({
      success: true,
      message: "Portfolio updated successfully",
      user,
    });
  } catch (err) {
    console.error("updatePortfolio error:", err);
    res.status(500).json({
      success: false,
      message: err.message || "Server error updating portfolio",
    });
  }
};

export const getPortfolio = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select(
      "portfolioLinks bio projects"
    );
    if (!user)
      return res
        .status(404)
        .json({ success: false, message: "User not found" });

    res.status(200).json({ success: true, user });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};