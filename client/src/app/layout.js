"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import axios from "axios";
import "./globals.css";

export default function RootLayout({ children }) {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await axios.post(
        "http://localhost:5000/api/auth/logout",
        {},
        { withCredentials: true }
      );
    } catch (error) {
      console.error("Logout failed:", error);
    } finally {
      setOpen(false);
      router.push("/login");
    }
  };

  return (
    <html lang="en">
      <body>
        <nav className="navbar">
          <Link href="/" className="logo" onClick={() => setOpen(false)}>
            Horizon
          </Link>

          <div
            className={`hamburger ${open ? "active" : ""}`}
            onClick={() => setOpen(!open)}
          >
            <span></span>
            <span></span>
            <span></span>
          </div>

          <div className={`nav-links ${open ? "show" : ""}`}>
            <Link href="/dashboard" onClick={() => setOpen(false)}>
              Dashboard
            </Link>

            <Link href="/calculator" onClick={() => setOpen(false)}>
              Calculator
            </Link>

            <Link href="/article" onClick={() => setOpen(false)}>
              Article
            </Link>

            {/* ✅ Logout Button Added Below */}
            <button onClick={handleLogout} className="logout-btn">
              Logout
            </button>
          </div>
        </nav>

        <main>{children}</main>
      </body>
    </html>
  );
}

