const mongoose = require('mongoose');

const audioSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true, minlength: 3 },
    genre: { type: String, required: true },
    isPrivate: { type: Boolean, default: false },
    audioPath: { type: String, required: true },
    coverPath: { type: String },
    playCount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Audio', audioSchema);


