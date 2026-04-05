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

// POST /api/thoughts/[id]/same
export async function POST(
  req: NextRequest,
  ctx: RouteContext<"/api/thoughts/[id]/same">
) {
  const { id } = await ctx.params;
  const ipHash = getIpHash(req);

  try {
    await prisma.$transaction([
      prisma.same.create({ data: { thoughtId: id, ipHash } }),
      prisma.thought.update({
        where: { id },
        data: { sameCount: { increment: 1 } },
      }),
    ]);
  } catch {
    // unique constraint = already samed, silently ignore
  }

  return Response.json({ ok: true });
}
