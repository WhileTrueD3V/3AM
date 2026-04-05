"use client";

import { useState, useCallback } from "react";

type Thought = {
  id: string;
  content: string;
  sameCount: number;
  createdAt: string;
  hasSamed: boolean;
};

function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
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
    setTimeout(() => setPopping(false), 280);
    try {
      await fetch(`/api/thoughts/${thought.id}/same`, { method: "POST" });
    } catch {
      setSamed(false);
      setCount(c => c - 1);
    }
  }, [samed, thought.id]);

  return (
    <article
      className="fade-up"
      style={{
        animationDelay: `${index * 55}ms`,
        opacity: 0,
        padding: "28px 0",
        borderBottom: "1px solid rgba(255,255,255,0.06)",
      }}
    >
      <p style={{
        color: "rgba(255,255,255,0.80)",
        fontSize: 16,
        lineHeight: 1.75,
        fontWeight: 300,
        margin: 0,
      }}>
        {thought.content}
      </p>

      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 16 }}>
        <span style={{ fontSize: 10, letterSpacing: "0.14em", color: "rgba(255,255,255,0.22)", textTransform: "uppercase" }}>
          {timeAgo(thought.createdAt)}
        </span>

        <button
          onClick={handleSame}
          disabled={samed}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 7,
            background: "none",
            border: "none",
            padding: "4px 0",
            cursor: samed ? "default" : "pointer",
            color: samed ? "rgba(168,148,255,0.9)" : "rgba(255,255,255,0.28)",
            fontSize: 11,
            letterSpacing: "0.04em",
            transition: "color 0.2s",
          }}
          onMouseEnter={e => { if (!samed) (e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.55)" }}
          onMouseLeave={e => { if (!samed) (e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.28)" }}
        >
          <span
            className={popping ? "same-pop" : ""}
            style={{
              display: "inline-block",
              width: 6,
              height: 6,
              borderRadius: "50%",
              background: samed ? "#a894ff" : "rgba(255,255,255,0.22)",
              boxShadow: samed ? "0 0 10px rgba(168,148,255,0.55)" : "none",
              transition: "all 0.25s",
              flexShrink: 0,
            }}
          />
          {count > 0 ? `${count} felt this` : "same"}
        </button>
      </div>
    </article>
  );
}
