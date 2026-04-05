"use client";
import { useEffect, useState } from "react";

export function Clock() {
  const [time, setTime] = useState("");
  useEffect(() => {
    const tick = () => {
      setTime(new Date().toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true }));
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);
  return (
    <span style={{ fontSize: 13, color: "#555", fontVariantNumeric: "tabular-nums", letterSpacing: "0.01em" }}>
      {time}
    </span>
  );
}
