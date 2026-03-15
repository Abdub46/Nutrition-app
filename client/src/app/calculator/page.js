"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import "./calculator.css";


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

  // ================== SANITIZE INPUT ==================
  const sanitizeNumber = (value) => {
    return value.replace(/[^\d.]/g, ""); // remove all except digits and dot
  };

  // ================== HANDLE INPUT ==================
  const handleChange = (e) => {
    const { name, value } = e.target;

    let sanitizedValue = value;
    if (["age", "weight", "height"].includes(name)) {
      sanitizedValue = sanitizeNumber(value);
    }

    setFormData({
      ...formData,
      [name]: sanitizedValue,
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
        ? 13.7 * weight + 5 * height - 6.8 * age + 66.5
        : 9.6 * weight + 1.8 * height - 4.7 * age + 665;

    const activityMultiplier = {
      sedentary: 1.2,
      light: 1.375,
      moderate: 1.55,
      active: 1.725,
      very_active: 1.9,
    };

    return Math.round(bmr * activityMultiplier[activityLevel]);
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
      // IDEAL BODY WEIGHT
     const heightInMeters = height / 100;
    const idealBodyWeight = (21.7 * (height * height)).toFixed(1);


    const payload = {
      weight: Number(weight),
      height: Number(height),
      bmi: Number(bmi),
      idealBodyWeight: Number(idealBodyWeight),
      dailyCalories: Number(dailyCalories)
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

      // Redirect seamlessly to dashboard after save
      router.push("/dashboard");
    } catch (error) {
      console.error("Frontend calculation error:", error);
      alert("Something went wrong. Check console for details.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="calculator-wrapper">
      {/* HEADER */}

        <h1>Energy & BMI Calculator</h1>
     
       <p> importance is to identify an individual’s nutritional condition and determine the amount of energy needed to maintain proper health and body functions.</p>
      

      {/* INPUTS SIDE BY SIDE ON LARGE SCREEN, STACKED ON MOBILE */}
      <div className="calculator-input-grid">
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

        <select
          name="gender"
          value={formData.gender}
          onChange={handleChange}
          
        >
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
      </div>

      {/* CALCULATE BUTTON */}
      <button
        onClick={handleCalculate}
        disabled={loading}
        className="w-full p-4 bg-blue-600 text-white font-semibold rounded hover:bg-blue-700 transition-colors disabled:opacity-60"
      >
        {loading ? "Calculating & Generating Plan..." : "Calculate & Save"}
      </button>
    </div>
  );
}


