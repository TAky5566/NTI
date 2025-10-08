const express = require('express');
const router = express.Router();
const { authMiddleware, authorizeRoles } = require('../middlewares/auth');
const { objectIdValidator, validate } = require('../middlewares/validators');
const { adminListAll, adminDelete } = require('../controllers/audioController');

router.get('/audios', authMiddleware, authorizeRoles('admin'), adminListAll);
router.delete('/audio/:id', authMiddleware, authorizeRoles('admin'), objectIdValidator, validate, adminDelete);

module.exports = router;


