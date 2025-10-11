import Audio from '../models/Audio.js';
import fs from 'fs';
import path from 'path';

export const uploadAudio = async (req, res, next) => {
  try {
    const { title, genre, isPrivate } = req.body;

    if (!req.files?.audio) {
      return next({ status: 400, message: 'Audio file is required', field: 'audio' });
    }

    const audioFile = req.files.audio[0];
    const coverFile = req.files.cover ? req.files.cover[0] : null;

    const newAudio = await Audio.create({
      user: req.user._id,
      title,
      genre: genre || 'other',
      isPrivate: isPrivate === 'true',
      audioPath: audioFile.path,
      audioMime: audioFile.mimetype,
      audioSize: audioFile.size,
      coverPath: coverFile ? coverFile.path : null,
    });

    res.status(201).json({ message: 'Audio uploaded successfully', audio: newAudio });
  } catch (err) {
    next(err);
  }
};

export const getMyAudios = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const audios = await Audio.find({ user: userId }).sort({ createdAt: -1 });

    res.status(200).json(audios);
  } catch (error) {
    next(error);
  }
};

export const getAudioById = async (req, res, next) => {
  try {
    const audioId = req.params.id;

    const audio = await Audio.findById(audioId);

    if (!audio) {
      return next({ status: 404, message: 'Audio not found' });
    }

    const user = req.user;
    const isOwner = user && audio.user.toString() === user._id.toString();
    const isAdmin = user && user.role === 'admin';

    if (audio.isPrivate && !isOwner && !isAdmin) {
      return next({ status: 403, message: 'Access denied. This audio is private.' });
    }

    res.status(200).json(audio);
  } catch (err) {
    next(err);
  }
};

export const streamAudio = async (req, res, next) => {
  try {
    const audioId = req.params.id;
    const audio = await Audio.findById(audioId);

    if (!audio) {
      return next({ status: 404, message: 'Audio not found' });
    }

    const filePath = audio.audioPath;

    if (!fs.existsSync(filePath)) {
      await Audio.findByIdAndDelete(audioId);
      return next({ status: 404, message: 'Audio file not found on disk.' });
    }

    const user = req.user;
    const isOwner = user && audio.user.toString() === user._id.toString();
    const isAdmin = user && user.role === 'admin';

    if (audio.isPrivate && !isOwner && !isAdmin) {
      return next({ status: 403, message: 'Access denied. This audio is private.' });
    }

    const stat = fs.statSync(filePath);
    const fileSize = stat.size;
    const range = req.headers.range;

    if (range) {
      const parts = range.replace(/bytes=/, '').split('-');
      const start = parseInt(parts[0], 10);
      const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;
      const chunksize = end - start + 1;

      const head = {
        'Content-Range': `bytes ${start}-${end}/${fileSize}`,
        'Accept-Ranges': 'bytes',
        'Content-Length': chunksize,
        'Content-Type': audio.audioMime || 'audio/mpeg',
      };

      res.writeHead(206, head);
      const stream = fs.createReadStream(filePath, { start, end });
      stream.pipe(res);
    } else {
      const head = {
        'Content-Length': fileSize,
        'Content-Type': audio.audioMime || 'audio/mpeg',
      };
      res.writeHead(200, head);
      const stream = fs.createReadStream(filePath);
      stream.pipe(res);
    }
  } catch (err) {
    next(err);
  }
};

export const getAllAudios = async (req, res, next) => {
  try {
    const audios = await Audio.find({}).sort({ createdAt: -1 });
    res.status(200).json(audios);
  } catch (err) {
    next(err);
  }
};

export const deleteAudio = async (req, res, next) => {
  try {
    const audioId = req.params.id;
    const audio = await Audio.findById(audioId);

    if (!audio) {
      return next({ status: 404, message: 'Audio not found' });
    }

    if (audio.audioPath && fs.existsSync(audio.audioPath)) {
      fs.unlinkSync(audio.audioPath);
    }
    if (audio.coverPath && fs.existsSync(audio.coverPath)) {
      fs.unlinkSync(audio.coverPath);
    }

    await Audio.findByIdAndDelete(audioId);

    res.status(200).json({ message: 'Audio deleted successfully' });
  } catch (err) {
    next(err);
  }
};
