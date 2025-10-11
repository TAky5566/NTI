import express from 'express';
import { getProfile, updateProfile , getProfileById } from '../controllers/userController.js';
import { body , param } from 'express-validator';
import authenticate from '../middleware/authMiddleware.js';
import authorizeRole from '../middleware/authorizeRole.js';
import uploadFiles from '../middleware/uploadMiddleware.js';
import handleValidate from '../middleware/handleValidate.js';


const router = express.Router();

router.get('/profile', authenticate, getProfile);


router.put(
  '/profile',
  authenticate,
  uploadFiles,
  [body('name').optional().isLength({ min: 3 }).withMessage('Name must be at least 3 characters')],
  handleValidate,
  updateProfile
);


router.get(
  '/profile/:id',
  [param('id').isMongoId().withMessage('Invalid User ID')],
  handleValidate,
  getProfileById
);

router.get('/admin-dashboard', authenticate, authorizeRole('admin'), (req, res) => {
  res.status(200).json({ message: 'Welcome to the admin dashboard!' });
});


export default router;
