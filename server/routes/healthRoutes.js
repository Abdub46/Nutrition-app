const express = require("express");
const router = express.Router();

const {
  calculateAndSaveBMI,
  getHistory,
  getMonthlyHistory
} = require("../controllers/healthController");

const authMiddleware = require("../middleware/authMiddleware");

// Calculate BMI + Save
router.post("/bmi", authMiddleware, calculateAndSaveBMI);

// Get full history
router.get("/history", authMiddleware, getHistory);

// Get monthly aggregated data
router.get("/monthly", authMiddleware, getMonthlyHistory);

module.exports = router;
