import express from 'express';
import {
  logInUser,
  registerUser,
  logoutUser,
  forgotPassword,
  resetPassword,
  verifyUser,
} from '../controllers/auth.Controller.js';
import { body , param } from 'express-validator';
import handleValidate from '../middleware/handleValidate.js';

const router = express.Router();

router.post(
  '/login',
  [
    body('email').trim().isEmail().normalizeEmail().withMessage('INVALIDE_EMAIL_OR_PASSWORD'),
    body('password').trim().notEmpty().withMessage('INVALIDE_EMAIL_OR_PASSWORD'),
  ],
  handleValidate,
  logInUser
);
router.post(
  '/register',
  [
    body('name').trim().notEmpty().withMessage('NAME_REQUIRED'), 
    body('email').trim().isEmail().normalizeEmail().withMessage('INVALIDE_EMAIL_FORMAT'),
    body('age').isNumeric().optional({ valuse: 0 }).withMessage('AGE_MUST_BE_NUMBER'),
    body('password')
      .trim()
      .isStrongPassword({
        minLength: 9,
        minLowercase: 1,
        minUppercase: 1,
        minNumbers: 1,
        minSymbols: 1,
      })
      .withMessage('WEAK_PASSWORD'),
    body('role').trim().isIn(['user', 'admin']).withMessage('INVALIDE_ROLE'),
  ],
  handleValidate,
  registerUser
);

router.get(
  '/verify/:token',
  param('token').trim().notEmpty().escape().withMessage('TOKEN_REQUIRED'),
  handleValidate, 
  verifyUser
);


router.post('/logout', logoutUser);

router.post(
  '/forgot-password',
  [body('email').trim().isEmail().normalizeEmail().withMessage('INVALIDE_EMAIL_FORMAT')],
  handleValidate,
  forgotPassword
);

router.post(
  '/reset-password/:resetToken',
  [
    body('password')
      .trim()
      .isStrongPassword({
        minLength: 9,
        minLowercase: 1,
        minUppercase: 1,
        minNumbers: 1,
        minSymbols: 1,
      })
      .withMessage('WEAK_PASSWORD'),
    param('resetToken').notEmpty().trim().escape().withMessage('INVALID_TOKEN'),
  ],
  handleValidate,
  resetPassword
);

// router.get('/refresh-token',)

export default router;
