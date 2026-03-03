const BMIHistory = require("../models/BMIHistory");
const OpenAI = require("openai");

const openai = new OpenAI({
  apiKey: process.env.OPENROUTER_API_KEY,
  baseURL: "https://openrouter.ai/api/v1",
});


// ======================
// 1️⃣ CALCULATE & SAVE BMI + AI
// ======================
const calculateAndSaveBMI = async (req, res) => {
  try {
    console.log("Received BMI payload:", req.body);
console.log("User:", req.user);


    const { age, weight, height, gender, activityLevel } = req.body;

    if (!age || !weight || !height || !gender || !activityLevel) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const heightInMeters = height / 100;
    const bmi = weight / (heightInMeters * heightInMeters);

    let category = "";
    if (bmi < 18.5) category = "Underweight";
    else if (bmi < 24.9) category = "Normal weight";
    else if (bmi < 29.9) category = "Overweight";
    else category = "Obese";

    const bmr =
      gender === "male"
        ? 10 * weight + 6.25 * height - 5 * age + 5
        : 10 * weight + 6.25 * height - 5 * age - 161;

    const activityMultiplier = {
      sedentary: 1.2,
      light: 1.375,
      moderate: 1.55,
      active: 1.725,
      veryActive: 1.9, // matches your calculator select
    };

    const multiplier = activityMultiplier[activityLevel];
    if (!multiplier) return res.status(400).json({ message: "Invalid activity level" });

    const dailyCalories = Math.round(bmr * multiplier);

    const idealBodyWeight =
      gender === "male"
        ? 50 + 0.9 * (height - 152)
        : 45.5 + 0.9 * (height - 152);

    // ---------- Save record ----------
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
      idealBodyWeight: parseFloat(idealBodyWeight.toFixed(1)),
      advice: null, // will update after AI
    });

    // ---------- Generate AI Plan ----------
    const prompt = `
You are a professional clinical nutritionist.

Create a personalized nutrition and lifestyle plan for this client:

Age: ${age}
Gender: ${gender}
BMI: ${bmi.toFixed(1)} (${category})
Daily Calories: ${dailyCalories}
Activity Level: ${activityLevel}
Ideal Weight: ${idealBodyWeight.toFixed(1)} kg

Provide:
- Nutrition advice
- Meal examples
- Lifestyle recommendations
- Structured and professional response
`;

   const aiResponse = await openai.chat.completions.create(
  {
    model: "minimax/minimax-m2.5",
    messages: [{ role: "user", content: prompt }],
  },
  {
    headers: {
      "HTTP-Referer": "http://localhost:3000", 
      "X-Title": "Nutrition App",
    },
  }
);



    const advice = aiResponse.choices[0].message.content;

    await newRecord.update({ advice });

    return res.status(200).json({
  success: true,
  data: record,
  warning: advice ? null : "AI advice could not be generated",
});

  } catch (error) {
    console.error("CALCULATE ERROR:", error);
    return res.status(500).json({ message: "Nutrition plan could not be generated" });
  }
};

// ======================
// 2️⃣ GET FULL HISTORY
// ======================
const getHistory = async (req, res) => {
  try {
    const records = await BMIHistory.findAll({
      where: { userId: req.user.id },
      order: [["createdAt", "DESC"]],
    });
    res.json(records);
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
      order: [["createdAt", "DESC"]],
    });
    if (!latestRecord) return res.status(404).json({ message: "No record found" });
    res.json(latestRecord);
  } catch (error) {
    console.error("LATEST ERROR:", error);
    res.status(500).json({ message: "Error fetching latest record" });
  }
};

module.exports = {
  calculateAndSaveBMI,
  getHistory,
  getLatest,
};


