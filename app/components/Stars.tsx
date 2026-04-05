"use client";

import { useMemo } from "react";

export function Stars() {
  const stars = useMemo(() => {
    return Array.from({ length: 60 }, (_, i) => ({
      id: i,
      top: `${Math.random() * 100}%`,
      left: `${Math.random() * 100}%`,
      size: Math.random() * 1.5 + 0.5,
      duration: `${Math.random() * 5 + 3}s`,
      delay: `${Math.random() * 5}s`,
      minOpacity: Math.random() * 0.05 + 0.03,
      maxOpacity: Math.random() * 0.2 + 0.08,
    }));
  }, []);

  return (
    <div className="stars" aria-hidden>
      {stars.map((s) => (
        <div
          key={s.id}
          className="star"
          style={{
            top: s.top,
            left: s.left,
            width: s.size,
            height: s.size,
            "--duration": s.duration,
            "--delay": s.delay,
            "--min-opacity": s.minOpacity,
            "--max-opacity": s.maxOpacity,
          } as React.CSSProperties}
        />
      ))}
    </div>
  );
}
