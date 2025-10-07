import { body, validationResult, param } from 'express-validator';

export const validateHandler = (req, res, next) => {
  const errors = validationResult(req);
  if (errors.isEmpty()) return next();
  const errorMessages = errors.array().map(error => error.msg).join(', ');
  return res.status(400).json({
    success: false,
    message: errorMessages
  });
};


export const registerValidator = () => [
  body('name').notEmpty().withMessage('Please enter name'),
  body('email').isEmail().withMessage('Please enter a valid email'),
  body('password').notEmpty().withMessage('Please enter password'),
  body('avatar').optional(),
  body('skills').optional(),

  body('role')
    .optional()
    .isIn(['student', 'recruiter'])
    .withMessage('Role must be either "student" or "recruiter"'),

  body('college').custom((value, { req }) => {
    if ((req.body.role || 'student') === 'student' && !value) {
      throw new Error('College is required for students');
    }
    return true;
  }),

  body('year')
    .optional()
    .isInt({ min: 1, max: 4 })
    .withMessage('Year must be between 1 and 4'),

  body('companyName').custom((value, { req }) => {
    if (req.body.role === 'recruiter' && !value) {
      throw new Error('Company Name is required for recruiters');
    }
    return true;
  }),

  body('resume').optional(),
];


export const loginValidator = () => [
  body('email').isEmail().withMessage('Please enter a valid email'),
  body('password').notEmpty().withMessage('Please enter password')
];


export const changePasswordValidator = () => [
  body('oldPassword').notEmpty().withMessage('Please enter your old password'),
  body('newPassword').notEmpty().withMessage('Please enter a new password'),
  body('confirmPassword').notEmpty().withMessage('Please confirm your new password')
];

export const updateProfileValidator = () => [
  body('newName').optional().notEmpty().withMessage('Please enter your new name'),
  body('newEmail').optional().isEmail().withMessage('Please enter a valid new email'),
  body('newAvatar').optional(),
  body('newResume').optional(),
  body('newSkills').optional(),
  body('newCollege').optional(),
  body('newYear')
    .optional()
    .isInt({ min: 1, max: 4 })
    .withMessage('Year must be between 1 and 4'),
  body('newCompanyName').optional(),
];


export const deleteAccountValidator = () => [
  body('password').notEmpty().withMessage('Please enter your password to delete your account')
];


export const jobValidator = () => [
  body('title').notEmpty().withMessage('Title required'),
  body('description').notEmpty().withMessage('Description required'),
  body('companyName').notEmpty().withMessage('Client/Company name required'),
  body('payType').optional().isIn(['fixed', 'hourly', 'stipend']),
  body('employmentType').optional().isIn(['micro-gig','freelance','internship','part-time','contract','full-time']),
  body('remoteType').optional().isIn(['remote','on-site','hybrid']),
  body('skillsRequired').optional(),
  body('deadline').optional().isISO8601().toDate()
];


export const JobIdValidator = () => [param('id', 'Please provide a valid Job Id').notEmpty()];
export const applicationIdValidator = () => [param('id', 'Please provide a valid Application Id').notEmpty()];
export const userIdValidator = () => [param('id', 'Please provide a valid User Id').notEmpty()];
