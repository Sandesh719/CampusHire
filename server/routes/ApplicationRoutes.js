import express from 'express'
import { isAuthenticated, authorizationRoles } from '../middlewares/auth.js'
import { createApplication, getSingleApplication, getUsersAllApplications, deleteApplication } from '../controllers/ApplicationControllers.js'
import { applicationIdValidator, validateHandler } from '../middlewares/validators.js'
const router = express.Router()

// Create a new application - only students can apply
router.route('/createApplication/:id')
  .post(
    isAuthenticated,
    authorizationRoles("student"),
    applicationIdValidator(),
    validateHandler,
    createApplication
  )

// Get single application by ID
router.route('/singleApplication/:id')
  .get(isAuthenticated, applicationIdValidator(), validateHandler, getSingleApplication)

// Get all applications of logged-in student
router.route('/getAllApplication')
  .get(isAuthenticated, getUsersAllApplications)

// Delete an application
router.route('/deleteApplication/:id')
  .delete(isAuthenticated, applicationIdValidator(), validateHandler, deleteApplication)

export default router;
