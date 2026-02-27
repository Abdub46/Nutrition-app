const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");

const BMIHistory = require("../models/BMIHistory");

router.post("/bmi", authMiddleware, async (req, res) => {
  try {
    const { height, weight, age, gender, activityLevel } = req.body;

    if (!height || !weight || !age || !gender || !activityLevel) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const heightInMeters = height / 100;

    // BMI
    const bmi = weight / (heightInMeters * heightInMeters);

    let category = "";
    if (bmi < 18.5) category = "Underweight";
    else if (bmi < 25) category = "Normal weight";
    else if (bmi < 30) category = "Overweight";
    else category = "Obese";

    // BMR
    let bmr;
    if (gender.toLowerCase() === "male") {
      bmr = 66.5 + 13.7 * weight + 5 * height - 6.8 * age;
    } else {
      bmr = 665 + 9.6 * weight + 1.8 * height - 4.7 * age;
    }

    // Activity factor
    const activityMap = {
      sedentary: 1.2,
      light: 1.375,
      moderate: 1.55,
      active: 1.725,
      very_active: 1.9
    };
    const multiplier = activityMap[activityLevel.toLowerCase()];
    if (!multiplier) return res.status(400).json({ message: "Invalid activity level" });

    const dailyCalories = bmr * multiplier * 1.1;

    // Ideal Body Weight
    let idealBodyWeight = null;
    if (category !== "Normal weight") {
      idealBodyWeight = 21.65 * (heightInMeters * heightInMeters);
    }


    // ✅ Generate advice
    let advice = "";
    switch (category) {
      case "Underweight":
        advice = "Increase calorie intake with protein-rich and healthy fats. Consider small, frequent meals.";
        break;
      case "Normal weight":
        advice = "Maintain current habits, balance diet and activity.";
        break;
      case "Overweight":
        advice = "Reduce calories slightly, increase activity, focus on portion control.";
        break;
      case "Obese":
        advice = "Strongly reduce calories, emphasize vegetables and lean protein, avoid sugar, increase physical activity.";
        break;
      default:
        advice = "";
    }





    // ✅ Save to DB
    const bmiRecord = await BMIHistory.create({
      userId: req.user.id,
      bmi: bmi.toFixed(2),
      category,
      bmr: Math.round(bmr),
      dailyCalories: Math.round(dailyCalories),
      idealBodyWeight: idealBodyWeight ? idealBodyWeight.toFixed(2) : null
    });

    res.json({
      message: "BMI record saved",
      record: bmiRecord
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});


// GET all BMI history for logged-in user
router.get("/history", authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;

    const records = await BMIHistory.findAll({
      where: { userId },
      order: [["createdAt", "ASC"]] // earliest to latest
    });

    if (records.length === 0) {
      return res.status(404).json({ message: "No BMI records found" });
    }

    res.json({
      message: "BMI history retrieved successfully",
      records
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});







module.exports = router;
