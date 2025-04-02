import { body, param } from 'express-validator';

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

    // middleware
    (req, res, next) => {
      req.validatorName = 'user registration';
      next();
    },
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

    // middleware
    (req, res, next) => {
      req.validatorName = 'user login';
      next();
    },
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

    // middleware
    (req, res, next) => {
      req.validatorName = 'forgot password';
      next();
    },
  ];
};

const userVerificationValidator = () => {
  return [
    param('token')
      .trim()
      .notEmpty()
      .withMessage('Token is required!')
      .matches(/^[a-zA-Z0-9-_]+$/)
      .withMessage(
        'Token should contain only alphanumeric characters, dashes (-), and underscores (_)'
      ),

    (req, res, next) => {
      req.validatorName = 'user verification';
      next();
    },
  ];
};

export {
  registrationValidator,
  loginValidator,
  forgotPasswordValidator,
  userVerificationValidator,
};
