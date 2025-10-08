const User = require("../models/user.model");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { generateToken } = require("../utils/jwt");
const { validationResult } = require("express-validator");

async function signUp(req, res) {
    const { name, email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: "Email and password are required." });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
        return res.status(409).json({ message: "Email already in use." });
    }

    const hashedPass = await bcrypt.hash(password, 12);

    const user = await User.create({
        name,
        email,
        password: hashedPass,
    });

    const token = generateToken(user._id);

    console.log(token);

    res.status(201).json({
        message: "User Created Successfully",
        token,
    });
}

async function getProfile(req, res) {
    try {
    const user = await User.findById(req.user._id).select("-password");
        if (!user) return res.status(404).json({ message: "User not found" });

        res.json({ message: "Your profile info:", user });
    } catch (err) {
        res.status(500).json({ message: "Error fetching profile" });
    }
}

async function updateProfile(req, res) {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            // if multer uploaded a file, remove it on validation error
            if (req.file && req.file.path) {
                const fs = require('fs');
                fs.unlink(req.file.path, () => {});
            }
            return res.status(400).json({ errors: errors.array() });
        }

    const user = await User.findById(req.user._id);
        if (!user) return res.status(404).json({ message: 'User not found' });

        const { name } = req.body;
        if (name) user.name = name;

        if (req.file) {
            // store path relative to project root
            user.profilePic = req.file.path.replace(/\\/g, '/');
        }

        await user.save();

        const sanitized = user.toObject();
        delete sanitized.password;

        res.json({ message: 'Profile updated', user: sanitized });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error updating profile' });
    }
}

module.exports = { signUp, getProfile, updateProfile };
