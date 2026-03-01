"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

export default function Calculator() {
  const router = useRouter();

  // User inputs
  const [age, setAge] = useState("");
  const [weight, setWeight] = useState("");
  const [height, setHeight] = useState("");
  const [gender, setGender] = useState("male");
  const [activity, setActivity] = useState("sedentary"); // backend key

  // Calculated results
  const [results, setResults] = useState(null);

  const calculateHealth = async () => {
    if (!age || !weight || !height || !gender || !activity) {
      alert("Fill all fields");
      return;
    }

    const heightMeters = height / 100;

    // BMI
    const bmi = weight / (heightMeters * heightMeters);

    // BMI Category
    let category = "";
    if (bmi < 18.5) category = "Underweight";
    else if (bmi < 25) category = "Normal weight";
    else if (bmi < 30) category = "Overweight";
    else category = "Obese";

    
  // Ideal Body Weight (BMI-based, only if not normal)
  let idealWeight = null;
  if (category !== "Normal weight") {
    idealWeight = 21.65 * (heightMeters * heightMeters);
  }

    // BMR (Mifflin-St Jeor)
    let bmr;
    if (gender === "male") bmr = 66.5 + 13.7 * weight + 5 * height - 6.8 * age;
    else bmr = 665 + 9.6 * weight + 1.8 * height - 4.7 * age;

    // Activity multipliers (backend must match these keys)
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
      activityLevel: activity, // matches backend
      bmi: parseFloat(bmi.toFixed(2)),
      category,
      idealBodyWeight: idealWeight ? parseFloat(idealWeight.toFixed(2)) : null, // ✅ match DB column
      dailyCalories: Math.round(dailyCalories),
    };

    setResults(finalData);

    try {
      await axios.post(
        "http://localhost:5000/api/health/bmi",
        finalData,
        { withCredentials: true }
      );
      console.log("Saved successfully");
    } catch (err) {
      console.error("Save failed:", err.response?.data || err.message);
      alert("Failed to save results. Check console for details.");
    }
  };

  return (
    <div style={{ maxWidth: "600px", margin: "40px auto", fontFamily: "Arial, sans-serif" }}>
      <h1>Advanced Health Calculator</h1>

      <input
        type="number"
        placeholder="Age"
        value={age}
        onChange={(e) => setAge(e.target.value)}
      />
      <br /><br />

      <input
        type="number"
        placeholder="Weight (kg)"
        value={weight}
        onChange={(e) => setWeight(e.target.value)}
      />
      <br /><br />

      <input
        type="number"
        placeholder="Height (cm)"
        value={height}
        onChange={(e) => setHeight(e.target.value)}
      />
      <br /><br />

      <select value={gender} onChange={(e) => setGender(e.target.value)}>
        <option value="male">Male</option>
        <option value="female">Female</option>
      </select>
      <br /><br />

      <select value={activity} onChange={(e) => setActivity(e.target.value)}>
        <option value="sedentary">Sedentary</option>
        <option value="light">Light Activity</option>
        <option value="moderate">Moderate Activity</option>
        <option value="active">Very Active</option>
        <option value="very_active">Super Active</option>
      </select>
      <br /><br />

      <button onClick={calculateHealth} style={{ padding: "10px 20px", cursor: "pointer" }}>
        Calculate
      </button>

      {results && (
        <div style={{ marginTop: "20px", border: "1px solid #ddd", padding: "15px", borderRadius: "8px", background: "#f9f9f9" }}>
          <h3>BMI: {results.bmi} kg/m²</h3>
          <h3>Category: {results.category}</h3>
          <h3>Ideal Body Weight: {results.idealWeight} kg</h3>
          <h3>Daily Calories: {results.dailyCalories} kcals</h3>

          <button
            style={{ marginTop: "10px", padding: "8px 16px", cursor: "pointer" }}
            onClick={() => router.push("/dashboard")}
          >
            View Monthly Progress →
          </button>
        </div>
      )}
    </div>
  );
}
