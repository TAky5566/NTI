const express = require('express');
const router = express.Router();
const upload = require('../config/multer');
const { authMiddleware } = require('../middlewares/auth');
const { validate, audioUploadValidators, audioUpdateValidators, objectIdValidator } = require('../middlewares/validators');
const { uploadAudio, listPublic, listMine, streamById, updateAudio, deleteAudio } = require('../controllers/audioController');

router.post('/', authMiddleware, upload.fields([{ name: 'audio', maxCount: 1 }, { name: 'cover', maxCount: 1 }]), audioUploadValidators, validate, uploadAudio);
router.get('/', listPublic);
router.get('/mine', authMiddleware, listMine);
router.get('/stream/:id', authMiddleware, objectIdValidator, validate, streamById);
router.put('/:id', authMiddleware, upload.fields([{ name: 'cover', maxCount: 1 }]), [objectIdValidator, ...audioUpdateValidators], validate, updateAudio);
router.delete('/:id', authMiddleware, objectIdValidator, validate, deleteAudio);

module.exports = router;


