import { validationResult } from 'express-validator';

const handleValidate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const formattedErrors = errors.array().map((err) => ({
      field: err.param,
      message: err.msg,
    }));
    return res.status(400).json({ errors: formattedErrors });
  }
  next();
};

export default handleValidate;
