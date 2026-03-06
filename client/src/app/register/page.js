"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    age: "",
    gender: "",
    address: "",
    height: "",
    weight: "",
    lifestyle: ""
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch("http://localhost:5000/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        credentials: "include", // important for cookies
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Registration failed");
      }

      alert("Registration successful! Please login.");

      router.push("/login");

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <form onSubmit={handleRegister} style={styles.form}>
        <h2>Create Account</h2>

        {error && <p style={{ color: "red" }}>{error}</p>}

        <input name="name" placeholder="Full Name" onChange={handleChange} required />
        <input name="email" type="email" placeholder="Email" onChange={handleChange} required />
        <input name="password" type="password" placeholder="Password" onChange={handleChange} required />

        <input name="age" type="number" placeholder="Age" onChange={handleChange} />
        <input name="gender" placeholder="Gender" onChange={handleChange} />
        <input name="address" placeholder="Address" onChange={handleChange} />
        <input name="height" type="number" placeholder="Height (cm)" onChange={handleChange} />
        <input name="weight" type="number" placeholder="Weight (kg)" onChange={handleChange} />
        <input name="lifestyle" placeholder="Lifestyle (Active/Sedentary)" onChange={handleChange} />

        <button type="submit" disabled={loading}>
          {loading ? "Registering..." : "Register"}
        </button>

        <p>
          Already have an account?{" "}
          <span
            style={{ color: "blue", cursor: "pointer" }}
            onClick={() => router.push("/login")}
          >
            Login here
          </span>
        </p>
      </form>
    </div>
  );
}

const styles = {
  container: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100vh",
    background: "#f4f4f4"
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "10px",
    padding: "30px",
    background: "white",
    borderRadius: "8px",
    width: "350px"
  }
};
