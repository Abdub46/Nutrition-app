"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export default function Dashboard() {
  const router = useRouter();
  const [bmiRecords, setBmiRecords] = useState([]);
  const [loading, setLoading] = useState(true);

  // 🔐 Fetch data using cookies
  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await axios.get(
          "http://localhost:5000/api/health/history",
          {
            withCredentials: true, // ✅ sends HTTP-only cookie
          }
        );

        setBmiRecords(res.data.records || []);
      } catch (error) {
        console.error("Unauthorized. Redirecting...");
        router.replace("/login");
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, [router]);

  // 🔓 Logout (server clears cookie)
  const handleLogout = async () => {
    try {
      await axios.post(
        "http://localhost:5000/api/auth/logout",
        {},
        { withCredentials: true }
      );
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      router.replace("/login");
    }
  };

  if (loading)
    return <p style={{ textAlign: "center" }}>Loading dashboard...</p>;

  const labels = bmiRecords.map((r) =>
    new Date(r.createdAt).toLocaleDateString()
  );

  const bmiData = bmiRecords.map((r) => r.bmi);
  const caloriesData = bmiRecords.map((r) => r.dailyCalories);

  return (
    <div
      style={{
        maxWidth: "1000px",
        margin: "40px auto",
        fontFamily: "Arial, sans-serif",
      }}
    >
      {/* HEADER */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <h1>Horizon Dashboard</h1>
        <button
          onClick={handleLogout}
          style={{
            padding: "8px 16px",
            background: "#ff4d4d",
            color: "#fff",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer",
          }}
        >
          Logout
        </button>
      </div>

      {/* BMI CHART */}
      <div style={{ marginTop: "40px" }}>
        <h2>BMI Over Time</h2>
        <Line
          data={{
            labels,
            datasets: [
              {
                label: "BMI",
                data: bmiData,
                borderColor: "rgba(75, 192, 192, 1)",
                backgroundColor: "rgba(75, 192, 192, 0.2)",
                tension: 0.3,
              },
            ],
          }}
        />
      </div>

      {/* CALORIES CHART */}
      <div style={{ marginTop: "40px" }}>
        <h2>Daily Calories Over Time</h2>
        <Line
          data={{
            labels,
            datasets: [
              {
                label: "Calories",
                data: caloriesData,
                borderColor: "rgba(255, 99, 132, 1)",
                backgroundColor: "rgba(255, 99, 132, 0.2)",
                tension: 0.3,
              },
            ],
          }}
        />
      </div>

      {/* ADVICE SECTION */}
      <div style={{ marginTop: "40px" }}>
        <h2>Dietary Advice History</h2>
        {bmiRecords.length === 0 ? (
          <p>No records found.</p>
        ) : (
          bmiRecords.map((r, i) => (
            <div
              key={i}
              style={{
                padding: "12px",
                border: "1px solid #ddd",
                marginBottom: "12px",
                borderRadius: "8px",
                background: "#f9f9f9",
              }}
            >
              <strong>
                {new Date(r.createdAt).toLocaleDateString()}:
              </strong>
              <p style={{ marginTop: "5px" }}>
                {r.advice || "No advice available"}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
