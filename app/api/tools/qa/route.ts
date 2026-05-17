import { NextRequest, NextResponse } from 'next/server'
import { createSupabaseServerClient } from '@/lib/supabase/server'
import { anthropic, MODEL } from '@/lib/anthropic'

export async function POST(req: NextRequest) {
  const supabase = await createSupabaseServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { pitch, action, question, answer } = await req.json()

  const encoder = new TextEncoder()

  const stream = new ReadableStream({
    async start(controller) {
      try {
        let prompt = ''

        if (action === 'generate') {
          prompt = `You are a seasoned venture capital investor known for asking tough, insightful questions.

Based on this pitch, generate 7 challenging investor questions that expose weaknesses and test the founder's knowledge:

PITCH:
${pitch}

Return ONLY valid JSON:
{
  "questions": [
    { "id": 1, "question": "...", "category": "market|financials|team|product|competition|traction|vision" },
    { "id": 2, "question": "...", "category": "..." },
    { "id": 3, "question": "...", "category": "..." },
    { "id": 4, "question": "...", "category": "..." },
    { "id": 5, "question": "...", "category": "..." },
    { "id": 6, "question": "...", "category": "..." },
    { "id": 7, "question": "...", "category": "..." }
  ]
}

Questions should be specific, probing, and realistic for a Series A investor meeting.`

        } else if (action === 'evaluate') {
          prompt = `You are a seasoned VC investor evaluating a founder's answer.

Question: ${question}
Founder's answer: ${answer}

Evaluate this answer and return ONLY valid JSON:
{
  "score": <1-10>,
  "verdict": "strong|acceptable|weak",
  "feedback": "<2-3 sentences of specific feedback>",
  "betterAnswer": "<a stronger version of the answer in 2-3 sentences>"
}`
        }

        const response = await anthropic.messages.create({
          model: MODEL,
          max_tokens: 1500,
          thinking: { type: 'adaptive' } as any,
          stream: true,
          messages: [{ role: 'user', content: prompt }],
        })

        let fullText = ''
        for await (const event of response) {
          if (event.type === 'content_block_delta' && event.delta.type === 'text_delta') {
            fullText += event.delta.text
            controller.enqueue(encoder.encode(`data: ${JSON.stringify({ chunk: event.delta.text })}\n\n`))
          }
        }

        try {
          const jsonMatch = fullText.match(/\{[\s\S]*\}/)
          if (jsonMatch) {
            const result = JSON.parse(jsonMatch[0])
            controller.enqueue(encoder.encode(`data: ${JSON.stringify({ done: true, result })}\n\n`))
          }
        } catch {
          controller.enqueue(encoder.encode(`data: ${JSON.stringify({ error: 'parse_failed' })}\n\n`))
        }
      } catch {
        controller.enqueue(encoder.encode(`data: ${JSON.stringify({ error: 'failed' })}\n\n`))
      } finally {
        controller.close()
      }
    }
  })

  return new NextResponse(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
    }
  })
}
