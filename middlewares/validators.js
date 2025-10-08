const { body, param, validationResult } = require('express-validator');
const mongoose = require('mongoose');

const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error('Validation failed');
    error.statusCode = 400;
    error.errors = errors.array();
    return next(error);
  }
  next();
};

const passwordComplexity = body('password')
  .isLength({ min: 6 })
  .withMessage('Password must be at least 6 characters')
  .matches(/[\d!@#$%^&*()_+{}\[\]:;"'<>.,?/\\|~-]/)
  .withMessage('Password must include a number or special character');

const allowedGenres = ['education', 'religion', 'comedy', 'fiction', 'self-help'];
const genreValidator = body('genre')
  .notEmpty()
  .withMessage('Genre is required')
  .custom((value) => allowedGenres.includes(value))
  .withMessage('Invalid genre');

const objectIdValidator = param('id')
  .custom((value) => mongoose.Types.ObjectId.isValid(value))
  .withMessage('Invalid ID');

const registerValidators = [
  body('name').notEmpty().isLength({ min: 2 }).withMessage('Name is too short'),
  body('email').isEmail().withMessage('Invalid email'),
  passwordComplexity,
  body('role').optional().isIn(['user', 'admin']),
];

const loginValidators = [
  body('email').isEmail().withMessage('Invalid email'),
  body('password').notEmpty().withMessage('Password required'),
];

const updateProfileValidators = [
  body('name').optional().isLength({ min: 2 }).withMessage('Name is too short'),
];

const audioUploadValidators = [
  body('title').notEmpty().isLength({ min: 3 }),
  genreValidator,
  body('isPrivate').optional().isBoolean(),
];

const audioUpdateValidators = [
  body('title').optional().isLength({ min: 3 }),
  genreValidator.optional(),
  body('isPrivate').optional().isBoolean(),
];

module.exports = {
  validate,
  registerValidators,
  loginValidators,
  updateProfileValidators,
  genreValidator,
  objectIdValidator,
  audioUploadValidators,
  audioUpdateValidators,
};


