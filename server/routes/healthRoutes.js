const express = require("express");
const router = express.Router();

const {
  calculateAndSaveBMI,
  getHistory,
  getLatest,
} = require("../controllers/healthController");

const authMiddleware = require("../middleware/authMiddleware");

// ================== ROUTES ==================

// 1️⃣ Calculate BMI, save to DB, generate AI plan
router.post("/bmi", authMiddleware, calculateAndSaveBMI);

// 2️⃣ Get full BMI history
router.get("/history", authMiddleware, getHistory);

// 3️⃣ Get latest BMI record (for dashboard)
router.get("/latest", authMiddleware, getLatest);

module.exports = router;





