"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import Link from "next/link";


export default function ProtectedLayout({ children }) {
  const router = useRouter();
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Call backend endpoint to verify cookie
        const res = await axios.get("http://localhost:5000/api/auth/me", {
          withCredentials: true, // important to send cookies
        });

        setUser(res.data.user);
      } catch (err) {
        console.error(err);
        router.replace("/login");
      } finally {
        setCheckingAuth(false);
      }
    };

    checkAuth();
  }, [router]);

  const handleLogout = async () => {
    try {
      await axios.post(
        "http://localhost:5000/api/auth/logout",
        {},
        { withCredentials: true }
      );
      router.push("/login");
    } catch (err) {
      console.error(err);
    }
  };

  if (checkingAuth) return <p style={{ textAlign: "center" }}>Checking authentication...</p>;

  return (
    <div>
      {/* NAVBAR */}
      <nav className="navbar">
        <div className="nav-left">
          <strong>Horizon Health</strong>
        </div>

        <div className="nav-right">
          <span className="welcome">Welcome, {user?.name || "User"}</span>

                  {user.role === "admin" && (
              <Link href="/admin" style={{ color: "#38bdf8" }}>
                Admin Panel
              </Link>
            )}

                  <Link href="/dashboard" style={{ color: "white" }}>
          Dashboard
        </Link>

          <button onClick={handleLogout} className="logout-btn">
            Logout
          </button>
        </div>
      </nav>

      <main>{children}</main>
    </div>
  );
}

