const fs = require('fs');
const path = require('path');
const Audio = require('../models/Audio');

async function uploadAudio(req, res, next) {
  try {
    const audioFile = req.files?.audio?.[0];
    const coverFile = req.files?.cover?.[0];
    if (!audioFile) {
      const err = new Error('Audio file is required');
      err.statusCode = 400;
      throw err;
    }
    const { title, genre, isPrivate } = req.body;
    const doc = await Audio.create({
      user: req.user.userId,
      title,
      genre,
      isPrivate: Boolean(isPrivate) === true || isPrivate === 'true',
      audioPath: audioFile.path,
      coverPath: coverFile ? coverFile.path : undefined,
    });
    res.status(201).json(doc);
  } catch (err) {
    next(err);
  }
}

async function listPublic(req, res, next) {
  try {
    const list = await Audio.find({ isPrivate: false }).populate('user', 'name');
    res.json(list);
  } catch (err) {
    next(err);
  }
}

async function listMine(req, res, next) {
  try {
    const list = await Audio.find({ user: req.user.userId });
    res.json(list);
  } catch (err) {
    next(err);
  }
}

async function streamById(req, res, next) {
  try {
    const audio = await Audio.findById(req.params.id);
    if (!audio) return res.status(404).json({ message: 'Not found' });
    if (audio.isPrivate && audio.user.toString() !== req.user.userId && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Forbidden' });
    }
    const filePath = path.resolve(audio.audioPath);
    if (!fs.existsSync(filePath)) return res.status(404).json({ message: 'File missing' });
    const stat = fs.statSync(filePath);
    const range = req.headers.range;
    if (!range) {
      res.setHeader('Content-Length', stat.size);
      res.setHeader('Content-Type', 'audio/mpeg');
      fs.createReadStream(filePath).pipe(res);
    } else {
      const [startStr, endStr] = range.replace(/bytes=/, '').split('-');
      const start = parseInt(startStr, 10);
      const end = endStr ? parseInt(endStr, 10) : stat.size - 1;
      const chunkSize = end - start + 1;
      res.writeHead(206, {
        'Content-Range': `bytes ${start}-${end}/${stat.size}`,
        'Accept-Ranges': 'bytes',
        'Content-Length': chunkSize,
        'Content-Type': 'audio/mpeg',
      });
      fs.createReadStream(filePath, { start, end }).pipe(res);
    }
    // increment play count async
    Audio.findByIdAndUpdate(audio._id, { $inc: { playCount: 1 } }).catch(() => {});
  } catch (err) {
    next(err);
  }
}

async function updateAudio(req, res, next) {
  try {
    const audio = await Audio.findById(req.params.id);
    if (!audio) return res.status(404).json({ message: 'Not found' });
    if (audio.user.toString() !== req.user.userId && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Forbidden' });
    }
    if (req.body.title) audio.title = req.body.title;
    if (req.body.genre) audio.genre = req.body.genre;
    if (typeof req.body.isPrivate !== 'undefined') audio.isPrivate = req.body.isPrivate === 'true' || req.body.isPrivate === true;
    const newCover = req.files?.cover?.[0];
    if (newCover) {
      if (audio.coverPath && fs.existsSync(audio.coverPath)) {
        try { fs.unlinkSync(audio.coverPath); } catch {}
      }
      audio.coverPath = newCover.path;
    }
    await audio.save();
    res.json(audio);
  } catch (err) {
    next(err);
  }
}

async function deleteAudio(req, res, next) {
  try {
    const audio = await Audio.findById(req.params.id);
    if (!audio) return res.status(404).json({ message: 'Not found' });
    if (audio.user.toString() !== req.user.userId && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Forbidden' });
    }
    try { if (audio.audioPath && fs.existsSync(audio.audioPath)) fs.unlinkSync(audio.audioPath); } catch {}
    try { if (audio.coverPath && fs.existsSync(audio.coverPath)) fs.unlinkSync(audio.coverPath); } catch {}
    await audio.deleteOne();
    res.json({ message: 'Deleted' });
  } catch (err) {
    next(err);
  }
}

async function adminListAll(req, res, next) {
  try {
    const list = await Audio.find({}).populate('user', 'name email');
    res.json(list);
  } catch (err) {
    next(err);
  }
}

async function adminDelete(req, res, next) {
  try {
    const audio = await Audio.findById(req.params.id);
    if (!audio) return res.status(404).json({ message: 'Not found' });
    try { if (audio.audioPath && fs.existsSync(audio.audioPath)) fs.unlinkSync(audio.audioPath); } catch {}
    try { if (audio.coverPath && fs.existsSync(audio.coverPath)) fs.unlinkSync(audio.coverPath); } catch {}
    await audio.deleteOne();
    res.json({ message: 'Deleted' });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  uploadAudio,
  listPublic,
  listMine,
  streamById,
  updateAudio,
  deleteAudio,
  adminListAll,
  adminDelete,
};


