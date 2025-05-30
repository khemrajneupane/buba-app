"use client";
import * as React from "react";
import "./Footer.css";
import { ArrowUp } from "lucide-react";
function Footer() {
  const handleScrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Get today's date
  const today = new Date();

  // Format the date as you prefer (e.g., "May 7, 2025")
  const formattedDate = today.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <footer className="custom-footer">
      <div>
        <p>© {new Date().getFullYear()} घनश्याम न्यौपाने.</p>
      </div>
      <button
        className="scroll-top-btn"
        onClick={handleScrollToTop}
        aria-label="Scroll to Top"
      >
        माथि जानुहोस्
        <ArrowUp className="arrow-icon" />
      </button>
    </footer>
  );
}

export default Footer;
