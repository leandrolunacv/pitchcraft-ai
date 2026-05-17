import { NextRequest, NextResponse } from 'next/server'
import { anthropic, MODEL } from '@/lib/anthropic'
import { buildAnalysisPrompt } from '@/lib/prompts'
import { createSupabaseServerClient, createSupabaseAdminClient } from '@/lib/supabase/server'
import { checkUsage, logUsage } from '@/lib/plans'
import type { PitchConfig } from '@/lib/types'

export async function POST(req: NextRequest) {
  try {
    const supabase = await createSupabaseServerClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 })
    }

    const admin = createSupabaseAdminClient()
    const usage = await checkUsage(admin, user.id)

    if (usage.remaining <= 0) {
      return NextResponse.json(
        { error: 'limit_reached', usage },
        { status: 403 }
      )
    }

    const { pitch, config }: { pitch: string; config: PitchConfig } = await req.json()

    if (!pitch || pitch.trim().length < 20) {
      return NextResponse.json({ error: 'Pitch text is too short.' }, { status: 400 })
    }

    
    const prompt = buildAnalysisPrompt(pitch, config)

    const stream = anthropic.messages.stream({
      model: MODEL,
      max_tokens: 4096,
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

        try {
          const parsed = JSON.parse(fullText)

          await logUsage(admin, user.id, 'analyze')
          const { data: saved } = await admin
            .from('pitches')
            .insert({
              user_id: user.id,
              mode: 'improve',
              original_pitch: pitch,
              optimized_pitch: parsed.optimizedVersion,
              analysis: parsed,
              config,
              source_kind: 'text',
            })
            .select('id')
            .single()

          controller.enqueue(
            encoder.encode(
              `data: ${JSON.stringify({ done: true, result: parsed, pitchId: saved?.id })}\n\n`
            )
          )
        } catch {
          controller.enqueue(
            encoder.encode(`data: ${JSON.stringify({ error: 'Failed to parse AI response' })}\n\n`)
          )
        }

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
    console.error('Analyze API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
