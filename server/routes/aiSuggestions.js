const express = require("express");
const router = express.Router();
const BMIHistory = require("../models/BMIHistory");
const authMiddleware = require("../middleware/authMiddleware");
const OpenAI = require("openai");

const openai = new OpenAI({
  apiKey: process.env.OPENROUTER_API_KEY,
});

/* ======================================================
   GENERATE DYNAMIC AI PLAN & UPDATE LATEST RECORD
====================================================== */
router.post("/", authMiddleware, async (req, res) => {
  try {
    // ✅ Check user
    if (!req.user || !req.user.id) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    // ✅ Get latest BMI record
    const latestRecord = await BMIHistory.findOne({
      where: { userId: req.user.id },
      order: [["createdAt", "DESC"]],
    });

    if (!latestRecord) {
      return res.status(404).json({ message: "No BMI record found" });
    }

    // ✅ Extract necessary data
    const {
      age,
      gender,
      activityLevel,
      bmi,
      category,
      dailyCalories,
      idealBodyWeight,
      bmr,
    } = latestRecord;

    // ✅ Prepare AI prompt
    const prompt = `
You are a licensed clinical nutritionist.

Design a fully personalized nutrition plan based on the client's health profile.

Age: ${age}
Gender: ${gender}
BMI: ${bmi.toFixed(1)} (${category})
BMR: ${bmr} kcal
Daily Calories: ${dailyCalories.toFixed(0)}
Activity Level: ${activityLevel}
Ideal Body Weight: ${idealBodyWeight || "N/A"}

Provide:
1. Clinical Nutrition Assessment
2. Calorie & Macronutrient Breakdown
3. Personalized Dietary Strategy
4. Activity-Based Adjustments
5. Age-Specific Considerations
6. Sample 7-Day Meal Plan
7. Monitoring & Follow-Up Plan

Tone must be evidence-based and individualized.
`;

    // ✅ Call OpenAI
    const aiResponse = await openai.chat.completions.create({
      model: "minimax/minimax-m2.5",
      messages: [
        {
          role: "system",
          content:
            "You are an expert clinical nutritionist providing medical-grade dietary planning.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: 0.7,
    });

    const advice = aiResponse.choices[0].message.content;

    // ✅ Update the record with AI advice
    await latestRecord.update({ advice });

    res.status(200).json({
  success: true,
  data: record,
  warning: advice ? null : "AI advice could not be generated",
});
  } catch (error) {
    console.error("AI PLAN ERROR:", error);
    res.status(500).json({ message: "Failed to generate AI plan" });
  }
});

module.exports = router;




