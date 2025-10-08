import multer from 'multer';
import path from 'path';
import fs from 'fs';

function uploadSet(direction, limit, ...extFilters) {
  const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      const userId = req.user?._id || 'unknown';
      const uploadPath = `uploads/${direction}/${userId}`;
      fs.mkdirSync(uploadPath, { recursive: true });
      cb(null, uploadPath);
    },
    filename: function (req, file, cb) {
      cb(null, Date.now() + '-' + file.originalname);
    }
  });

  const Filter = function (req, file, cb) {
    if (!extFilters.includes(path.extname(file.originalname).toLowerCase().slice(1))) {
      return cb(new Error(`Only ${extFilters.join(', ')} files are allowed!`), false);
    }
    cb(null, true);
  };

  const limits = {
    fileSize: 1024 * 1024 * limit,
    files: 1
  };

  return multer({ storage, fileFilter: Filter, limits });
}

const uploadAudioMulter = uploadSet('audio', 50, 'mp3', 'm4a');
const uploadCoverMulter = uploadSet('cover', 5, 'jpg', 'png');
const profileMulter = uploadSet('profiles', 2, 'jpg', 'png');

module.exports = {
  uploadAudioMulter,
  uploadCoverMulter,
  profileMulter
};
