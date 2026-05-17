import { NextRequest, NextResponse } from 'next/server'
import mammoth from 'mammoth'
import { extractText, getDocumentProxy } from 'unpdf'
import { getOpenAIClient } from '@/lib/openai'

const MAX_DOC_SIZE = 10 * 1024 * 1024 // 10 MB for docs
const MAX_AUDIO_SIZE = 25 * 1024 * 1024 // 25 MB for audio/video (Whisper limit)

const AUDIO_VIDEO_EXTS = ['.mp3', '.mp4', '.m4a', '.wav', '.webm', '.mpga', '.mpeg', '.mov']

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData()
    const file = formData.get('file') as File | null

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded.' }, { status: 400 })
    }

    const name = file.name.toLowerCase()
    const isAudioVideo = AUDIO_VIDEO_EXTS.some((ext) => name.endsWith(ext))

    const maxSize = isAudioVideo ? MAX_AUDIO_SIZE : MAX_DOC_SIZE
    if (file.size > maxSize) {
      return NextResponse.json(
        {
          error: isAudioVideo
            ? 'Audio/video file too large. Max 25MB (Whisper API limit).'
            : 'File too large. Max 10MB.',
        },
        { status: 400 }
      )
    }

    let text = ''
    let kind: 'document' | 'transcript' = 'document'

    if (isAudioVideo) {
      const openai = getOpenAIClient()
      const transcription = await openai.audio.transcriptions.create({
        file,
        model: 'whisper-1',
      })
      text = transcription.text
      kind = 'transcript'
    } else {
      const buffer = Buffer.from(await file.arrayBuffer())

      if (name.endsWith('.txt') || name.endsWith('.md')) {
        text = buffer.toString('utf-8')
      } else if (name.endsWith('.docx')) {
        const result = await mammoth.extractRawText({ buffer })
        text = result.value
      } else if (name.endsWith('.pdf')) {
        const pdf = await getDocumentProxy(new Uint8Array(buffer))
        const { text: pdfText } = await extractText(pdf, { mergePages: true })
        text = Array.isArray(pdfText) ? pdfText.join('\n') : pdfText
      } else {
        return NextResponse.json(
          {
            error: 'Unsupported file type. Use .txt, .md, .docx, .pdf, .mp3, .mp4, .m4a, .wav, .webm',
          },
          { status: 400 }
        )
      }
    }

    text = text.trim()

    if (!text) {
      return NextResponse.json({ error: 'No text could be extracted.' }, { status: 400 })
    }

    return NextResponse.json({ text, filename: file.name, length: text.length, kind })
  } catch (error) {
    console.error('Extract API error:', error)
    return NextResponse.json(
      { error: 'Failed to extract text from file.' },
      { status: 500 }
    )
  }
}
