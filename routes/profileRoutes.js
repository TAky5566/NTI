const express = require('express');
const router = express.Router();
const upload = require('../config/multer');
const { authMiddleware } = require('../middlewares/auth');
const { getProfile, updateProfile } = require('../controllers/profileController');
const { validate, updateProfileValidators } = require('../middlewares/validators');

router.get('/profile', authMiddleware, getProfile);
router.put('/profile', authMiddleware, upload.single('profilePic'), updateProfileValidators, validate, updateProfile);

module.exports = router;


