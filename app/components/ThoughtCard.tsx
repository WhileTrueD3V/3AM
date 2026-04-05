"use client";
import { useState, useCallback } from "react";

type Thought = { id: string; content: string; sameCount: number; createdAt: string; hasSamed: boolean };

function timeAgo(d: string) {
  const s = Math.floor((Date.now() - new Date(d).getTime()) / 1000);
  if (s < 60) return "just now";
  if (s < 3600) return `${Math.floor(s / 60)}m ago`;
  if (s < 86400) return `${Math.floor(s / 3600)}h ago`;
  return `${Math.floor(s / 86400)}d ago`;
}

export function ThoughtCard({ thought, index }: { thought: Thought; index: number }) {
  const [count, setCount] = useState(thought.sameCount);
  const [samed, setSamed] = useState(thought.hasSamed);
  const [popping, setPopping] = useState(false);

  const handleSame = useCallback(async () => {
    if (samed) return;
    setSamed(true);
    setCount(c => c + 1);
    setPopping(true);
    setTimeout(() => setPopping(false), 250);
    try {
      await fetch(`/api/thoughts/${thought.id}/same`, { method: "POST" });
    } catch {
      setSamed(false);
      setCount(c => c - 1);
    }
  }, [samed, thought.id]);

  return (
    <div
      className="fade-up"
      style={{
        animationDelay: `${index * 50}ms`,
        opacity: 0,
        background: "#111",
        border: "1px solid #1e1e1e",
        borderRadius: 16,
        padding: "18px 20px",
        marginTop: 10,
      }}
    >
      <p style={{ fontSize: 15, lineHeight: 1.65, color: "#f0f0f0", fontWeight: 400 }}>
        {thought.content}
      </p>

      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 14 }}>
        <span style={{ fontSize: 12, color: "#666" }}>
          {timeAgo(thought.createdAt)}
        </span>

        <button
          onClick={handleSame}
          disabled={samed}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 6,
            background: samed ? "rgba(251,191,36,0.12)" : "rgba(255,255,255,0.07)",
            border: `1px solid ${samed ? "rgba(251,191,36,0.35)" : "rgba(255,255,255,0.14)"}`,
            borderRadius: 100,
            padding: "5px 12px 5px 10px",
            cursor: samed ? "default" : "pointer",
            transition: "all 0.2s",
            color: samed ? "#FBBF24" : "#999",
            fontSize: 12,
            fontFamily: "inherit",
          }}
        >
          <span
            className={popping ? "pop" : ""}
            style={{
              display: "inline-block",
              fontSize: 13,
              lineHeight: 1,
              filter: samed ? "none" : "grayscale(1) opacity(0.4)",
              transition: "filter 0.2s",
            }}
          >
            ✦
          </span>
          {count > 0 ? `${count} felt this` : "same"}
        </button>
      </div>
    </div>
  );
}
