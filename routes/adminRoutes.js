import express from "express";
import { body, param } from "express-validator";
import { getAllAudios, deleteAudioById } from "../controllers/adminController.js";
import { tokenCheck, roleCheck } from "../middlewares/authMiddleware.js";

const router = express.Router();

// ✅ Get all audio files (Admin only)
router.get("/audios", tokenCheck, roleCheck("admin"), getAllAudios);

// ✅ Delete specific audio by ID (Admin only)
router.delete(
  "/audios/:id",
  tokenCheck,
  roleCheck("admin"),
  [
    param("id")
      .isMongoId()
      .withMessage("Invalid audio ID format"),
  ],
  deleteAudioById // ✅ fixed typo
);

export default router;
