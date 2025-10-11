import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { generateAccesToken, generateRefreshToken } from '../utils/tokenUtils.js';

const refreshTokens = async (req, res, next) => {
  const refreshToken = req.cookies['refresh-token'];
  if (!refreshToken) {
    res.clearCookie('access-token');
    return next({ status: 401, message: 'Authentication failed: No refresh token' });
  }

  try {
    const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN);

    const user = await User.findById(decoded.id).select('-password');
    if (!user) {
      res.clearCookie('access-token');
      res.clearCookie('refresh-token');
      return next({ status: 404, message: 'Authentication failed: User not found' });
    }

    const newAccessToken = generateAccesToken(user.id);
    const newRefreshToken = generateRefreshToken(user.id);

    res.cookie('access-token', newAccessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
    });
    res.cookie('refresh-token', newRefreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
    });

    req.user = user;
    next();
  } catch (error) {
    res.clearCookie('access-token');
    res.clearCookie('refresh-token');
    return next({
      status: 401,
      message: 'Authentication failed: Invalid or expired refresh token',
    });
  }
};

const authenticate = async (req, res, next) => {
  const accessToken = req.cookies['access-token'];
  const refreshToken = req.cookies['refresh-token'];

  if (!accessToken && refreshToken) {
    await refreshTokens(req, res, next);
    return;
  }

  try {
    const decoded = jwt.verify(accessToken, process.env.ACCESS_TOKEN);
    req.user = await User.findById(decoded.id).select('-password');
    next();
  } catch (err) {
    if (err.name === 'TokenExpiredError' && refreshToken) {
      await refreshTokens(req, res, next);
    } else {
      res.clearCookie('access-token');
      res.clearCookie('refresh-token');
      next({
        status: 401,
        message: 'Authentication failed: Invalid or expired access token',
      });
    }
  }
};

export default authenticate;
