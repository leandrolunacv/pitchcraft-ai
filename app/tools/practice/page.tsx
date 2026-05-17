'use client'

import { useState, useRef, useCallback } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import ResultsPanel from '@/components/dashboard/ResultsPanel'
import type { PitchAnalysis, PitchConfig, QuickAction } from '@/lib/types'

const defaultConfig: PitchConfig = { duration: '3min', tone: 'professional', audience: 'investors' }

export default function PracticePage() {
  const [stage, setStage] = useState<'idle' | 'recording' | 'transcribing' | 'analyzing' | 'results'>('idle')
  const [seconds, setSeconds] = useState(0)
  const [transcript, setTranscript] = useState('')
  const [analysis, setAnalysis] = useState<PitchAnalysis | null>(null)
  const [error, setError] = useState('')
  const [isImproving, setIsImproving] = useState(false)

  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const chunksRef = useRef<Blob[]>([])
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const startRecording = useCallback(async () => {
    setError('')
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const mr = new MediaRecorder(stream, { mimeType: 'audio/webm' })
      chunksRef.current = []

      mr.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data)
      }

      mr.onstop = async () => {
        stream.getTracks().forEach((t) => t.stop())
        const blob = new Blob(chunksRef.current, { type: 'audio/webm' })
        await processAudio(blob)
      }

      mr.start(1000)
      mediaRecorderRef.current = mr
      setStage('recording')
      setSeconds(0)
      timerRef.current = setInterval(() => setSeconds((s) => s + 1), 1000)
    } catch {
      setError('No se pudo acceder al micrófono. Verifica los permisos del navegador.')
    }
  }, [])

  const stopRecording = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current)
    mediaRecorderRef.current?.stop()
    setStage('transcribing')
  }, [])

  async function processAudio(blob: Blob) {
    try {
      // Transcribe with Whisper
      const formData = new FormData()
      formData.append('file', blob, 'recording.webm')

      const extractRes = await fetch('/api/pitch/extract', {
        method: 'POST',
        body: formData,
      })
      const extractData = await extractRes.json()

      if (!extractData.text) throw new Error('transcription_failed')
      setTranscript(extractData.text)
      setStage('analyzing')

      // Analyze with Claude
      const encoder = new TextEncoder()
      const res = await fetch('/api/pitch/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pitch: extractData.text, config: defaultConfig }),
      })

      if (!res.ok) throw new Error('analysis_failed')

      const reader = res.body!.getReader()
      const decoder = new TextDecoder()
      let result: PitchAnalysis | null = null

      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        const lines = decoder.decode(value).split('\n')
        for (const line of lines) {
          if (!line.startsWith('data: ')) continue
          try {
            const data = JSON.parse(line.slice(6))
            if (data.done && data.result) result = data.result
          } catch {}
        }
      }

      if (result) {
        setAnalysis(result)
        setStage('results')
      }
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : ''
      setError(msg === 'transcription_failed'
        ? 'No se pudo transcribir el audio. Intenta de nuevo.'
        : 'Error al analizar. Intenta de nuevo.')
      setStage('idle')
    }
  }

  async function handleQuickAction(action: QuickAction) {
    if (!analysis) return
    setIsImproving(true)
    try {
      const res = await fetch('/api/pitch/improve', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pitch: analysis.optimizedVersion, action, config: defaultConfig }),
      })
      const reader = res.body!.getReader()
      const decoder = new TextDecoder()
      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        const lines = decoder.decode(value).split('\n')
        for (const line of lines) {
          if (!line.startsWith('data: ')) continue
          try {
            const data = JSON.parse(line.slice(6))
            if (data.done && data.result) {
              setAnalysis((prev) => prev ? { ...prev, optimizedVersion: data.result } : prev)
            }
          } catch {}
        }
      }
    } finally {
      setIsImproving(false)
    }
  }

  const formatTime = (s: number) => `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`

  return (
    <div className="min-h-screen bg-dark-900">
      <nav className="bg-dark-850/90 backdrop-blur-md border-b border-white/5 px-6 h-14 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5">
          <img src="/logo-efectomentor.png" alt="Efecto Mentor" className="h-7 w-auto object-contain" />
          <div className="w-px h-4 bg-white/20 flex-shrink-0" />
          <div className="w-7 h-7 rounded-lg bg-brand-600 flex items-center justify-center flex-shrink-0">
            <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <span className="font-bold text-white">PitchCraft AI</span>
        </Link>
        <div className="flex items-center gap-3">
          <Link href="/dashboard" className="text-white/50 hover:text-white text-sm transition-colors">Dashboard</Link>
          <Link href="/tools/slogan" className="text-white/50 hover:text-white text-sm transition-colors">Slogans</Link>
          <Link href="/tools/qa" className="text-white/50 hover:text-white text-sm transition-colors">Q&A</Link>
          {stage === 'results' && (
            <button onClick={() => { setStage('idle'); setAnalysis(null); setTranscript('') }} className="btn-secondary text-sm px-4 py-2">
              + Nueva práctica
            </button>
          )}
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-6 py-10">
        <AnimatePresence mode="wait">
          {/* IDLE */}
          {stage === 'idle' && (
            <motion.div key="idle" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <div className="mb-8">
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-2xl">🎙️</span>
                  <h1 className="text-3xl font-bold text-white">Modo Práctica</h1>
                </div>
                <p className="text-white/50">Graba tu pitch en voz alta. La IA lo transcribirá y analizará en segundos.</p>
              </div>

              {error && (
                <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-sm">
                  {error}
                </div>
              )}

              <div className="glass-card p-12 flex flex-col items-center justify-center text-center">
                <div className="w-24 h-24 rounded-full bg-brand-600/20 border-2 border-brand-500/30 flex items-center justify-center mb-6">
                  <svg className="w-10 h-10 text-brand-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                  </svg>
                </div>
                <h2 className="text-xl font-semibold text-white mb-2">Listo para grabar</h2>
                <p className="text-white/40 text-sm mb-8 max-w-sm">
                  Presiona el botón y practica tu pitch. Cuando termines, la IA analizará tu presentación.
                </p>
                <button
                  onClick={startRecording}
                  className="btn-primary px-10 py-4 text-lg flex items-center gap-3"
                >
                  <span className="w-3 h-3 bg-red-400 rounded-full" />
                  Iniciar grabación
                </button>
              </div>
            </motion.div>
          )}

          {/* RECORDING */}
          {stage === 'recording' && (
            <motion.div key="recording" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center min-h-[60vh]"
            >
              <div className="relative mb-8">
                <div className="w-32 h-32 rounded-full bg-red-500/10 border-2 border-red-500/50 flex items-center justify-center">
                  <div className="w-20 h-20 rounded-full bg-red-500/20 border-2 border-red-400/70 flex items-center justify-center animate-pulse">
                    <svg className="w-10 h-10 text-red-400" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3z"/>
                    </svg>
                  </div>
                </div>
                <div className="absolute -inset-2 rounded-full border border-red-500/20 animate-ping" />
              </div>

              <div className="text-5xl font-mono font-bold text-white mb-2">{formatTime(seconds)}</div>
              <p className="text-white/40 text-sm mb-10">Grabando... habla tu pitch</p>

              <button
                onClick={stopRecording}
                className="bg-red-500 hover:bg-red-600 text-white font-semibold px-10 py-4 rounded-xl transition-colors flex items-center gap-3"
              >
                <span className="w-4 h-4 bg-white rounded-sm" />
                Detener grabación
              </button>
            </motion.div>
          )}

          {/* TRANSCRIBING / ANALYZING */}
          {(stage === 'transcribing' || stage === 'analyzing') && (
            <motion.div key="processing" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center min-h-[60vh] gap-6"
            >
              <div className="relative w-20 h-20">
                <div className="absolute inset-0 border-2 border-brand-500/30 rounded-full" />
                <div className="absolute inset-0 border-2 border-brand-500 border-t-transparent rounded-full animate-spin" />
                <div className="absolute inset-3 border-2 border-purple-500/30 rounded-full" />
                <div className="absolute inset-3 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }} />
              </div>
              <div className="text-center">
                <h3 className="text-xl font-semibold text-white mb-2">
                  {stage === 'transcribing' ? 'Transcribiendo con Whisper...' : 'Analizando con Claude...'}
                </h3>
                <p className="text-white/40 text-sm">
                  {stage === 'transcribing' ? 'Convirtiendo tu audio a texto' : 'Evaluando claridad, impacto, persuasión...'}
                </p>
              </div>
              {transcript && (
                <div className="w-full max-w-2xl glass-card p-4 max-h-40 overflow-y-auto">
                  <p className="text-xs text-white/40 font-semibold uppercase tracking-wider mb-2">Transcripción</p>
                  <p className="text-sm text-white/60 leading-relaxed">{transcript}</p>
                </div>
              )}
            </motion.div>
          )}

          {/* RESULTS */}
          {stage === 'results' && analysis && (
            <motion.div key="results" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              {transcript && (
                <div className="glass-card p-4 mb-6">
                  <p className="text-xs text-white/40 font-semibold uppercase tracking-wider mb-2">🎙️ Transcripción de tu grabación</p>
                  <p className="text-sm text-white/60 leading-relaxed">{transcript}</p>
                </div>
              )}
              <ResultsPanel
                analysis={analysis}
                onQuickAction={handleQuickAction}
                isImproving={isImproving}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
