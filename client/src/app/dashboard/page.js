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

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await axios.get(
          "http://localhost:5000/api/health/history",
          { withCredentials: true }
        );

        setBmiRecords(res.data.records || []);
      } catch (error) {
        if (error.response?.status === 401) {
          router.replace("/login");
        } else {
          console.error("Error fetching history:", error);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, [router]);

  const handleLogout = async () => {
    try {
      await axios.post(
        "http://localhost:5000/api/auth/logout",
        {
          bmi: bmi.toFixed(2),
          category,
          idealWeight: idealWeight.toFixed(1),
          dailyCalories: Math.round(calories),
          advice,

        },
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

  const bmiData = bmiRecords.map((r) => r.bmi || 0);
  const caloriesData = bmiRecords.map((r) => r.dailyCalories || 0);

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
                datasets: [{
                  label: "BMI (kg/m²)",
                  data: bmiData,
                  tension: 0.3,
                }],
              }}
              options={{
                scales: {
                  y: {
                    title: {
                      display: true,
                      text: "BMI (kg/m²)",
                    },
                  },
                  x: {
                    title: {
                      display: true,
                      text: "Months",
                    },
                  },
                },
              }}
            />
            </div>



      {/* CALORIES CHART */}
      <div style={{ marginTop: "40px" }}>
        <h2>Daily Calories Over Time</h2>

              <Line
                data={{
                  labels,
                  datasets: [{
                    label: "Calories (kcals)",
                    data: caloriesData,
                    tension: 0.3,
                  }],
                }}
                options={{
                  scales: {
                    y: {
                      title: {
                        display: true,
                        text: "Calories (kcals)",
                      },
                    },
                    x: {
                      title: {
                        display: true,
                        text: "Months",
                      },
                    },
                  },
                }}
              />
            </div>

      {/* ADVICE SECTION */}
          <div style={{ marginTop: "40px" }}>
            <h2>Dietary Counselling & Advice</h2>

            <p>
              ✔ Maintain a balanced diet including carbohydrates,
              proteins, fats, vitamins, and minerals.
            </p>

            <p>
              ✔ Increase fruit and vegetable intake to at least
              5 servings per day.
            </p>

            <p>
              ✔ Limit processed foods and sugary beverages.
            </p>

            <p>
              ✔ Stay hydrated — aim for 2–3 liters of water daily.
            </p>

            <p>
              ✔ Combine proper nutrition with regular physical activity.
            </p>
          


        {bmiRecords.length === 0 ? (
          <p>No records found.</p>
        ) : (
          bmiRecords.map((record, index) => (
            <div
              key={index}
              style={{
                padding: "12px",
                border: "1px solid #ddd",
                marginBottom: "12px",
                borderRadius: "8px",
                background: "#f9f9f9",
              }}
            >
              <strong>
                {new Date(record.createdAt).toLocaleDateString()}
              </strong>
              <p style={{ marginTop: "6px" }}>
                {record.advice || "No advice available"}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
