"use client";

import { useEffect, useState } from "react";

export function Clock() {
  const [time, setTime] = useState("");

  useEffect(() => {
    const update = () => {
      const now = new Date();
      setTime(
        now.toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
          hour12: true,
        })
      );
    };
    update();
    const id = setInterval(update, 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <span className="text-xs tabular-nums tracking-widest opacity-30 text-[#e4dfd6]">
      {time}
    </span>
  );
}
