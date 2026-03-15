const BMIHistory = require("../models/BMIHistory");


// ======================
// 1️⃣ CALCULATE & SAVE BMI
// ======================

const calculateAndSaveBMI = async (req, res) => {

  try {

    console.log("Received BMI payload:", req.body);
    console.log("User:", req.user);

    const { age, weight, height, gender, activityLevel } = req.body;

    if (!age || !weight || !height || !gender || !activityLevel) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // BMI Calculation
    const heightInMeters = height / 100;
    const bmi = weight / (heightInMeters * heightInMeters);

    // BMI Category
    let category = "";

    if (bmi < 18.5) category = "Underweight";
    else if (bmi < 24.9) category = "Normal weight";
    else if (bmi < 29.9) category = "Overweight";
    else category = "Obese";


    // ======================
    // BMR CALCULATION
    // ======================

    const bmr =
      gender === "male"
        ? 10 * weight + 6.25 * height - 5 * age + 5
        : 10 * weight + 6.25 * height - 5 * age - 161;


    // ======================
    // DAILY ENERGY REQUIREMENT
    // ======================

    const activityMultiplier = {
      sedentary: 1.2,
      light: 1.375,
      moderate: 1.55,
      active: 1.725,
      veryActive: 1.9,
    };

    const multiplier = activityMultiplier[activityLevel];

    if (!multiplier) {
      return res.status(400).json({ message: "Invalid activity level" });
    }

    const dailyCalories = Math.round(bmr * multiplier);


    // ======================
    // IDEAL BODY WEIGHT
    // ======================

    const idealBodyWeight =
      gender === "male"
        ? 50 + 0.9 * (height - 152)
        : 45.5 + 0.9 * (height - 152);


    // ======================
    // SAVE RECORD
    // ======================

    const newRecord = await BMIHistory.create({

      userId: req.user.id,
      age,
      weight,
      height,
      gender,
      activityLevel,

      bmi: parseFloat(bmi.toFixed(2)),
      category,

      bmr: Math.round(bmr),
      dailyCalories,

      idealBodyWeight: parseFloat(idealBodyWeight.toFixed(1))

    });


    return res.status(200).json({
      success: true,
      data: newRecord
    });

  } catch (error) {

    console.error("CALCULATE ERROR:", error);

    return res
      .status(500)
      .json({ message: "BMI record could not be saved" });

  }

};



// ======================
// 2️⃣ GET FULL HISTORY
// ======================

const getHistory = async (req, res) => {

  try {

    const records = await BMIHistory.findAll({

      where: { userId: req.user.id },
      order: [["createdAt", "ASC"]]

    });

    const history = records.map((record) => {

      const date = new Date(record.createdAt);

      const month = date.toLocaleString("default", { month: "short" });

      const weekNumber = Math.ceil(date.getDate() / 7);

      return {

        weekLabel: `${month} (${weekNumber}wk)`,

        weight: record.weight,

        bmi: record.bmi,

        createdAt: record.createdAt

      };

    });

    res.json(history);

  } catch (error) {

    console.error("HISTORY ERROR:", error);

    res.status(500).json({ message: "Error fetching history" });

  }

};



// ======================
// 3️⃣ GET LATEST RECORD
// ======================

const getLatest = async (req, res) => {

  try {

    const latestRecord = await BMIHistory.findOne({

      where: { userId: req.user.id },

      order: [["createdAt", "DESC"]]

    });

    if (!latestRecord) {
      return res.status(404).json({ message: "No record found" });
    }

    const date = new Date(latestRecord.createdAt);

    const month = date.toLocaleString("default", { month: "short" });

    const weekNumber = Math.ceil(date.getDate() / 7);

    res.json({

      ...latestRecord.toJSON(),

      weekLabel: `${month} (${weekNumber}wk)`

    });

  } catch (error) {

    console.error("LATEST ERROR:", error);

    res.status(500).json({ message: "Error fetching latest record" });

  }

};



// ======================
// EXPORTS
// ======================

module.exports = {

  calculateAndSaveBMI,
  getHistory,
  getLatest

};
