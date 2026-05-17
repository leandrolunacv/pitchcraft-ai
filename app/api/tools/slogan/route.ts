import { NextRequest, NextResponse } from 'next/server'
import { createSupabaseServerClient } from '@/lib/supabase/server'
import { anthropic, MODEL } from '@/lib/anthropic'

export async function POST(req: NextRequest) {
  const supabase = await createSupabaseServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { description, industry, style } = await req.json()

  const encoder = new TextEncoder()

  const stream = new ReadableStream({
    async start(controller) {
      try {
        const response = await anthropic.messages.create({
          model: MODEL,
          max_tokens: 2000,
          thinking: { type: 'adaptive' } as any,
          stream: true,
          messages: [{
            role: 'user',
            content: `You are a world-class brand strategist and naming expert.

Generate creative company names and slogans for this business:

Description: ${description}
Industry: ${industry || 'Tech/Startup'}
Style: ${style || 'professional and memorable'}

Return ONLY valid JSON in this exact format, no other text:
{
  "names": [
    { "name": "...", "reasoning": "..." },
    { "name": "...", "reasoning": "..." },
    { "name": "...", "reasoning": "..." },
    { "name": "...", "reasoning": "..." },
    { "name": "...", "reasoning": "..." },
    { "name": "...", "reasoning": "..." },
    { "name": "...", "reasoning": "..." },
    { "name": "...", "reasoning": "..." }
  ],
  "slogans": [
    { "slogan": "...", "vibe": "..." },
    { "slogan": "...", "vibe": "..." },
    { "slogan": "...", "vibe": "..." },
    { "slogan": "...", "vibe": "..." },
    { "slogan": "...", "vibe": "..." },
    { "slogan": "...", "vibe": "..." },
    { "slogan": "...", "vibe": "..." },
    { "slogan": "...", "vibe": "..." }
  ]
}

Names should be: memorable, available-sounding, unique, brand-able.
Slogans should be: punchy, under 8 words, emotionally resonant.`
          }],
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
      } catch (e) {
        controller.enqueue(encoder.encode(`data: ${JSON.stringify({ error: 'generation_failed' })}\n\n`))
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
