import { validationResult } from 'express-validator';

const validation = (req, res, next) => {
  const errors = validationResult(req);
};

export { validation };
