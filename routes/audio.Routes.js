// routes/audioRoutes.js
import express from 'express';
import handleValidate from '../middleware/handleValidate.js';
import { param , body } from 'express-validator';
import {
  uploadAudio,
  getAudioById,
  getMyAudios,
  streamAudio,
  getAllAudios,
  deleteAudio,
} from '../controllers/audio.Controller.js';
import uploadFiles from '../middleware/uploadMiddleware.js';
import authorizeRole from '../middleware/authorizeRole.js';
import authenticate from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/upload', authenticate, uploadFiles, uploadAudio);

router.get('/myAudios', authenticate, getMyAudios);

router.get(
  '/:id',
  [param('id').isMongoId().withMessage('Invalid Audio ID')],
  handleValidate,
  authenticate,
  getAudioById
);

router.get(
  '/stream/:id',
  [param('id').isMongoId().withMessage('Invalid Audio ID')],
  handleValidate,
  authenticate,
  streamAudio
);

router.get('/admin/all', authenticate, authorizeRole('admin'), getAllAudios);

router.delete(
  '/admin/:id',
  [param('id').isMongoId().withMessage('Invalid Audio ID')],
  handleValidate,
  authenticate,
  authorizeRole('admin'),
  deleteAudio
);

export default router;
