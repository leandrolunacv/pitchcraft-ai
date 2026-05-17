import { NextRequest, NextResponse } from 'next/server'
import { anthropic, MODEL } from '@/lib/anthropic'
import { buildImprovePrompt } from '@/lib/prompts'
import type { PitchConfig, QuickAction } from '@/lib/types'

export async function POST(req: NextRequest) {
  try {
    const {
      pitch,
      action,
      config,
    }: { pitch: string; action: QuickAction; config: PitchConfig } = await req.json()

    if (!pitch || !action) {
      return NextResponse.json({ error: 'Missing pitch or action.' }, { status: 400 })
    }

    
    const prompt = buildImprovePrompt(pitch, action, config)

    const stream = anthropic.messages.stream({
      model: MODEL,
      max_tokens: 3000,
      thinking: { type: 'adaptive' } as any,
      messages: [{ role: 'user', content: prompt }],
    })

    const encoder = new TextEncoder()

    const readableStream = new ReadableStream({
      async start(controller) {
        let fullText = ''

        for await (const event of stream) {
          if (
            event.type === 'content_block_delta' &&
            event.delta.type === 'text_delta'
          ) {
            fullText += event.delta.text
            controller.enqueue(
              encoder.encode(`data: ${JSON.stringify({ chunk: event.delta.text })}\n\n`)
            )
          }
        }

        controller.enqueue(
          encoder.encode(`data: ${JSON.stringify({ done: true, result: fullText })}\n\n`)
        )
        controller.close()
      },
    })

    return new Response(readableStream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        Connection: 'keep-alive',
      },
    })
  } catch (error) {
    console.error('Improve API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
