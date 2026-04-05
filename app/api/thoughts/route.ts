import { NextRequest } from 'next/server'
import { redis } from '@/lib/redis'
import { createHash, randomUUID } from 'crypto'

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

// GET /api/thoughts — 50 most recent
export async function GET(req: NextRequest) {
  const ipHash = getIpHash(req)

  // Get latest 50 thought IDs from sorted set (newest first)
  const ids = await redis.zrange<string[]>('thoughts', 0, 49, { rev: true })
  if (!ids.length) return Response.json([])

  // Batch fetch all thought data + samed status
  const pipeline = redis.pipeline()
  for (const id of ids) {
    pipeline.get<ThoughtRecord>(`thought:${id}`)
    pipeline.sismember(`thought:${id}:sames`, ipHash)
  }
  const results = await pipeline.exec()

  const thoughts = []
  for (let i = 0; i < ids.length; i++) {
    const thought = results[i * 2] as ThoughtRecord | null
    const hasSamed = results[i * 2 + 1] as number
    if (!thought) continue
    thoughts.push({
      id: thought.id,
      content: thought.content,
      sameCount: thought.sameCount,
      createdAt: thought.createdAt,
      hasSamed: hasSamed === 1,
    })
  }

  return Response.json(thoughts)
}

// POST /api/thoughts — submit a thought
export async function POST(req: NextRequest) {
  const ipHash = getIpHash(req)

  // Rate limit: 1 thought per hour per IP
  const rateLimitKey = `ratelimit:${ipHash}`
  const limited = await redis.get(rateLimitKey)
  if (limited) return Response.json({ error: 'rate limited' }, { status: 429 })

  const body = await req.json()
  const content = typeof body.content === 'string' ? body.content.trim() : ''
  if (!content || content.length > 200) {
    return Response.json({ error: 'invalid content' }, { status: 400 })
  }

  const id = randomUUID()
  const createdAt = new Date().toISOString()
  const thought: ThoughtRecord = { id, content, sameCount: 0, createdAt, ipHash }

  await redis.pipeline()
    .set(`thought:${id}`, thought)
    .zadd('thoughts', { score: Date.now(), member: id })
    .set(rateLimitKey, '1', { ex: 3600 })
    .exec()

  return Response.json({ id, content, sameCount: 0, createdAt, hasSamed: false })
}
