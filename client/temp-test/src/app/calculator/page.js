"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Calculator() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    age: "",
    weight: "",
    height: "",
    gender: "male",
    activityLevel: "moderate",
  });

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
    let bmr =
      gender === "male"
        ? 10 * weight + 6.25 * height - 5 * age + 5
        : 10 * weight + 6.25 * height - 5 * age - 161;

    const activityMultiplier = {
      sedentary: 1.2,
      light: 1.375,
      moderate: 1.55,
      active: 1.725,
      very_active: 1.9,
    };

    return Math.round(bmr * activityMultiplier[activityLevel]);
  };

  const calculateIdealWeight = (height, gender) => {
    return gender === "male"
      ? (50 + 0.9 * (height - 152)).toFixed(1)
      : (45.5 + 0.9 * (height - 152)).toFixed(1);
  };

  // ================== HANDLE CALCULATE ==================
  const handleCalculate = async () => {
    setLoading(true);

    try {
      const { age, weight, height, gender, activityLevel } = formData;

      // Optional: validate fields
      if (!age || !weight || !height || !gender || !activityLevel) {
        alert("Please fill all fields");
        setLoading(false);
        return;
      }

      const bmi = calculateBMI(weight, height);
      const dailyCalories = calculateCalories(
        age,
        weight,
        height,
        gender,
        activityLevel
      );
      const idealBodyWeight = calculateIdealWeight(height, gender);

      const payload = {
        age: Number(age),
        weight: Number(weight),
        height: Number(height),
        gender,
        activityLevel,
        bmi: Number(bmi),
        dailyCalories,
        idealBodyWeight: Number(idealBodyWeight),
      };

      // ====================== SAVE & GENERATE AI PLAN ======================
      const response = await fetch(
        "http://localhost:5000/api/health/bmi",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include", // ensures authMiddleware can read req.user
          body: JSON.stringify(payload),
        }
      );

      if (!response.ok) {
        let errData = {};
        try {
          errData = await response.json();
        } catch (e) {
          console.error("Failed to parse backend error:", e);
        }
        console.error("Backend error:", errData);
        alert(
          "Failed to save health record. Check backend console for details."
        );
        setLoading(false);
        return;
      }

      const data = await response.json();
      console.log("BMI & AI plan saved successfully:", data);

      // Redirect seamlessly to dashboard
      router.push("/dashboard");
    } catch (error) {
      console.error("Frontend calculation error:", error);
      alert("Something went wrong. Check console for details.");
    } finally {
      setLoading(false);
    }
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
        <option value="very_active">Very Active</option>
      </select>

      <button onClick={handleCalculate} disabled={loading}>
        {loading ? "Calculating & Generating Plan..." : "Calculate & Save"}
      </button>
    </div>
  );
}
