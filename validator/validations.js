import { body } from 'express-validator';

const registrationValidator = () => {
  return [
    body('userName')
      .isString()
      .withMessage('username must be a string')
      .trim()
      .notEmpty()
      .withMessage('username cannot be empty')
      .isLength({ min: 3 })
      .withMessage('username must be at least 3 characters long'),

    body('email')
      .trim()
      .isEmail()
      .withMessage('Invalid email format')
      .normalizeEmail(),

    body('password')
      .trim()
      .notEmpty()
      .withMessage('Password cannot be empty')
      .isLength({ min: 8 })
      .withMessage('Password must be at least 8 characters long')
      .matches(/[A-Z]/)
      .withMessage('Password must contain at least one uppercase letter')
      .matches(/[a-z]/)
      .withMessage('Password must contain at least one lowercase letter')
      .matches(/\d/)
      .withMessage('Password must contain at least one number')
      .matches(/[@$!%*?&]/)
      .withMessage(
        'Password must contain at least one special character (@, $, !, %, *, ?, &)'
      )
      .not()
      .matches(/\s/)
      .withMessage('Password cannot contain spaces'),
  ];
};

const loginValidator = () => {
  return [
    body('email')
      .trim()
      .notEmpty()
      .withMessage('Email is required')
      .isEmail()
      .withMessage('Invalid email format')
      .normalizeEmail(),

    body('password').trim().notEmpty().withMessage('Password is required'),
  ];
};

const forgotPasswordValidator = () => {
  return [
    body('email')
      .trim()
      .notEmpty()
      .withMessage('Email is required')
      .isEmail()
      .withMessage('Invalid email format')
      .normalizeEmail(),
  ];
};

export { registrationValidator, loginValidator, forgotPasswordValidator };
