const express = require("express");
const router = express.Router();

const {
  calculateAndSaveBMI,
  getHistory,
  getLatest, // ✅ Added missing import
} = require("../controllers/healthController");

const authMiddleware = require("../middleware/authMiddleware");

// ================== ROUTES ==================

// Calculate BMI + Save
router.post("/bmi", authMiddleware, calculateAndSaveBMI);

// Get full history
router.get("/history", authMiddleware, getHistory);

// Get latest record (for dashboard)
router.get("/latest", authMiddleware, getLatest);

module.exports = router;




