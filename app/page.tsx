import { ThoughtFeed } from "@/app/components/ThoughtFeed";
import { Clock } from "@/app/components/Clock";

export default function Home() {
  return (
    <div style={{ minHeight: "100svh", background: "#0a0a0a", display: "flex", flexDirection: "column" }}>
      {/* Nav */}
      <nav style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "18px 20px",
        borderBottom: "1px solid #1a1a1a",
        position: "sticky",
        top: 0,
        background: "rgba(10,10,10,0.92)",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        zIndex: 30,
      }}>
        <span style={{ fontSize: 15, fontWeight: 600, color: "#fff", letterSpacing: "-0.01em" }}>
          3AM
        </span>
        <Clock />
      </nav>

      {/* Feed */}
      <main style={{ flex: 1, maxWidth: 560, width: "100%", margin: "0 auto", padding: "0 16px 120px" }}>
        <ThoughtFeed />
      </main>
    </div>
  );
}
