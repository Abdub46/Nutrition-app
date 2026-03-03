"use client";

import { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";


export default function Dashboard() {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  // ================== FETCH LATEST BMI + AI PLAN ==================
  const fetchLatestData = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/health/latest", {
        credentials: "include", // ensures backend authMiddleware works
      });

      if (!res.ok) throw new Error("Failed to fetch latest record");

      const data = await res.json();
      setUserData(data);
    } catch (error) {
      console.error("Error fetching latest data:", error);
      setUserData(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLatestData();
  }, []);

  const isNormalBMI =
    userData?.bmi >= 18.5 && userData?.bmi <= 24.9;

  return (
    <div style={{ padding: "40px", maxWidth: "850px", margin: "0 auto" }}>
      <h1 style={{ marginBottom: "25px" }}>AI Nutrition Planner</h1>

      {loading ? (
        <p>Loading your latest health record...</p>
      ) : userData ? (
        <>
          {/* ================== HEALTH SUMMARY ================== */}
          <div
            style={{
              background: "#3ebebe",
              padding: "25px",
              borderRadius: "10px",
              marginBottom: "30px",
              boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
            }}
          >
            <h3 style={{ marginBottom: "15px" }}>Client Health Profile</h3>

            <p><strong>Age:</strong> {userData.age}</p>
            <p><strong>Gender:</strong> {userData.gender}</p>
            <p><strong>Weight:</strong> {userData.weight} kg</p>
            <p><strong>Height:</strong> {userData.height} cm</p>
            <p><strong>BMI:</strong> {userData.bmi} kg/m²</p>
            <p><strong>Category:</strong> {userData.category}</p>
            <p><strong>Daily Calories:</strong> {userData.dailyCalories} kcal</p>

            {!isNormalBMI && userData.idealBodyWeight && (
              <p>
                <strong>Ideal Body Weight:</strong> {userData.idealBodyWeight} kg
              </p>
            )}
          </div>

          {/* ================== AI NUTRITION PLAN ================== */}
          {userData.advice && (
            <div
              style={{
                marginTop: "35px",
                padding: "25px",
                background: "#53c78b",
                borderRadius: "12px",
                lineHeight: "1.7",
                whiteSpace: "pre-line",
              }}
            >
              <h3 style={{ marginBottom: "15px" }}>
                {isNormalBMI
                  ? "Health Maintenance Plan"
                  : "Nutrition Intervention Plan"}
              </h3>

              <div className="prose max-w-none">

              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {userData.advice}
              </ReactMarkdown>

              </div>

            </div>
          )}
        </>
      ) : (
        <p>No health records found. Please use the calculator first.</p>
      )}
    </div>
  );
}















