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
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip);

export default function Dashboard() {
  const router = useRouter();
  const [monthlyData, setMonthlyData] = useState([]);
  const [loading, setLoading] = useState(true);

  const allMonths = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

  useEffect(() => {
    const fetchMonthlyData = async () => {
      try {
        const res = await axios.get(
          "http://localhost:5000/api/health/monthly",
          { withCredentials: true }
        );
        setMonthlyData(res.data || []);
      } catch (error) {
        if (error.response?.status === 401) router.replace("/login");
        else console.error("Error fetching monthly data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchMonthlyData();
  }, [router]);

  if (loading)
    return <p style={{ textAlign: "center" }}>Loading dashboard...</p>;

  // Map BMI and calories for all months, default to 0
  const bmiValues = allMonths.map((month) => {
    const record = monthlyData.find(r => new Date(r.month).toLocaleString("default", { month: "short" }) === month);
    return record ? Number(record.avgBMI) : 0;
  });

  const calorieValues = allMonths.map((month) => {
    const record = monthlyData.find(r => new Date(r.month).toLocaleString("default", { month: "short" }) === month);
    return record ? Number(record.avgCalories) : 0;
  });

  // Highlight March
  const highlightMarch = allMonths.map(m => m === "Mar" ? "rgba(255,99,132,0.8)" : "rgba(0,122,255,0.7)");
  const highlightMarchCalories = allMonths.map(m => m === "Mar" ? "rgba(255,99,132,0.8)" : "rgba(0,200,255,0.7)");

  return (
    <div className="dashboard-page" style={{ width: "100%", padding: "1rem", boxSizing: "border-box" }}>
      <div className="dashboard-container" style={{ maxWidth: "1200px", margin: "0 auto" }}>
        {/* HEADER */}
        <div className="dashboard-header">
          <h1>Horizon Dashboard</h1>
        </div>

        {/* IMPORTANCE */}
        <div className="tracking-info card">
          <h2>Why Track Your Weight and Nutrition?</h2>
          <p>
            Monitoring your BMI, calories, and nutrition status is essential for maintaining a healthy lifestyle. 
            Regular tracking helps you set goals, detect trends early, and make informed decisions about diet and exercise.
          </p>
        </div>

        {/* BMI BAR CHART */}
        <div className="chart-card card">
          <h2>Average Monthly BMI</h2>
          <Bar
            data={{
              labels: allMonths,
              datasets: [
                {
                  label: "BMI (kg/m²)",
                  data: bmiValues,
                  backgroundColor: highlightMarch,
                  barPercentage: 0.5, // narrower bars
                  categoryPercentage: 0.5,
                },
              ],
            }}
            options={{
              indexAxis: 'x', // vertical bars
              responsive: true,
              plugins: { legend: { display: false } }, // remove top legend
              scales: {
                y: { title: { display: true, text: "BMI (kg/m²)" }, beginAtZero: true },
                x: { title: { display: true, text: "Month" } },
              },
            }}
          />
        </div>

        {/* CALORIES BAR CHART */}
        <div className="chart-card card">
          <h2>Average Monthly Daily Calories</h2>
          <Bar
            data={{
              labels: allMonths,
              datasets: [
                {
                  label: "Calories (kcals)",
                  data: calorieValues,
                  backgroundColor: highlightMarchCalories,
                  barPercentage: 0.5,
                  categoryPercentage: 0.5,
                },
              ],
            }}
            options={{
              indexAxis: 'x',
              responsive: true,
              plugins: { legend: { display: false } },
              scales: {
                y: { title: { display: true, text: "Calories (kcals)" }, beginAtZero: true },
                x: { title: { display: true, text: "Month" } },
              },
            }}
          />
        </div>

        {/* GENERAL DIETARY ADVICE */}
        <div className="advice-card card">
          <h2>General Dietary Counselling</h2>
          <ul>
            <li>Maintain a balanced diet.</li>
            <li>Eat at least 5 servings of fruits and vegetables daily.</li>
            <li>Reduce sugary drinks and processed foods.</li>
            <li>Drink 2–3 liters of water daily.</li>
            <li>Combine good nutrition with regular physical activity.</li>
          </ul>
          {monthlyData.length === 0 && <p>No records found.</p>}
        </div>
      </div>
    </div>
  );
}
