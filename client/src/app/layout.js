"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import axios from "axios";
import "./globals.css";

export default function RootLayout({ children }) {

  const [open, setOpen] = useState(false);
  const [toolsOpen, setToolsOpen] = useState(false);
  const [adminOpen, setAdminOpen] = useState(false);

  const router = useRouter();

  /* REF FOR OUTSIDE CLICK */
  const navRef = useRef(null);

  /* CLOSE MENU WHEN CLICKING OUTSIDE */
  useEffect(() => {

    const handleClickOutside = (event) => {

      if (navRef.current && !navRef.current.contains(event.target)) {

        setOpen(false);
        setToolsOpen(false);
        setAdminOpen(false);

      }

    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };

  }, []);

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

        <nav className="navbar" ref={navRef}>

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

            {/* ADMIN */}

            <div className="nav-item">

              <span
                className="nav-link"
                onClick={() => setAdminOpen(!adminOpen)}
              >
                Admin ▾
              </span>

              {adminOpen && (

                <div className="dropdown-menu">

                 <Link href="/dashboard">Dashboard</Link>

                  <Link href="/calculator">Calculator</Link>

                </div>

              )}

            </div>


            {/* CHATBOT */}

            <Link className="nav-link" href="/chatbot" onClick={() => setOpen(false)}>
              Chatbot
            </Link>


            {/* TOOLS */}

            <div className="nav-item">

              <span
                className="nav-link"
                onClick={() => setToolsOpen(!toolsOpen)}
              >
                Tools ▾
              </span>

              {toolsOpen && (

                <div className="dropdown-menu">

                  <Link
                    href="/tools/bmi"
                    onClick={() => {
                      setOpen(false);
                      setToolsOpen(false);
                    }}
                  >
                    BMI Calculator
                  </Link>

                  <Link
                    href="/tools/energy"
                    onClick={() => {
                      setOpen(false);
                      setToolsOpen(false);
                    }}
                  >
                    Energy Requirement Calculator
                  </Link>

                </div>

              )}

            </div>


            <Link className="nav-link" href="/article" onClick={() => setOpen(false)}>
              Article
            </Link>

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


