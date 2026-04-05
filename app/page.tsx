import { ThoughtFeed } from "@/app/components/ThoughtFeed";
import { Clock } from "@/app/components/Clock";

export default function Home() {
  return (
    <main className="relative min-h-screen" style={{ background: "#07080f" }}>
      {/* Ambient glow — top center */}
      <div
        aria-hidden
        style={{
          position: "fixed",
          top: "-120px",
          left: "50%",
          transform: "translateX(-50%)",
          width: "600px",
          height: "400px",
          borderRadius: "50%",
          background: "radial-gradient(ellipse, rgba(100,80,200,0.10) 0%, transparent 70%)",
          pointerEvents: "none",
          zIndex: 0,
        }}
      />

      {/* Header */}
      <header className="relative z-10 flex items-center justify-between px-7 pt-7 pb-4 max-w-2xl mx-auto">
        <span style={{ fontSize: 11, letterSpacing: "0.18em", color: "rgba(255,255,255,0.22)", textTransform: "uppercase" }}>
          3am thought
        </span>
        <Clock />
      </header>

      {/* Feed */}
      <div className="relative z-10 max-w-2xl mx-auto px-7 pb-36">
        <ThoughtFeed />
      </div>
    </main>
  );
}
