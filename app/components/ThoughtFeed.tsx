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

export function ThoughtFeed() {
  const [thoughts, setThoughts] = useState<Thought[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetch("/api/thoughts")
      .then((r) => r.json())
      .then((data) => {
        setThoughts(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const handleSubmitted = useCallback((thought: Thought) => {
    setThoughts((prev) => [thought, ...prev]);
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col gap-7 mt-8">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="py-7 border-b border-[#1c1f2e] space-y-3">
            <div
              className="h-4 rounded-full bg-[#1c1f2e] animate-pulse"
              style={{ width: `${60 + Math.random() * 30}%` }}
            />
            <div className="h-4 rounded-full bg-[#1c1f2e] animate-pulse w-2/5" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <>
      {/* Empty state */}
      {thoughts.length === 0 && (
        <div className="text-center py-20 space-y-3">
          <p className="text-[#2a2f45] text-sm">no thoughts yet tonight.</p>
          <p className="text-[#2a2f45] text-xs">be the first to leave one.</p>
        </div>
      )}

      {/* Feed */}
      <div>
        {thoughts.map((thought, i) => (
          <ThoughtCard key={thought.id} thought={thought} index={i} />
        ))}
      </div>

      {/* Submit button — fixed at bottom */}
      <div className="fixed bottom-8 left-0 right-0 flex justify-center z-20">
        <button
          onClick={() => setShowModal(true)}
          className="group flex items-center gap-2.5 px-5 py-3 rounded-full border border-[#1c1f2e] bg-[#07080f]/80 backdrop-blur-md text-[#4a5068] hover:text-[#e4dfd6] hover:border-[#7c6af7]/40 transition-all duration-300 text-xs tracking-wide cursor-pointer"
        >
          <span className="w-1 h-1 rounded-full bg-[#7c6af7] opacity-60 group-hover:opacity-100 group-hover:shadow-[0_0_8px_rgba(124,106,247,0.8)] transition-all" />
          leave a thought
        </button>
      </div>

      {showModal && (
        <SubmitModal
          onClose={() => setShowModal(false)}
          onSubmitted={handleSubmitted}
        />
      )}
    </>
  );
}
