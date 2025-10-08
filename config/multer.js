import multer from 'multer';
import path from 'path';
function uploadSet(direction , limit , ...extFilters) {
    let storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, `uploads/${direction}/`);
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname);
    }
});

let Filter = function (req, file, cb) {
    if (!extFilters.includes(path.extname(file.originalname).toLowerCase().slice(1))) {
        return cb(new Error(`Only ${extFilters.join(', ')} files are allowed!`), false);
    }
    cb(null, true);
};

let limits = {
    fileSize: 1024 * 1024 * limit
};

return multer({ storage, fileFilter: Filter, limits: limits });
}


let uploadAudioMulter = uploadSet('audio', 50, 'mp3', 'm4a');
let uploadCoverMulter = uploadSet('cover', 5, 'jpg', 'png');
let profileMulter = uploadSet('profiles', 2, 'jpg', 'png');

module.exports = {
    uploadAudioMulter,
    uploadCoverMulter,
    profileMulter
}