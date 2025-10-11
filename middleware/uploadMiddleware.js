import multer from 'multer';
import fs from 'fs';
import path from 'path';

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    try {
      let folderType = 'others';
      if (file.fieldname === 'audio') folderType = 'audio';
      if (file.fieldname === 'cover') folderType = 'cover';
      if (file.fieldname === 'profilePic') folderType = 'profile';

      const userId = req.user?._id || 'unknown_user';

      const uploadPath = path.join('uploads', folderType, `user_${userId}`);

      fs.mkdirSync(uploadPath, { recursive: true });

      cb(null, uploadPath);
    } catch (err) {
      cb(err, null);
    }
  },

  filename: (req, file, cb) => {
    const uniqueName = Date.now() + '-' + file.originalname;
    cb(null, uniqueName);
  },
});

const fileFilter = (req, file, cb) => {
  if (file.fieldname === 'audio' && file.mimetype.startsWith('audio/')) {
    cb(null, true);
  } else if (file.fieldname === 'cover' && file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else if (file.fieldname === 'profilePic' && file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type or field name'), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 50 * 1024 * 1024 },
});

const uploadFiles = upload.fields([
  { name: 'audio', maxCount: 1 },
  { name: 'cover', maxCount: 1 },
  { name: 'profilePic', maxCount: 1 },
]);
export default uploadFiles