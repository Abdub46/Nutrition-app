"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export default function Dashboard() {
  const router = useRouter();
  const [monthlyData, setMonthlyData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMonthlyData = async () => {
      try {
        const res = await axios.get(
          "http://localhost:5000/api/health/monthly",
          { withCredentials: true }
        );

        setMonthlyData(res.data || []);
      } catch (error) {
        if (error.response?.status === 401) {
          router.replace("/login");
        } else {
          console.error("Error fetching monthly data:", error);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchMonthlyData();
  }, [router]);

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

  /* =============================
     PREPARE CHART DATA
  ============================== */

  const labels = monthlyData.map((r) =>
    new Date(r.month).toLocaleString("default", {
      month: "short",
      year: "numeric",
    })
  );

  const bmiValues = monthlyData.map((r) => Number(r.avgBMI));
  const calorieValues = monthlyData.map((r) => Number(r.avgCalories));

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

      {/* ================= BMI BAR CHART ================= */}
      <div style={{ marginTop: "40px" }}>
        <h2>Average Monthly BMI</h2>

        <Bar
          data={{
            labels,
            datasets: [
              {
                label: "BMI (kg/m²)",
                data: bmiValues,
              },
            ],
          }}
          options={{
            responsive: true,
            plugins: {
              legend: { position: "top" },
              title: { display: false },
            },
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
                  text: "Month",
                },
              },
            },
          }}
        />
      </div>

      {/* ================= CALORIES BAR CHART ================= */}
      <div style={{ marginTop: "40px" }}>
        <h2>Average Monthly Daily Calories</h2>

        <Bar
          data={{
            labels,
            datasets: [
              {
                label: "Calories (kcals)",
                data: calorieValues,
              },
            ],
          }}
          options={{
            responsive: true,
            plugins: {
              legend: { position: "top" },
            },
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
                  text: "Month",
                },
              },
            },
          }}
        />
      </div>

      {/* ================= GENERAL ADVICE ================= */}
      <div style={{ marginTop: "40px" }}>
        <h2>General Dietary Counselling</h2>

        <p>✔ Maintain a balanced diet.</p>
        <p>✔ Eat at least 5 servings of fruits and vegetables daily.</p>
        <p>✔ Reduce sugary drinks and processed foods.</p>
        <p>✔ Drink 2–3 liters of water daily.</p>
        <p>✔ Combine good nutrition with regular physical activity.</p>

        {monthlyData.length === 0 && <p>No records found.</p>}
      </div>
    </div>
  );
}
