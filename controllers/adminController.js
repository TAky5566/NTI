import Audio from "../models/Audio.js";
import fs from "fs";
import path from "path";
import { validationResult } from "express-validator";

export const getAllAudios = async (req, res) => {
  try {
    const audios = await Audio.find().populate("owner", "name email role");
    res.status(200).json(audios);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

export const deleteAudioById = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  try {
    const audio = await Audio.findById(req.params.id);
    if (!audio) return res.status(404).json({ message: "Audio not found" });

    if (audio.audioFilePath && fs.existsSync(audio.audioFilePath)) {
      fs.unlinkSync(audio.audioFilePath);
    }

    if (audio.coverImagePath && fs.existsSync(audio.coverImagePath)) {
      fs.unlinkSync(audio.coverImagePath);
    }

    await audio.deleteOne();

    res.status(200).json({ message: "Audio deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};
