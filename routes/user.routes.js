const express = require("express");
const Post = require("../models/post.model");
const { signUp, getProfile } = require("../controllers/user.controller");
const { authenticate } = require("../middlewares/authMiddleware");
const { profileMulter } = require("../config/multer");
const { body } = require("express-validator");
const { updateProfile } = require("../controllers/user.controller");

const router = express.Router();

router.post("/signup", signUp);
router.get("/profile", authenticate, getProfile);
router.put(
	"/profile",
	authenticate,
	profileMulter.single('profilePic'),
	body('name').optional().isLength({ min: 3 }).withMessage('Name must be at least 3 characters'),
	updateProfile
);

module.exports = router;
