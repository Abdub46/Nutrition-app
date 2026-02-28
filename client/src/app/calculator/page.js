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
  const [activity, setActivity] = useState("1.2");

  const [results, setResults] = useState(null);

  const calculateHealth = async () => {
    if (!age || !weight || !height) {
      alert("Fill all fields");
      return;
    }

    const hMeters = height / 100;

    // BMI
    const bmi = weight / (hMeters * hMeters);

    // BMI Category
    let category = "";
    if (bmi < 18.5) category = "Underweight";
    else if (bmi < 25) category = "Normal weight";
    else if (bmi < 30) category = "Overweight";
    else category = "Obese";

    // Ideal Body Weight (Devine Formula)
    let idealWeight;
    if (gender === "male") {
      idealWeight = 50 + 2.3 * ((height / 2.54) - 60);
    } else {
      idealWeight = 45.5 + 2.3 * ((height / 2.54) - 60);
    }

    // BMR (Mifflin-St Jeor)
    let bmr;
    if (gender === "male") {
      bmr = 66.5 + 13.7 * weight + 5 * height - 6.8 * age;
    } else {
      bmr = 665 + 9.6 * weight + 1.8 * height - 4.7 * age;
    }

    const calories = bmr * parseFloat(activity);

    const finalData = {
      bmi: bmi.toFixed(2),
      category,
      idealWeight: idealWeight.toFixed(1),
      calories: Math.round(calories),
    };

    setResults(finalData);

    // Save to backend
    try {
      await axios.post(
        "http://localhost:5000/api/health/save",
        finalData,
        { withCredentials: true }
      );
    } catch (err) {
      console.log("Save failed");
    }
  };

  return (
    <div style={{ maxWidth: "600px", margin: "40px auto" }}>
      <h1>Advanced Health Calculator</h1>

      <input type="number" placeholder="Age"
        value={age} onChange={(e) => setAge(e.target.value)} />
      <br /><br />

      <input type="number" placeholder="Weight (kg)"
        value={weight} onChange={(e) => setWeight(e.target.value)} />
      <br /><br />

      <input type="number" placeholder="Height (cm)"
        value={height} onChange={(e) => setHeight(e.target.value)} />
      <br /><br />

      <select value={gender}
        onChange={(e) => setGender(e.target.value)}>
        <option value="male">Male</option>
        <option value="female">Female</option>
      </select>
      <br /><br />

      <select value={activity}
        onChange={(e) => setActivity(e.target.value)}>
        <option value="1.2">Sedentary</option>
        <option value="1.375">Light Activity</option>
        <option value="1.55">Moderate Activity</option>
        <option value="1.725">Very Active</option>
        <option value="1.9">Super Active</option>
      </select>
      <br /><br />

      <button onClick={calculateHealth}>
        Calculate
      </button>

      {results && (
        <div style={{ marginTop: "20px" }}>
          <h3>BMI: {results.bmi} kg/m²</h3>
          <h3>Category: {results.category}</h3>
          <h3>Ideal Body Weight: {results.idealWeight} kg</h3>
          <h3>Daily Calories: {results.calories} kcals</h3>

          <button
            onClick={() => router.push("/dashboard")}
          >
            View Monthly Progress →
          </button>
        </div>
      )}
    </div>
  );
}
