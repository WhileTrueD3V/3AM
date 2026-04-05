import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { createHash } from "crypto";

function getIpHash(req: NextRequest) {
  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    req.headers.get("x-real-ip") ??
    "unknown";
  return createHash("sha256").update(ip + (process.env.IP_SALT ?? "3am")).digest("hex");
}

// GET /api/thoughts — returns 50 most recent thoughts
export async function GET(req: NextRequest) {
  const ipHash = getIpHash(req);

  const thoughts = await prisma.thought.findMany({
    orderBy: { createdAt: "desc" },
    take: 50,
    include: {
      sames: { where: { ipHash }, select: { id: true } },
    },
  });

  return Response.json(
    thoughts.map((t) => ({
      id: t.id,
      content: t.content,
      sameCount: t.sameCount,
      createdAt: t.createdAt.toISOString(),
      hasSamed: t.sames.length > 0,
    }))
  );
}

// POST /api/thoughts — submit a new thought
export async function POST(req: NextRequest) {
  const ipHash = getIpHash(req);

  // Rate limit: one thought per hour per IP
  const recent = await prisma.thought.findFirst({
    where: {
      ipHash,
      createdAt: { gte: new Date(Date.now() - 60 * 60 * 1000) },
    },
  });

  if (recent) {
    return Response.json({ error: "rate limited" }, { status: 429 });
  }

  const body = await req.json();
  const content = typeof body.content === "string" ? body.content.trim() : "";

  if (!content || content.length > 200) {
    return Response.json({ error: "invalid content" }, { status: 400 });
  }

  const thought = await prisma.thought.create({
    data: { content, ipHash },
  });

  return Response.json({
    id: thought.id,
    content: thought.content,
    sameCount: 0,
    createdAt: thought.createdAt.toISOString(),
    hasSamed: false,
  });
}
