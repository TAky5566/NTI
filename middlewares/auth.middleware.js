import jwt from 'jsonwebtoken'
require('dotenv').config();


function roleCheck(role) {
return function(req , res , next) {
    const authHeader = req.cookies.token;
    if (!authHeader) {
        next({ message: 'No token provided' , statusCode: 401 });
        return;
    }
    //Bearer Token
    const token = authHeader.split(' ')[1];
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if (decoded.role !== role) {
            next({ message: 'Unauthorized' , statusCode: 403 });
            return;
        }
        req.user = decoded;
        next();
    } catch (err) {
        next({ message: 'Invalid token' , statusCode: 401 });
    }
    }
}

function tokenCheck(req, res, next) {
    const authHeader = req.cookies.token;
    if (!authHeader) {
        next({ message: 'No token provided' , statusCode: 401 });
        return;
    }
    //Bearer Token
    const token = authHeader.split(' ')[1];
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (err) {
        next({ message: 'Invalid token' , statusCode: 401 });
    }
}

module.exports = {
    roleCheck,
    tokenCheck
}