import { NextRequest } from 'next/server'
import { redis } from '@/lib/redis'
import { createHash } from 'crypto'

function getIpHash(req: NextRequest) {
  const ip =
    req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ??
    req.headers.get('x-real-ip') ??
    'unknown'
  return createHash('sha256').update(ip + (process.env.IP_SALT ?? '3am')).digest('hex')
}

type ThoughtRecord = {
  id: string
  content: string
  sameCount: number
  createdAt: string
  ipHash: string
}

// POST /api/thoughts/[id]/same
export async function POST(
  req: NextRequest,
  ctx: RouteContext<'/api/thoughts/[id]/same'>
) {
  const { id } = await ctx.params
  const ipHash = getIpHash(req)

  // SADD returns 1 if new, 0 if already samed — only update count if new
  const added = await redis.sadd(`thought:${id}:sames`, ipHash)
  if (added === 1) {
    const thought = await redis.get<ThoughtRecord>(`thought:${id}`)
    if (thought) {
      await redis.set(`thought:${id}`, { ...thought, sameCount: thought.sameCount + 1 })
    }
  }

  return Response.json({ ok: true })
}
