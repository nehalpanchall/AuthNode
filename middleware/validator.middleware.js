import { validationResult } from 'express-validator';

const validation = (req, res, next) => {
  const errors = validationResult(req);

  if (errors.isEmpty()) return next();

  const extractedErrors = [];
  errors.array().map((err) => extractedErrors.push({ [err.path]: err.msg }));

  return res.status(400).json({
    message: 'Error occure during validation',
    success: false,
    errors: extractedErrors,
  });
};

export { validation };
