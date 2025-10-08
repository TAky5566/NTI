const jwt = require("jsonwebtoken");
require("dotenv").config();

function generateToken(userId) {
    const payload = {
        userId,
    };
    const secretKey = process.env.JWT_SECRET;
    const options = { expiresIn: "1h" };

    return jwt.sign(payload, secretKey, options);
}

module.exports = { generateToken };
