"use client";
import { useState, useEffect, useCallback } from "react";
import { ThoughtCard } from "./ThoughtCard";
import { SubmitModal } from "./SubmitModal";

type Thought = { id: string; content: string; sameCount: number; createdAt: string; hasSamed: boolean };

function Skeleton() {
  return (
    <div style={{ background: "#111", border: "1px solid #1e1e1e", borderRadius: 16, padding: "18px 20px", marginTop: 10 }}>
      <div className="skeleton" style={{ height: 15, width: "80%", marginBottom: 10 }} />
      <div className="skeleton" style={{ height: 15, width: "55%" }} />
      <div style={{ marginTop: 18, display: "flex", justifyContent: "space-between" }}>
        <div className="skeleton" style={{ height: 12, width: 60 }} />
        <div className="skeleton" style={{ height: 28, width: 90, borderRadius: 100 }} />
      </div>
    </div>
  );
}

export function ThoughtFeed() {
  const [thoughts, setThoughts] = useState<Thought[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetch("/api/thoughts")
      .then(r => r.json())
      .then(data => { setThoughts(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const onSubmitted = useCallback((t: Thought) => setThoughts(p => [t, ...p]), []);

  return (
    <>
      <div style={{ paddingTop: 12 }}>
        {loading
          ? [...Array(5)].map((_, i) => <Skeleton key={i} />)
          : thoughts.length === 0
          ? (
            <div style={{ textAlign: "center", padding: "80px 0" }}>
              <p style={{ fontSize: 16, color: "#888", fontWeight: 500 }}>Nothing here yet.</p>
              <p style={{ fontSize: 13, color: "#555", marginTop: 6 }}>Leave the first thought of the night.</p>
            </div>
          )
          : thoughts.map((t, i) => <ThoughtCard key={t.id} thought={t} index={i} />)
        }
      </div>

      {/* CTA */}
      <div style={{
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        padding: "16px 20px 32px",
        background: "linear-gradient(to top, #0a0a0a 60%, transparent)",
        display: "flex",
        justifyContent: "center",
        zIndex: 20,
      }}>
        <button
          onClick={() => setShowModal(true)}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            background: "#fff",
            color: "#000",
            border: "none",
            borderRadius: 100,
            padding: "14px 28px",
            fontSize: 14,
            fontWeight: 600,
            fontFamily: "inherit",
            cursor: "pointer",
            letterSpacing: "-0.01em",
            boxShadow: "0 4px 24px rgba(0,0,0,0.5)",
            transition: "transform 0.15s, opacity 0.15s",
          }}
          onMouseEnter={e => (e.currentTarget.style.opacity = "0.92")}
          onMouseLeave={e => (e.currentTarget.style.opacity = "1")}
          onMouseDown={e => (e.currentTarget.style.transform = "scale(0.97)")}
          onMouseUp={e => (e.currentTarget.style.transform = "scale(1)")}
        >
          + Leave a thought
        </button>
      </div>

      {showModal && <SubmitModal onClose={() => setShowModal(false)} onSubmitted={onSubmitted} />}
    </>
  );
}
