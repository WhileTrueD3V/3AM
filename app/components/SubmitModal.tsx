"use client";

import { useState, useRef, useEffect, useCallback } from "react";

const MAX = 200;

type Props = {
  onClose: () => void;
  onSubmitted: (t: { id: string; content: string; sameCount: number; createdAt: string; hasSamed: boolean }) => void;
};

export function SubmitModal({ onClose, onSubmitted }: Props) {
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const ref = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    ref.current?.focus();
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
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
      if (res.status === 429) {
        setError("you've already left one tonight. come back later.");
        setLoading(false);
        return;
      }
      if (!res.ok) throw new Error();
      onSubmitted(await res.json());
      onClose();
    } catch {
      setError("something went wrong.");
      setLoading(false);
    }
  }, [text, loading, onSubmitted, onClose]);

  return (
    <div
      onClick={e => e.target === e.currentTarget && onClose()}
      style={{
        position: "fixed", inset: 0, zIndex: 50,
        display: "flex", alignItems: "flex-end", justifyContent: "center",
        padding: 16,
        background: "rgba(4,5,10,0.80)",
        backdropFilter: "blur(8px)",
        WebkitBackdropFilter: "blur(8px)",
      }}
    >
      <div
        className="modal-in"
        style={{
          width: "100%",
          maxWidth: 520,
          background: "#0d0f1a",
          border: "1px solid rgba(255,255,255,0.08)",
          borderRadius: 20,
          padding: "24px 24px 20px",
        }}
      >
        <p style={{ color: "rgba(255,255,255,0.35)", fontSize: 12, margin: "0 0 16px", letterSpacing: "0.05em" }}>
          what&apos;s keeping you up?
        </p>

        <textarea
          ref={ref}
          value={text}
          onChange={e => setText(e.target.value.slice(0, MAX))}
          onKeyDown={e => { if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) submit(); }}
          placeholder="i keep thinking about..."
          rows={4}
          style={{
            width: "100%",
            background: "transparent",
            border: "none",
            outline: "none",
            resize: "none",
            color: "rgba(255,255,255,0.82)",
            fontSize: 15,
            fontWeight: 300,
            lineHeight: 1.7,
            fontFamily: "inherit",
          }}
        />

        {error && (
          <p style={{ color: "rgba(168,148,255,0.75)", fontSize: 11, margin: "8px 0 0" }}>{error}</p>
        )}

        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 16, paddingTop: 16, borderTop: "1px solid rgba(255,255,255,0.06)" }}>
          <span style={{ fontSize: 11, color: MAX - text.length < 20 ? "rgba(168,148,255,0.8)" : "rgba(255,255,255,0.18)" }}>
            {MAX - text.length}
          </span>
          <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
            <button
              onClick={onClose}
              style={{ background: "none", border: "none", color: "rgba(255,255,255,0.25)", fontSize: 12, cursor: "pointer", padding: "6px 0" }}
            >
              nevermind
            </button>
            <button
              onClick={submit}
              disabled={!text.trim() || loading}
              style={{
                padding: "8px 18px",
                borderRadius: 100,
                border: "none",
                background: text.trim() && !loading ? "rgba(168,148,255,0.85)" : "rgba(168,148,255,0.20)",
                color: text.trim() && !loading ? "#fff" : "rgba(255,255,255,0.30)",
                fontSize: 12,
                cursor: text.trim() && !loading ? "pointer" : "not-allowed",
                transition: "all 0.2s",
                fontFamily: "inherit",
              }}
            >
              {loading ? "leaving it..." : "leave it here"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
