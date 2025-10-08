import jwt from "jsonwebtoken";
require("dotenv").config();

function generateToken(user) {
    const payload = {
        userId: user._id,
        role: user.role,
    };
    const secretKey = process.env.JWT_SECRET;
    const options = { expiresIn: "1h" };

    return jwt.sign(payload, secretKey, options);
}

export default generateToken;

