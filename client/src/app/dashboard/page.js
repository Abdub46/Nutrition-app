"use client";

import { useEffect, useState } from "react";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
  CartesianGrid
} from "recharts";

export default function Dashboard() {

  const [userData, setUserData] = useState(null);
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);

  /* ================= MONTH FILTER ================= */
  const [selectedMonth, setSelectedMonth] = useState(null);

  /* ================= FETCH USER DATA ================= */

  const fetchLatestData = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/health/history", {
        credentials: "include"
      });

      if (!res.ok) throw new Error("Failed to fetch data");

      const data = await res.json();

      /* Profile = latest record */
      const latest = data[data.length - 1];
      setUserData(latest);

      /* Chart = full history */
      setChartData(data);

    } catch (error) {
      console.error(error);
      setUserData(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLatestData();
  }, []);

  /* ================= MONTH LIST ================= */

  const months = [
    ...new Set(
      chartData.map((item) =>
        new Date(item.createdAt).toLocaleString("default", { month: "short" })
      )
    )
  ];

  /* ================= FILTER CHART DATA BY MONTH ================= */

  const filteredChartData = selectedMonth
    ? chartData.filter(
        (item) =>
          new Date(item.createdAt).toLocaleString("default", { month: "short" }) ===
          selectedMonth
      )
    : chartData;

  /* ================= UI ================= */

  return (
    <div
      style={{
        padding: "40px",
        maxWidth: "1000px",
        margin: "0 auto"
      }}
    >
      <h1 style={{ marginBottom: "30px" }}>Personal Health Dashboard</h1>

      {loading ? (
        <p>Loading dashboard...</p>
      ) : userData ? (
        <>
          {/* ================= CLIENT PROFILE ================= */}
          <div
            style={{
              background: "#3ebebe",
              padding: "25px",
              borderRadius: "10px",
              marginBottom: "40px"
            }}
          >
            <h3>Client Profile</h3>

            <p>
              <strong>Weight:</strong> {userData.weight} kg
            </p>

            <p>
              <strong>BMI:</strong> {userData.bmi}
            </p>
          </div>

          {/* ================= BMI + WEIGHT CHART ================= */}
          <div
            style={{
              background: "#faf1f1",
              padding: "25px",
              borderRadius: "10px",
              marginBottom: "20px"
            }}
          >
            <h3 style={{ marginBottom: "20px" }}>BMI & Weight Progress</h3>

            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={filteredChartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="weekLabel" />
                <YAxis />
                <Tooltip />
                <Legend />

                <Line
                  type="monotone"
                  dataKey="weight"
                  stroke="#2563eb"
                  strokeWidth={3}
                />
                <Line
                  type="monotone"
                  dataKey="bmi"
                  stroke="#16a34a"
                  strokeWidth={3}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* ================= MONTH NAVIGATION ================= */}
          <div
            style={{
              display: "flex",
              gap: "10px",
              marginBottom: "40px",
              flexWrap: "wrap"
            }}
          >
            {months.map((month) => (
              <button
                key={month}
                onClick={() => setSelectedMonth(month)}
                style={{
                  padding: "6px 14px",
                  borderRadius: "6px",
                  border: "none",
                  cursor: "pointer",
                  background:
                    selectedMonth === month ? "#2563eb" : "#e5e7eb",
                  color: selectedMonth === month ? "#fff" : "#000"
                }}
              >
                {month}
              </button>
            ))}

            <button
              onClick={() => setSelectedMonth(null)}
              style={{
                padding: "6px 14px",
                borderRadius: "6px",
                border: "none",
                cursor: "pointer",
                background: "#22c55e",
                color: "#fff"
              }}
            >
              All
            </button>
          </div>
        </>
      ) : (
        <p>No records available.</p>
      )}
    </div>
  );
}
