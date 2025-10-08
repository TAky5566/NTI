const express = require("express");
const Post = require("../models/post.model");
const { signUp, getProfile } = require("../controllers/user.controller");
const { authenticate } = require("../middlewares/authMiddleware");

const router = express.Router();

router.post("/signup", signUp);
router.get("/profile", authenticate, getProfile);

module.exports = router;
