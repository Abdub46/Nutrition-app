"use client";

import { useState } from "react";

export default function Calculator() {
  const [formData, setFormData] = useState({
    age: "",
    weight: "",
    height: "",
    gender: "male",
    activityLevel: "moderate",
  });

  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  // ================== HANDLE INPUT ==================
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // ================== CALCULATIONS ==================
  const calculateBMI = (weight, height) => {
    const heightInMeters = height / 100;
    return (weight / (heightInMeters * heightInMeters)).toFixed(2);
  };

  const calculateCalories = (age, weight, height, gender, activityLevel) => {
    let bmr;

    if (gender === "male") {
      bmr = 10 * weight + 6.25 * height - 5 * age + 5;
    } else {
      bmr = 10 * weight + 6.25 * height - 5 * age - 161;
    }

    const activityMultiplier = {
      sedentary: 1.2,
      light: 1.375,
      moderate: 1.55,
      active: 1.725,
      veryActive: 1.9,
    };

    return Math.round(bmr * activityMultiplier[activityLevel]);
  };

  const calculateIdealWeight = (height, gender) => {
    if (gender === "male") {
      return (50 + 0.9 * (height - 152)).toFixed(1);
    } else {
      return (45.5 + 0.9 * (height - 152)).toFixed(1);
    }
  };

  // ================== HANDLE CALCULATE ==================
  const handleCalculate = async () => {
    setLoading(true);

    const { age, weight, height, gender, activityLevel } = formData;

    const bmi = calculateBMI(weight, height);
    const calories = calculateCalories(
      age,
      weight,
      height,
      gender,
      activityLevel
    );
    const idealWeight = calculateIdealWeight(height, gender);

    const payload = {
      age: Number(age),
      weight: Number(weight),
      height: Number(height),
      gender,
      activityLevel,
      bmi: Number(bmi),
      dailyCalories: calories,
      idealWeight: Number(idealWeight),
    };

    try {
      const res = await fetch("http://localhost:5000/api/health/bmi", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include", // IMPORTANT for auth
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("Failed to save BMI data");

      const data = await res.json();
      setResult(data);
      alert("Calculation saved successfully ✅");
    } catch (error) {
      console.error("Error saving BMI:", error);
      alert("Something went wrong.");
    }

    setLoading(false);
  };

  return (
    <div style={{ maxWidth: "600px", margin: "0 auto", padding: "40px" }}>
      <h1>BMI & Nutrition Calculator</h1>

      <input
        type="number"
        name="age"
        placeholder="Age"
        value={formData.age}
        onChange={handleChange}
      />

      <input
        type="number"
        name="weight"
        placeholder="Weight (kg)"
        value={formData.weight}
        onChange={handleChange}
      />

      <input
        type="number"
        name="height"
        placeholder="Height (cm)"
        value={formData.height}
        onChange={handleChange}
      />

      <select name="gender" value={formData.gender} onChange={handleChange}>
        <option value="male">Male</option>
        <option value="female">Female</option>
      </select>

      <select
        name="activityLevel"
        value={formData.activityLevel}
        onChange={handleChange}
      >
        <option value="sedentary">Sedentary</option>
        <option value="light">Light</option>
        <option value="moderate">Moderate</option>
        <option value="active">Active</option>
        <option value="veryActive">Very Active</option>
      </select>

      <button onClick={handleCalculate} disabled={loading}>
        {loading ? "Calculating..." : "Calculate"}
      </button>

      {result && (
        <div style={{ marginTop: "20px" }}>
          <h3>Results</h3>
          <p><strong>BMI:</strong> {result.bmi}</p>
          <p><strong>Daily Calories:</strong> {result.dailyCalories}</p>
          <p><strong>Ideal Body Weight:</strong> {result.idealWeight} kg</p>
        </div>
      )}
    </div>
  );
}



