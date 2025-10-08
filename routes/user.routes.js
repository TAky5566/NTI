const express = require("express");
const { signUp, login, getProfile } = require("../controllers/user.controller");
const { authenticate } = require("../middlewares/authMiddleware");
const { authorizeRoles } = require("../middlewares/role.middleware");
const { validate, registerValidators, loginValidators } = require("../middlewares/validators");

const router = express.Router();

router.post("/signup", registerValidators, validate, signUp);
router.post("/login", loginValidators, validate, login);
router.get("/profile", authenticate, getProfile);
router.get("/admin/test", authenticate, authorizeRoles("admin"), (req, res) => {
    res.json({ message: "Admin access granted" });
});
router.post("/logout", authenticate, (req, res) => {
    res.json({ message: "Logged out" });
});

module.exports = router;


