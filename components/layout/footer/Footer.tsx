import React from "react";
import "./Footer.css";
function Footer() {
  // Get today's date
  const today = new Date();

  // Format the date as you prefer (e.g., "May 7, 2025")
  const formattedDate = today.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  return (
    <footer className="footer mt-16 text-center text-amber-700 py-6 border-t-2 border-amber-200">
      <p>© {new Date().getFullYear()} घनश्याम न्यौपाने.</p>
    </footer>
  );
}

export default Footer;
