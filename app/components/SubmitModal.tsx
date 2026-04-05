"use client";
import { useState, useRef, useEffect, useCallback } from "react";

const MAX = 200;
type T = { id: string; content: string; sameCount: number; createdAt: string; hasSamed: boolean };
type Props = { onClose: () => void; onSubmitted: (t: T) => void };

export function SubmitModal({ onClose, onSubmitted }: Props) {
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const ref = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    setTimeout(() => ref.current?.focus(), 50);
    const h = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [onClose]);

  const submit = useCallback(async () => {
    const trimmed = text.trim();
    if (!trimmed || loading) return;
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/thoughts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: trimmed }),
      });
      if (res.status === 429) { setError("You've already left one tonight. Come back later."); setLoading(false); return; }
      if (!res.ok) throw new Error();
      onSubmitted(await res.json());
      onClose();
    } catch {
      setError("Something went wrong. Try again.");
      setLoading(false);
    }
  }, [text, loading, onSubmitted, onClose]);

  const remaining = MAX - text.length;
  const canSubmit = text.trim().length > 0 && !loading;

  return (
    <div
      onClick={e => e.target === e.currentTarget && onClose()}
      style={{
        position: "fixed", inset: 0, zIndex: 50,
        background: "rgba(0,0,0,0.75)",
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
        display: "flex",
        alignItems: "flex-end",
        justifyContent: "center",
        padding: "0 0 0 0",
      }}
    >
      <div
        className="modal-in"
        style={{
          width: "100%",
          maxWidth: 560,
          background: "#161616",
          borderTop: "1px solid #2a2a2a",
          borderRadius: "24px 24px 0 0",
          padding: "20px 20px 40px",
        }}
      >
        {/* Handle */}
        <div style={{ width: 36, height: 4, background: "#333", borderRadius: 2, margin: "0 auto 20px" }} />

        <p style={{ fontSize: 12, color: "#555", marginBottom: 12, fontWeight: 500, letterSpacing: "0.04em", textTransform: "uppercase" }}>
          What&apos;s on your mind?
        </p>

        <textarea
          ref={ref}
          value={text}
          onChange={e => setText(e.target.value.slice(0, MAX))}
          onKeyDown={e => { if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) submit(); }}
          placeholder="I keep thinking about..."
          rows={5}
          style={{
            width: "100%",
            background: "transparent",
            border: "none",
            outline: "none",
            resize: "none",
            color: "#f0f0f0",
            fontSize: 16,
            lineHeight: 1.65,
            fontFamily: "inherit",
            caretColor: "#fff",
          }}
        />

        {error && (
          <p style={{ fontSize: 12, color: "#f87171", marginTop: 8 }}>{error}</p>
        )}

        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 16, paddingTop: 16, borderTop: "1px solid #1e1e1e" }}>
          <span style={{ fontSize: 12, color: remaining < 30 ? "#f59e0b" : "#444" }}>
            {remaining}
          </span>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <button
              onClick={onClose}
              style={{ background: "none", border: "none", color: "#555", fontSize: 14, cursor: "pointer", fontFamily: "inherit", padding: "8px 4px" }}
            >
              Cancel
            </button>
            <button
              onClick={submit}
              disabled={!canSubmit}
              style={{
                background: canSubmit ? "#fff" : "#222",
                color: canSubmit ? "#000" : "#444",
                border: "none",
                borderRadius: 100,
                padding: "10px 22px",
                fontSize: 14,
                fontWeight: 600,
                fontFamily: "inherit",
                cursor: canSubmit ? "pointer" : "not-allowed",
                transition: "all 0.15s",
              }}
            >
              {loading ? "Posting..." : "Post"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
