const express = require("express");
const router = express.Router();
const BMIHistory = require("../models/BMIHistory");
const authMiddleware = require("../middleware/authMiddleware");

/* ======================================================
   GENERATE AI PLAN & UPDATE LATEST RECORD
====================================================== */
router.post("/", authMiddleware, async (req, res) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    /* ---------- Find Latest BMI Record ---------- */
    const latestRecord = await BMIHistory.findOne({
      where: { userId: req.user.id },
      order: [["createdAt", "DESC"]],
    });

    if (!latestRecord) {
      return res.status(404).json({ message: "No BMI record found" });
    }

    /* ---------- Generate AI Plan (Simple Logic for Now) ---------- */
    let aiPlan;

    switch (latestRecord.category) {
      case "Underweight":
        aiPlan = `
Increase calorie intake with nutrient-dense foods.
Include healthy fats, whole grains, and protein-rich meals.
Eat 5–6 small meals daily.
Strength training 3–4 times per week.
        `;
        break;

      case "Normal weight":
        aiPlan = `
Maintain balanced nutrition.
Continue moderate physical activity.
Monitor weight monthly.
Ensure adequate hydration and sleep.
        `;
        break;

      case "Overweight":
        aiPlan = `
Create moderate calorie deficit (~500 kcal/day).
Increase fiber intake.
Engage in at least 150 minutes cardio weekly.
Limit processed foods and sugary drinks.
        `;
        break;

      case "Obese":
        aiPlan = `
Structured weight-loss program required.
Focus on vegetables, lean protein, whole grains.
Daily physical activity (walking 30–45 mins).
Consider clinical follow-up if necessary.
        `;
        break;

      default:
        aiPlan = "General healthy eating and physical activity recommended.";
    }

    /* ---------- UPDATE Existing Record ---------- */
    latestRecord.advice = aiPlan.trim();
    await latestRecord.save();

    res.json({
      success: true,
      message: "AI Nutrition Plan Generated & Saved",
      record: latestRecord,
    });

  } catch (error) {
    console.error("AI PLAN ERROR:", error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;


