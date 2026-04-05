"use client";

import { useState, useRef, useEffect, useCallback } from "react";

const MAX = 200;

type Props = {
  onClose: () => void;
  onSubmitted: (thought: { id: string; content: string; sameCount: number; createdAt: string; hasSamed: boolean }) => void;
};

export function SubmitModal({ onClose, onSubmitted }: Props) {
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    textareaRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
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

      const thought = await res.json();
      onSubmitted(thought);
      onClose();
    } catch {
      setError("something went wrong. try again.");
      setLoading(false);
    }
  }, [text, loading, onSubmitted, onClose]);

  const handleKey = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) submit();
    },
    [submit]
  );

  const remaining = MAX - text.length;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 backdrop-in"
      style={{ background: "rgba(7,8,15,0.85)", backdropFilter: "blur(6px)" }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="modal-up w-full max-w-lg bg-[#0e1018] border border-[#1c1f2e] rounded-2xl p-6 space-y-4">
        <div className="space-y-1">
          <p className="text-[#e4dfd6] text-sm opacity-60">
            what&apos;s on your mind?
          </p>
          <p className="text-[#2a2f45] text-xs">
            anonymous. no account. just leave it here.
          </p>
        </div>

        <textarea
          ref={textareaRef}
          value={text}
          onChange={(e) => setText(e.target.value.slice(0, MAX))}
          onKeyDown={handleKey}
          placeholder="i keep thinking about..."
          rows={4}
          className="w-full bg-transparent text-[#e4dfd6] text-base font-light leading-relaxed placeholder-[#2a2f45] resize-none outline-none"
        />

        {error && (
          <p className="text-[#7c6af7] text-xs opacity-80">{error}</p>
        )}

        <div className="flex items-center justify-between pt-1">
          <span
            className={`text-xs tabular-nums ${
              remaining < 20 ? "text-[#7c6af7]" : "text-[#2a2f45]"
            }`}
          >
            {remaining}
          </span>

          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="text-xs text-[#2a2f45] hover:text-[#4a5068] transition-colors cursor-pointer"
            >
              nevermind
            </button>
            <button
              onClick={submit}
              disabled={!text.trim() || loading}
              className="text-xs px-4 py-2 rounded-full bg-[#7c6af7] text-white disabled:opacity-30 hover:bg-[#6b5ae0] transition-all cursor-pointer disabled:cursor-not-allowed"
            >
              {loading ? "leaving it..." : "leave it here"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
