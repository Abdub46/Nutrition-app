"use client";

import { useState } from "react";
import Link from "next/link";
import "./globals.css";

export default function RootLayout({ children }) {
  const [open, setOpen] = useState(false);

  return (
    <html lang="en">
      <body>
        <nav className="navbar">
          <div className="logo">Horizon</div>

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
          </div>
        </nav>

        <main>{children}</main>
      </body>
    </html>
  );
}

