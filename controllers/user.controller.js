const User = require("../models/user.model");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { generateToken } = require("../utils/jwt");

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
        const user = await User.findById(req.user.userId).select("-password");
        if (!user) return res.status(404).json({ message: "User not found" });

        res.json({ message: "Your profile info:", user });
    } catch (err) {
        res.status(500).json({ message: "Error fetching profile" });
    }
}

module.exports = { signUp, getProfile };
