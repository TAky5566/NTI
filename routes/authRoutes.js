const express = require('express');
const router = express.Router();
const upload = require('../config/multer');
const { register, login } = require('../controllers/authController');
const { validate, registerValidators, loginValidators } = require('../middlewares/validators');

router.post('/register', upload.single('profilePic'), registerValidators, validate, register);
router.post('/login', loginValidators, validate, login);

module.exports = router;


