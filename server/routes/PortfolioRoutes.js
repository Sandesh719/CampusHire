import express from "express";
import { isAuthenticated } from "../middlewares/auth.js";
import { getPortfolio, updatePortfolio } from "../controllers/portfolioControllers.js";

const router = express.Router();

// GET → fetch student's portfolio
router.get("/portfolio", isAuthenticated, getPortfolio);

// POST → update student's portfolio
router.post("/portfolio", isAuthenticated, updatePortfolio);

export default router;