"use client";

import { useEffect, useState } from "react";

export default function Dashboard() {
  const [userData, setUserData] = useState(null);
  const [aiPlan, setAiPlan] = useState("");
  const [loading, setLoading] = useState(false);

  // ================= FETCH LATEST CALCULATOR DATA =================
  useEffect(() => {
    const fetchLatestData = async () => {
      try {
        const res = await fetch(
          "http://localhost:5000/api/health/latest",
          { credentials: "include" }
        );

        if (!res.ok) throw new Error("Failed to fetch data");

        const data = await res.json();
        setUserData(data);


      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchLatestData();
  }, []);

  // ================= GENERATE AI PLAN =================
  const generateAIPlan = async () => {
    if (!userData) return;

    setLoading(true);
    setAiPlan("");

    try {
      const res = await fetch(
        "http://localhost:5000/api/ai-suggestions",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({
            age: userData.age,
            weight: userData.weight,
            height: userData.height,
            gender: userData.gender,
            activityLevel: userData.activityLevel,
            bmi: userData.bmi,
            category: userData.category,
            calories: userData.calories,
            idealBodyWeight: userData.idealBodyWeight || null,
          }),
        }
      );

      if (!res.ok) throw new Error("AI request failed");

      const data = await res.json();
      setAiPlan(data.result);




              const updated = await fetch(
          "http://localhost:5000/api/health/latest",
          { credentials: "include" }
        );
        const updatedData = await updated.json();
        setUserData(updatedData);









      // Optional: Save plan
      await fetch("http://localhost:5000/api/ai/save-plan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          ...userData,
          aiPlan: data.result,
        }),
      });

    } catch (error) {
      console.error("AI generation error:", error);
      alert("Failed to generate AI plan.");
    }

    setLoading(false);
  };

  const isNormal =
    userData?.bmi >= 18.5 && userData?.bmi <= 24.9;

  return (
    <div style={{ padding: "40px", maxWidth: "850px", margin: "0 auto" }}>
      <h1 style={{ marginBottom: "25px" }}>
        AI Nutrition Planner
      </h1>

      {/* ================= USER SUMMARY ================= */}
      {userData ? (
        <div
          style={{
            background: "#3ebebe",
            padding: "25px",
            borderRadius: "10px",
            marginBottom: "30px",
            boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
          }}
        >
          <h3 style={{ marginBottom: "15px" }}>
            Client Health Profile
          </h3>

          {/*<p><strong>Age:</strong> {userData.age}</p>
          <p><strong>Gender:</strong> {userData.gender}</p>
          <p><strong>Weight:</strong> {userData.weight} kg</p>
          <p><strong>Height:</strong> {userData.height} cm</p>*/}
          <p><strong>BMI:</strong> {userData.bmi} kg/m2</p>
          <p><strong>Category:</strong> {userData.category}</p>
          <p><strong>Daily Calories:</strong> {userData.dailyCalories} kcal</p>
          {/*<p><strong>Activity Level:</strong> {userData.activityLevel}</p>*/}

          {!isNormal && userData.idealBodyWeight && (
            <p>
              <strong>Ideal Body Weight:</strong>{" "}
              {userData.idealBodyWeight} kg
            </p>
          )}
        </div>
      ) : (
        <p>Loading health data...</p>
      )}

      {/* ================= GENERATE BUTTON ================= */}
      {userData && (
        <button
          onClick={generateAIPlan}
          style={{
            padding: "12px 30px",
            backgroundColor: "#0f172a",
            color: "#fff",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
            fontWeight: "600",
          }}
        >
          {loading ? "Generating Plan..." : "Generate Nutrition Plan"}
        </button>
      )}

      {/* ================= AI OUTPUT ================= */}




      {(aiPlan || userData?.advice) && (
  <div
    style={{
      marginTop: "35px",
      padding: "25px",
      background: "#53b7c7",
      borderRadius: "12px",
      lineHeight: "1.7",
    }}
  >
    <h3 style={{ marginBottom: "15px" }}>
      {isNormal
        ? "Health Maintenance Plan"
        : "Nutrition Intervention Plan"}
    </h3>

    <p style={{ whiteSpace: "pre-line" }}>
      {aiPlan || userData.advice}
    </p>
  </div>
)}










    </div>
  );
}


