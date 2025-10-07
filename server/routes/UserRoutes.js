// server/routes/userRoutes.js
import express from 'express';
const router = express.Router();
import upload from '../middlewares/upload.js';

import {
  register,
  login,
  isLogin,
  me,
  changePassword,
  updateProfile,
  deleteAccount
} from '../controllers/UserControllers.js';

import { isAuthenticated } from '../middlewares/auth.js';
import {
  registerValidator,
  validateHandler,
  loginValidator,
  changePasswordValidator,
  updateProfileValidator,
  deleteAccountValidator
} from '../middlewares/validators.js';

// Register
router.post(
  '/register',
  upload.fields([{ name: 'avatar', maxCount: 1 }, { name: 'resume', maxCount: 1 }]),
  register
);
// Login
router.route('/login').post(loginValidator(), validateHandler, login);

// Check login status
router.route('/isLogin').get(isAuthenticated, isLogin);

// Current user info
router.route('/me').get(isAuthenticated, me);

// Change password
router
  .route('/changePassword')
  .put(isAuthenticated, changePasswordValidator(), validateHandler, changePassword);

// Update profile
router
  .route('/updateProfile')
  .put(isAuthenticated, updateProfileValidator(), validateHandler, updateProfile);

// Delete account (keeps your existing PUT verb)
router
  .route('/deleteAccount')
  .put(isAuthenticated, deleteAccountValidator(), validateHandler, deleteAccount);

export default router;
