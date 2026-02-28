const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");

// Protected route to get current user info
router.get("/me", authMiddleware, (req, res) => {
  res.status(200).json({
    message: "User profile fetched successfully",
    user: req.user, // Set by authMiddleware
  });
});

module.exports = router;
