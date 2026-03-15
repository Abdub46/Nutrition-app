"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function RegisterPage() {

  const router = useRouter();

  const [showPassword, setShowPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState("");

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

  /* ================= SANITIZE INPUT ================= */

  const sanitize = (value) => {
    return value.replace(/[<>]/g, "").trim();
  };

  /* ================= PASSWORD STRENGTH ================= */

  const checkPasswordStrength = (password) => {

    if (password.length < 6) {
      setPasswordStrength("Weak");
    }
    else if (
      password.match(/[A-Z]/) &&
      password.match(/[0-9]/)
    ) {
      setPasswordStrength("Strong");
    }
    else {
      setPasswordStrength("Medium");
    }
  };

  /* ================= HANDLE INPUT ================= */

  const handleChange = (e) => {

    const value = sanitize(e.target.value);

    setFormData({
      ...formData,
      [e.target.name]: value
    });

    if (e.target.name === "password") {
      checkPasswordStrength(value);
    }

  };

  /* ================= EMAIL VALIDATION ================= */

  const validateEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  /* ================= HANDLE REGISTER ================= */

  const handleRegister = async (e) => {

    e.preventDefault();

    if (loading) return;

    setLoading(true);
    setError("");

    try {

      if (!validateEmail(formData.email)) {
        throw new Error("Please enter a valid email address.");
      }

      if (formData.password.length < 6) {
        throw new Error("Password must be at least 6 characters.");
      }

      const response = await fetch(
        "http://localhost:5000/api/auth/register",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          credentials: "include",
          body: JSON.stringify(formData)
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Registration failed");
      }

      /* AUTO LOGIN */
      router.push("/dashboard");

    } catch (err) {

      setError(err.message);

    } finally {

      setLoading(false);

    }

  };

  return (

    <div className="min-h-screen flex items-center justify-center bg-white-100 px-4">

      <form
        onSubmit={handleRegister}
        className="bg-gold shadow-xl rounded-xl p-8 w-full max-w-lg space-y-4 animate-fadeIn"
      >

        <h2 className="text-2xl font-bold text-center">
          Create Account
        </h2>

        {error && (
          <div className="bg-red-100 text-red-700 p-3 rounded">
            {error}
          </div>
        )}

        {/* NAME */}

        <input
          name="name"
          placeholder="Full Name"
          onChange={handleChange}
          required
          className="w-full border p-3 rounded"
        />

        {/* EMAIL */}

        <input
          name="email"
          type="email"
          placeholder="Email Address"
          onChange={handleChange}
          required
          className="w-full border p-3 rounded"
        />

        {/* PASSWORD */}

        <div className="relative">

          <input
            name="password"
            type={showPassword ? "text" : "password"}
            placeholder="Password (min 6 characters)"
            onChange={handleChange}
            required
            className="w-full border p-3 rounded"
          />

          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-3 text-sm text-black-500"
          >
            {showPassword ? "Hide" : "Show"}
          </button>

        </div>

        {/* PASSWORD STRENGTH */}

        {formData.password && (
          <p className={`text-sm ${
            passwordStrength === "Weak"
              ? "text-red-500"
              : passwordStrength === "Medium"
              ? "text-yellow-500"
              : "text-green-500"
          }`}>
            Password strength: {passwordStrength}
          </p>
        )}

        {/* AGE + GENDER */}

        <div className="grid grid-cols-2 gap-4">

          <input
            name="age"
            type="number"
            placeholder="Age"
            onChange={handleChange}
            required
            className="border p-3 rounded"
          />

          <select
            name="gender"
            onChange={handleChange}
            required
            className="border p-3 rounded"
          >
            <option value="">Select Gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
          </select>

        </div>

        {/* ADDRESS */}

        <input
          name="address"
          placeholder="Address"
          onChange={handleChange}
          required
          className="w-full border p-3 rounded"
        />

        {/* HEIGHT + WEIGHT */}

        <div className="grid grid-cols-2 gap-4">

          <input
            name="height"
            type="number"
            placeholder="Height (cm)"
            onChange={handleChange}
            required
            className="border p-3 rounded"
          />

          <input
            name="weight"
            type="number"
            placeholder="Weight (kg)"
            onChange={handleChange}
            required
            className="border p-3 rounded"
          />

        </div>

        {/* LIFESTYLE */}

        <select
          name="lifestyle"
          onChange={handleChange}
          required
          className="w-full border p-3 rounded"
        >
          <option value="">Select Lifestyle</option>
          <option value="sedentary">Sedentary</option>
          <option value="light">Light Activity</option>
          <option value="moderate">Moderate Activity</option>
          <option value="active">Active</option>
        </select>

        {/* REGISTER BUTTON */}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-black text-white p-3 rounded hover:bg-gray-800 transition"
        >
          {loading ? "Registering..." : "Register"}
        </button>

        {/* LOGIN LINK */}

        <p className="text-center text-sm">
          Already have an account?{" "}
          <span
            className="text-blue-600 cursor-pointer"
            onClick={() => router.push("/login")}
          >
            Login here
          </span>
        </p>

      </form>

      {/* PAGE ANIMATION */}

      <style jsx>{`
        .animate-fadeIn {
          animation: fadeIn 0.6s ease-in-out;
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>

    </div>
  );
}

