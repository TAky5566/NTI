import mongoose from 'mongoose';

const audioSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    title: {
      type: String,
      required: true,
      minlength: 2,
      trim: true,
    },
    genre: {
      type: String,
      enum: ['pop', 'rock', 'jazz', 'classical', 'hiphop', 'electronic', 'other'],
      default: 'other',
    },
    isPrivate: {
      type: Boolean,
      default: false,
    },
    audioPath: {
      type: String,
      required: true,
    },
    audioMime: {
      type: String,
    },
    audioSize: {
      type: Number,
    },
    duration: {
      type: Number,
    },
    coverPath: {
      type: String,
    },
    plays: {
      type: Number,
      default: 0,
    },
    likes: {
      type: Number,
      default: 0,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true, 
  }
);

audioSchema.index({ user: 1, createdAt: -1 });

audioSchema.methods.isOwnedBy = function (userId) {
  return this.user.equals(userId);
};

export default mongoose.model('Audio', audioSchema);
