"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";


export default function Calculator() {
  const router = useRouter();

  const [age, setAge] = useState("");
  const [weight, setWeight] = useState("");
  const [height, setHeight] = useState("");
  const [gender, setGender] = useState("male");
  const [activity, setActivity] = useState("sedentary");
  const [results, setResults] = useState(null);

  const calculateHealth = async () => {
    if (!age || !weight || !height || !gender || !activity) {
      alert("Fill all fields");
      return;
    }

    const heightMeters = height / 100;

    const bmi = weight / (heightMeters * heightMeters);

    let category = "";
    if (bmi < 18.5) category = "Underweight";
    else if (bmi < 25) category = "Normal weight";
    else if (bmi < 30) category = "Overweight";
    else category = "Obese";

    let idealWeight = null;
    if (category !== "Normal weight") {
      idealWeight = 21.65 * (heightMeters * heightMeters);
    }

    let bmr;
    if (gender === "male") bmr = 66.5 + 13.7 * weight + 5 * height - 6.8 * age;
    else bmr = 665 + 9.6 * weight + 1.8 * height - 4.7 * age;

    const activityMap = {
      sedentary: 1.2,
      light: 1.375,
      moderate: 1.55,
      active: 1.725,
      very_active: 1.9,
    };

    const dailyCalories = bmr * activityMap[activity] * 1.1;

    const finalData = {
      height,
      weight,
      age,
      gender,
      activityLevel: activity,
      bmi: parseFloat(bmi.toFixed(2)),
      category,
      idealBodyWeight: idealWeight
        ? parseFloat(idealWeight.toFixed(2))
        : null,
      dailyCalories: Math.round(dailyCalories),
    };

    setResults(finalData);

    try {
      await axios.post(
        "http://localhost:5000/api/health/bmi",
        finalData,
        { withCredentials: true }
      );
    } catch (err) {
      alert("Failed to save results.");
    }
  };

  return (
    <div className="calc-container">

      <h1 className="calc-title">Advanced Health Calculator</h1>

      {/* EXPLANATION SECTION */}
      <div className="info-card">
        <h2>How It Works (Under The Hood)</h2>

        <p><strong>BMI Formula:</strong> BMI = Weight (kg) ÷ Height² (m²)</p>

        <p><strong>Ideal Body Weight:</strong> 
          21.65 × Height² (m²) — used when BMI is outside normal range.
        </p>

        <p><strong>BMR (Basal Metabolic Rate):</strong> 
          Estimated using the Mifflin-St Jeor equation to determine
          how many calories your body burns at rest.
        </p>

        <p><strong>Daily Calories:</strong> 
          BMR × Activity Level multiplier to estimate total daily
          energy needs.
        </p>

        <hr />

        <h3>Why Knowing Your Nutrition Status Matters</h3>
        <p>
          Understanding your BMI, energy needs, and nutritional status
          helps you prevent chronic diseases, manage weight effectively,
          optimize performance, and maintain long-term health.
        </p>
      </div>

      {/* INPUT SECTION */}
      <div className="form-card">

        <input
          type="number"
          placeholder="Age"
          value={age}
          onChange={(e) => setAge(e.target.value)}
        />

        <input
          type="number"
          placeholder="Weight (kg)"
          value={weight}
          onChange={(e) => setWeight(e.target.value)}
        />

        <input
          type="number"
          placeholder="Height (cm)"
          value={height}
          onChange={(e) => setHeight(e.target.value)}
        />

        <select value={gender} onChange={(e) => setGender(e.target.value)}>
          <option value="male">Male</option>
          <option value="female">Female</option>
        </select>

        <select value={activity} onChange={(e) => setActivity(e.target.value)}>
          <option value="sedentary">Sedentary</option>
          <option value="light">Light Activity</option>
          <option value="moderate">Moderate Activity</option>
          <option value="active">Very Active</option>
          <option value="very_active">Super Active</option>
        </select>

        <button className="calculate-btn" onClick={calculateHealth}>
          Calculate
        </button>
      </div>

      {/* RESULTS */}
      {results && (
        <div className="result-card">
          <h3>BMI: {results.bmi} kg/m²</h3>
          <h3>Category: {results.category}</h3>
          <h3>Ideal Body Weight: {results.idealBodyWeight} kg</h3>
          <h3>Daily Calories: {results.dailyCalories} kcals</h3>

          <button
            className="progress-btn"
            onClick={() => router.push("/dashboard")}
          >
            View Monthly Progress →
          </button>
        </div>
      )}
    </div>
  );
}
