"use client";

import React, { useState, useEffect } from "react";

// Map Latin digits to Devanagari
const toDevanagari = (str: string): string => {
  const devanagariDigits = ["०", "१", "२", "३", "४", "५", "६", "७", "८", "९"];
  return str.replace(/\d/g, (digit) => devanagariDigits[parseInt(digit)]);
};

const DigitalWatch: React.FC = () => {
  const [time, setTime] = useState<Date | null>(null);

  useEffect(() => {
    setTime(new Date());

    const timerId = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => clearInterval(timerId);
  }, []);

  const formatTime = (date: Date | null): string => {
    if (!date) return "--:--:--";
    const standardTime = date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    });

    return toDevanagari(standardTime);
  };

  return (
    <div style={{ fontSize: "16px", fontWeight: "bold" }}>
      {formatTime(time)}
    </div>
  );
};

export default DigitalWatch;
