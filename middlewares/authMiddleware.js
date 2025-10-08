const jwt = require("jsonwebtoken");
const User = require("../models/user.model");

async function authenticate(req, res, next) {
    const authHeader = req.headers.authorization || req.headers.Authorization;
    const token = authHeader && authHeader.split(" ")[1];

    if (!token) return res.status(401).json({ message: "Token missing" });

    try {
        const data = jwt.verify(token, process.env.JWT_SECRET);

        const user = await User.findById(data.userId).select("-password");
        if (!user) return res.status(401).json({ message: "User not found" });

        // attach the full user object (without password) to req.user
        req.user = user;
        next();
    } catch (err) {
        return res.status(403).json({ message: "Invalid or expired token" });
    }
}

module.exports = { authenticate };
