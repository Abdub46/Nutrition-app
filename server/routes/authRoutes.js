const express = require("express");
const router = express.Router();
const { register, login, logout } = require("../controllers/authController");

// POST /api/auth/register → creates a new user
router.post("/register", register);

// POST /api/auth/login → login and set cookie
router.post("/login", login);

// POST /api/auth/logout → clear cookie
router.post("/logout", logout);

module.exports = router;


