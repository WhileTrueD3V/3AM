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

export function ThoughtCard({
  thought,
  index,
}: {
  thought: Thought;
  index: number;
}) {
  const [sameCount, setSameCount] = useState(thought.sameCount);
  const [hasSamed, setHasSamed] = useState(thought.hasSamed);
  const [pulsing, setPulsing] = useState(false);

  const handleSame = useCallback(async () => {
    if (hasSamed) return;
    setHasSamed(true);
    setSameCount((c) => c + 1);
    setPulsing(true);
    setTimeout(() => setPulsing(false), 300);

    try {
      await fetch(`/api/thoughts/${thought.id}/same`, { method: "POST" });
    } catch {
      // revert on failure
      setHasSamed(false);
      setSameCount((c) => c - 1);
    }
  }, [hasSamed, thought.id]);

  return (
    <div
      className="fade-up py-7 border-b border-[#1c1f2e] group"
      style={{ animationDelay: `${index * 60}ms`, opacity: 0 }}
    >
      <p className="text-[#e4dfd6] text-base leading-relaxed font-light">
        {thought.content}
      </p>

      <div className="flex items-center justify-between mt-4">
        <span className="text-[10px] tracking-widest text-[#2a2f45] uppercase">
          {timeAgo(thought.createdAt)}
        </span>

        <button
          onClick={handleSame}
          disabled={hasSamed}
          aria-label={hasSamed ? "you felt this" : "same"}
          className={`flex items-center gap-2 text-xs transition-all duration-200 cursor-pointer select-none ${
            hasSamed
              ? "text-[#7c6af7]"
              : "text-[#2a2f45] hover:text-[#4a5068]"
          }`}
        >
          <span
            className={`w-1.5 h-1.5 rounded-full transition-all duration-200 ${
              pulsing ? "same-pulse" : ""
            } ${
              hasSamed
                ? "bg-[#7c6af7] shadow-[0_0_8px_rgba(124,106,247,0.6)]"
                : "bg-[#2a2f45] group-hover:bg-[#4a5068]"
            }`}
          />
          {sameCount > 0 ? (
            <span>{sameCount} felt this</span>
          ) : (
            <span className={hasSamed ? "opacity-100" : "opacity-0 group-hover:opacity-100 transition-opacity"}>
              same
            </span>
          )}
        </button>
      </div>
    </div>
  );
}
