const BMIHistory = require("../models/BMIHistory");
const Sequelize = require("sequelize");

/* ======================================================
   CALCULATE & SAVE BMI
====================================================== */
exports.calculateAndSaveBMI = async (req, res) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const { height, weight, age, gender, activityLevel } = req.body;

    if (!height || !weight || !age || !gender || !activityLevel) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const heightInMeters = Number(height) / 100;
    const weightNum = Number(weight);
    const ageNum = Number(age);

    /* ---------- BMI ---------- */
    const bmi = weightNum / (heightInMeters * heightInMeters);

    let category;
    if (bmi < 18.5) category = "Underweight";
    else if (bmi < 25) category = "Normal weight";
    else if (bmi < 30) category = "Overweight";
    else category = "Obese";

    /* ---------- BMR ---------- */
    let bmr;
    if (gender.toLowerCase() === "male") {
      bmr = 66.5 + 13.7 * weightNum + 5 * Number(height) - 6.8 * ageNum;
    } else {
      bmr = 665 + 9.6 * weightNum + 1.8 * Number(height) - 4.7 * ageNum;
    }

    /* ---------- Activity Multiplier ---------- */
    const activityMap = {
      sedentary: 1.2,
      light: 1.375,
      moderate: 1.55,
      active: 1.725,
      very_active: 1.9,
    };

    const multiplier = activityMap[activityLevel.toLowerCase()];
    if (!multiplier) {
      return res.status(400).json({ message: "Invalid activity level" });
    }

    const dailyCalories = bmr * multiplier * 1.1;

    /* ---------- Ideal Body Weight ---------- */
    let idealBodyWeight = null;
    if (category !== "Normal weight") {
      idealBodyWeight = 21.65 * (heightInMeters * heightInMeters);
    }

    /* ---------- Advice ---------- */
    let advice;
    switch (category) {
      case "Underweight":
        advice =
          "Increase calorie intake with protein-rich foods and healthy fats. Eat small frequent meals.";
        break;
      case "Normal weight":
        advice =
          "Maintain balanced diet and regular physical activity.";
        break;
      case "Overweight":
        advice =
          "Reduce calorie intake moderately and increase physical activity.";
        break;
      case "Obese":
        advice =
          "Adopt structured weight-loss plan. Focus on vegetables, lean proteins and daily exercise.";
        break;
    }

    /* ---------- Save to DB ---------- */
    const bmiRecord = await BMIHistory.create({
      userId: req.user.id,
      bmi: parseFloat(bmi.toFixed(2)),
      category,
      bmr: Math.round(bmr),
      dailyCalories: Math.round(dailyCalories),
      idealBodyWeight: idealBodyWeight
        ? parseFloat(idealBodyWeight.toFixed(2))
        : null,
      advice,
    });

    res.status(201).json({
      success: true,
      message: "BMI record saved successfully",
      record: bmiRecord,
    });

  } catch (error) {
    console.error("SAVE ERROR:", error);
    res.status(500).json({ message: "Server error" });
  }
};

/* ======================================================
   GET FULL HISTORY
====================================================== */
exports.getHistory = async (req, res) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const records = await BMIHistory.findAll({
      where: { userId: req.user.id },
      order: [["createdAt", "ASC"]],
    });

    res.json(records);

  } catch (error) {
    console.error("FETCH ERROR:", error);
    res.status(500).json({ message: "Error fetching history" });
  }
};

/* ======================================================
   GET MONTHLY AGGREGATED HISTORY
====================================================== */
exports.getMonthlyHistory = async (req, res) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const records = await BMIHistory.findAll({
      attributes: [
        [
          Sequelize.fn(
            "DATE_TRUNC",
            "month",
            Sequelize.col("createdAt")
          ),
          "month",
        ],
        [Sequelize.fn("AVG", Sequelize.col("bmi")), "avgBMI"],
        [
          Sequelize.fn("AVG", Sequelize.col("dailyCalories")),
          "avgCalories",
        ],
      ],
      where: { userId: req.user.id },
      group: [
        Sequelize.fn(
          "DATE_TRUNC",
          "month",
          Sequelize.col("createdAt")
        ),
      ],
      order: [
        [
          Sequelize.fn(
            "DATE_TRUNC",
            "month",
            Sequelize.col("createdAt")
          ),
          "ASC",
        ],
      ],
      raw: true,
    });

    res.json(records);

  } catch (error) {
    console.error("MONTHLY ERROR:", error);
    res.status(500).json({ message: "Error fetching monthly data" });
  }
};
