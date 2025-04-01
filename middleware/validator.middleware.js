import { validationResult } from 'express-validator';

const validation = (req, res, next) => {
  const errors = validationResult(req);

  if (errors.isEmpty()) return next();
};

export { validation };
