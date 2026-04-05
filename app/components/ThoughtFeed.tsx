"use client";

import { useState, useEffect, useCallback } from "react";
import { ThoughtCard } from "./ThoughtCard";
import { SubmitModal } from "./SubmitModal";

type Thought = {
  id: string;
  content: string;
  sameCount: number;
  createdAt: string;
  hasSamed: boolean;
};

function SkeletonCard() {
  return (
    <div style={{ padding: "28px 0", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
      <div className="skeleton" style={{ height: 14, width: "78%", marginBottom: 10 }} />
      <div className="skeleton" style={{ height: 14, width: "45%" }} />
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

  const handleSubmitted = useCallback((t: Thought) => {
    setThoughts(prev => [t, ...prev]);
  }, []);

  return (
    <>
      {loading ? (
        <div>
          {[...Array(6)].map((_, i) => <SkeletonCard key={i} />)}
        </div>
      ) : thoughts.length === 0 ? (
        <div style={{ textAlign: "center", padding: "80px 0" }}>
          <p style={{ color: "rgba(255,255,255,0.20)", fontSize: 14, margin: 0 }}>
            no thoughts yet tonight.
          </p>
          <p style={{ color: "rgba(255,255,255,0.12)", fontSize: 12, marginTop: 8 }}>
            be the first.
          </p>
        </div>
      ) : (
        <div>
          {thoughts.map((t, i) => (
            <ThoughtCard key={t.id} thought={t} index={i} />
          ))}
        </div>
      )}

      {/* Submit button */}
      <div style={{
        position: "fixed",
        bottom: 36,
        left: 0,
        right: 0,
        display: "flex",
        justifyContent: "center",
        zIndex: 20,
      }}>
        <button
          onClick={() => setShowModal(true)}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            padding: "12px 22px",
            borderRadius: 100,
            border: "1px solid rgba(255,255,255,0.10)",
            background: "rgba(10,11,20,0.85)",
            backdropFilter: "blur(12px)",
            WebkitBackdropFilter: "blur(12px)",
            color: "rgba(255,255,255,0.45)",
            fontSize: 12,
            letterSpacing: "0.05em",
            cursor: "pointer",
            transition: "all 0.25s",
          }}
          onMouseEnter={e => {
            const el = e.currentTarget as HTMLElement;
            el.style.color = "rgba(255,255,255,0.80)";
            el.style.borderColor = "rgba(168,148,255,0.35)";
          }}
          onMouseLeave={e => {
            const el = e.currentTarget as HTMLElement;
            el.style.color = "rgba(255,255,255,0.45)";
            el.style.borderColor = "rgba(255,255,255,0.10)";
          }}
        >
          <span style={{
            width: 5,
            height: 5,
            borderRadius: "50%",
            background: "rgba(168,148,255,0.6)",
            boxShadow: "0 0 8px rgba(168,148,255,0.4)",
            flexShrink: 0,
          }} />
          leave a thought
        </button>
      </div>

      {showModal && (
        <SubmitModal onClose={() => setShowModal(false)} onSubmitted={handleSubmitted} />
      )}
    </>
  );
}
