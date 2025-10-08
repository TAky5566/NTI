import generateToken from '../utils/jwt.js';
import User from '../models/user.js';
import bcrypt from 'bcrypt';
import { validationResult } from 'express-validator';

async function login(req, res) {
    try{
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        throw new Error("Invalid credentials").statusCode(400);
    }
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
        throw new Error("Invalid credentials").statusCode(400);
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
        throw new Error("Invalid credentials").statusCode(400);
    }
    const token = generateToken(user);
    res.cookie("token", token, { httpOnly: true });
    res.status(200).json({ message: "Login successful" });

    }catch(error){
    next(error);
    }
}

async function register(req, res) {
    try{
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        throw new Error("Invalid credentials").statusCode(400);
    }
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (user) {
        throw new Error("User already exists").statusCode(400);
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
        email,
        password: hashedPassword,
    });
    await newUser.save();
    res.status(201).json({ message: "User registered successfully" });
    }catch(error){
    next(error);
    }
}

async function logout(req, res) {
    try{
    res.clearCookie("token");
    res.status(200).json({ message: "Logout successful" });
    }catch(error){
    next(error);
    }

}



export{login, register, logout}
