const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

async function register(req, res, next) {
  try {
    const { name, email, password, role } = req.body;
    const exists = await User.findOne({ email });
    if (exists) {
      const err = new Error('Email already in use');
      err.statusCode = 409;
      throw err;
    }
    const hashed = await bcrypt.hash(password, 12);
    const profilePic = req.file ? req.file.path : undefined;
    const user = await User.create({ name, email, password: hashed, role: role || 'user', profilePic });
    const token = jwt.sign({ userId: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES || '7d' });
    const safe = { _id: user._id, name: user.name, email: user.email, role: user.role, profilePic: user.profilePic };
    res.status(201).json({ message: 'Registered', user: safe, token });
  } catch (err) {
    next(err);
  }
}

async function login(req, res, next) {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ message: 'Invalid credentials' });
    const ok = await bcrypt.compare(password, user.password);
    if (!ok) return res.status(401).json({ message: 'Invalid credentials' });
    const token = jwt.sign({ userId: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES || '7d' });
    res.json({ message: 'Logged in', token });
  } catch (err) {
    next(err);
  }
}

module.exports = { register, login };


