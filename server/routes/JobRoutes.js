import express from 'express'
import { isAuthenticated, authorizationRoles } from '../middlewares/auth.js'
import { createJob, allJobs, oneJob, saveJob, getSavedJobs } from '../controllers/JobControllers.js'
import { jobValidator, validateHandler, JobIdValidator } from '../middlewares/validators.js';
const router = express.Router()

// Create a new job - only recruiters
router.route("/create/job")
  .post(
    isAuthenticated,
    authorizationRoles("recruiter"),
    jobValidator(),
    validateHandler,
    createJob
  )

// Get all jobs
router.route("/jobs").get(allJobs);

// Get single job by ID
router.route("/job/:id")
  .get(JobIdValidator(), validateHandler, oneJob);

// Save/unsave a job
router.route("/saveJob/:id")
  .get(isAuthenticated, JobIdValidator(), validateHandler, saveJob);

// Get all saved jobs for the logged-in user
router.route("/getSavedJobs")
  .get(isAuthenticated, getSavedJobs);
  
export default router;