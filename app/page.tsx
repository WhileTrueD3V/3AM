import { Stars } from "@/app/components/Stars";
import { ThoughtFeed } from "@/app/components/ThoughtFeed";
import { Clock } from "@/app/components/Clock";

export default function Home() {
  return (
    <main className="relative min-h-screen">
      <Stars />

      {/* Header */}
      <div className="relative z-10 flex items-center justify-between px-6 py-6 md:px-10">
        <h1 className="text-[#e4dfd6] text-xs font-medium tracking-widest uppercase opacity-40">
          3am thought
        </h1>
        <Clock />
      </div>

      {/* Feed */}
      <div className="relative z-10 max-w-xl mx-auto px-4 pb-32 pt-4">
        <ThoughtFeed />
      </div>
    </main>
  );
}
