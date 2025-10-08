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
        role: 'user',
    });

    const token = generateToken(user);

    const safeUser = { _id: user._id, name: user.name, email: user.email, role: user.role };
    res.status(201).json({ message: "User Created Successfully", user: safeUser, token });
}

async function login(req, res) {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ message: "Invalid credentials" });

    const ok = await bcrypt.compare(password, user.password);
    if (!ok) return res.status(401).json({ message: "Invalid credentials" });

    const token = generateToken(user);
    res.json({ message: "Logged in", token });
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

module.exports = { signUp, login, getProfile };


