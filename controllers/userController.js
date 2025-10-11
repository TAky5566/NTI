import User from '../models/User.js';
import fs from 'fs';

export const getProfile = async (req, res, next) => {
  try {
    res.status(200).json(req.user);
  } catch (err) {
    next(err);
  }
};

export const updateProfile = async (req, res, next) => {
  try {
    const user = req.user;
    if (!user) {
      return next({ status: 404, message: 'User not found' });
    }

    const { name } = req.body;
    const profilePic = req.files?.profilePic?.[0]?.path;

    if (name) user.name = name;

    if (profilePic) {
      if (user.profilePic && fs.existsSync(user.profilePic)) {
        fs.unlinkSync(user.profilePic);
      }
      user.profilePic = profilePic;
    }

    await user.save();

    res.status(200).json({
      message: 'Profile updated successfully',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        profilePic: user.profilePic,
      },
    });
  } catch (err) {
    next(err);
  }
};

export const getProfileById = async (req, res, next) => {
  try {
    const userId = req.params.id;
    const user = await User.findById(userId).select('-password');

    if (!user) {
      return next({ status: 404, message: 'User not found' });
    }

    res.status(200).json(user);
  } catch (err) {
    next(err);
  }
};
