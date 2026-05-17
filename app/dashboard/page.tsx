'use client'

import { useState, useCallback, useEffect } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import ConfigPanel from '@/components/dashboard/ConfigPanel'
import ChatMode from '@/components/dashboard/ChatMode'
import ResultsPanel from '@/components/dashboard/ResultsPanel'
import FileUpload from '@/components/dashboard/FileUpload'
import type { PitchConfig, PitchAnalysis, CreatePitchAnswers, QuickAction } from '@/lib/types'

type Mode = 'improve' | 'create'
type Stage = 'input' | 'loading' | 'results'

const defaultConfig: PitchConfig = {
  duration: '3min',
  tone: 'professional',
  audience: 'investors',
}

class LimitReachedError extends Error {
  constructor() { super('limit_reached') }
}

async function streamAnalysis(
  endpoint: string,
  body: Record<string, unknown>,
  onChunk: (chunk: string) => void
): Promise<PitchAnalysis> {
  const res = await fetch(endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })

  if (res.status === 403) {
    const data = await res.json()
    if (data.error === 'limit_reached') throw new LimitReachedError()
  }
  if (!res.ok) throw new Error('API request failed')

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
        if (data.chunk) onChunk(data.chunk)
        if (data.done && data.result) result = data.result
        if (data.error) throw new Error(data.error)
      } catch {
        // skip non-JSON lines
      }
    }
  }

  if (!result) throw new Error('No result received')
  return result
}

interface UsageInfo {
  plan: 'free' | 'paid' | 'lifetime'
  limit: number
  used: number
  remaining: number
  email?: string
}

export default function DashboardPage() {
  const [mode, setMode] = useState<Mode>('improve')
  const [stage, setStage] = useState<Stage>('input')
  const [config, setConfig] = useState<PitchConfig>(defaultConfig)
  const [pitchText, setPitchText] = useState('')
  const [analysis, setAnalysis] = useState<PitchAnalysis | null>(null)
  const [streamingText, setStreamingText] = useState('')
  const [error, setError] = useState('')
  const [isImproving, setIsImproving] = useState(false)
  const [usage, setUsage] = useState<UsageInfo | null>(null)
  const [limitReached, setLimitReached] = useState(false)

  useEffect(() => {
    fetch('/api/usage')
      .then((r) => r.json())
      .then((d) => {
        if (d.error) return
        setUsage(d)
      })
  }, [stage])

  const handleAnalyze = useCallback(async () => {
    if (!pitchText.trim() || pitchText.trim().length < 20) {
      setError('Please enter a pitch of at least 20 characters.')
      return
    }
    setError('')
    setStage('loading')
    setStreamingText('')

    try {
      const result = await streamAnalysis(
        '/api/pitch/analyze',
        { pitch: pitchText, config },
        (chunk) => setStreamingText((prev) => prev + chunk)
      )
      setAnalysis(result)
      setStage('results')
    } catch (e) {
      if (e instanceof LimitReachedError) {
        setLimitReached(true)
        setStage('input')
      } else {
        setError('Something went wrong. Please try again.')
        setStage('input')
      }
    }
  }, [pitchText, config])

  const handleCreate = useCallback(async (answers: CreatePitchAnswers) => {
    setStage('loading')
    setStreamingText('')
    setError('')

    try {
      const result = await streamAnalysis(
        '/api/pitch/create',
        { answers, config },
        (chunk) => setStreamingText((prev) => prev + chunk)
      )
      setAnalysis(result)
      setStage('results')
    } catch (e) {
      if (e instanceof LimitReachedError) {
        setLimitReached(true)
        setStage('input')
      } else {
        setError('Something went wrong. Please try again.')
        setStage('input')
      }
    }
  }, [config])

  const handleQuickAction = useCallback(async (action: QuickAction) => {
    if (!analysis) return
    setIsImproving(true)

    try {
      const res = await fetch('/api/pitch/improve', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pitch: analysis.optimizedVersion, action, config }),
      })

      const reader = res.body!.getReader()
      const decoder = new TextDecoder()
      let improved = ''

      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        const lines = decoder.decode(value).split('\n')
        for (const line of lines) {
          if (!line.startsWith('data: ')) continue
          try {
            const data = JSON.parse(line.slice(6))
            if (data.chunk) improved += data.chunk
            if (data.done && data.result) {
              setAnalysis((prev) => prev ? { ...prev, optimizedVersion: data.result } : prev)
            }
          } catch {}
        }
      }
    } catch (e) {
      setError('Quick action failed. Please try again.')
    } finally {
      setIsImproving(false)
    }
  }, [analysis, config])

  const handleReset = () => {
    setStage('input')
    setAnalysis(null)
    setStreamingText('')
    setError('')
  }

  return (
    <div className="min-h-screen bg-dark-900 flex flex-col">
      {/* Top nav */}
      <nav className="bg-dark-850/90 backdrop-blur-md border-b border-white/5 px-6 h-14 flex items-center justify-between flex-shrink-0">
        <Link href="/" className="flex items-center gap-2.5">
          <img src="/logo-efectomentor.png" alt="Efecto Mentor" className="h-7 w-auto object-contain" />
          <div className="w-px h-4 bg-white/20 flex-shrink-0" />
          <div className="w-7 h-7 rounded-lg bg-brand-600 flex items-center justify-center flex-shrink-0">
            <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <span className="font-bold text-white text-base">PitchCraft AI</span>
        </Link>

        <div className="flex items-center gap-3">
          {usage && (
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 border border-white/20 text-xs">
              <span className={`font-bold ${
                usage.plan === 'free' ? 'text-white' : 'text-brand-300'
              }`}>
                {usage.plan === 'free' ? 'Free' : 'Pro'}
              </span>
              <span className="text-white/50">·</span>
              <span className="text-white/90 font-medium">
                {usage.used}/{usage.limit} pitches
              </span>
              {usage.plan === 'free' && (
                <Link href="/pricing" className="ml-1 text-brand-400 hover:text-brand-300 font-bold">
                  Upgrade →
                </Link>
              )}
            </div>
          )}
          <Link href="/tools/slogan" className="text-white/80 hover:text-white text-sm font-medium transition-colors hidden md:block">
            Slogans
          </Link>
          <Link href="/tools/qa" className="text-white/80 hover:text-white text-sm font-medium transition-colors hidden md:block">
            Q&A
          </Link>
          <Link href="/tools/practice" className="text-white/80 hover:text-white text-sm font-medium transition-colors hidden md:block">
            Práctica
          </Link>
          <Link href="/history" className="text-white/80 hover:text-white text-sm font-medium transition-colors">
            Historial
          </Link>
          {stage === 'results' && (
            <button onClick={handleReset} className="btn-secondary text-sm px-4 py-2">
              + Nuevo
            </button>
          )}
          <form action="/api/auth/signout" method="POST">
            <button type="submit" className="text-white/80 hover:text-white text-sm font-medium transition-colors">
              Salir
            </button>
          </form>
        </div>
      </nav>

      {limitReached && (
        <div className="bg-brand-600/10 border-b border-brand-500/30 px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-brand-600/30 flex items-center justify-center text-brand-300">
              ⚡
            </div>
            <div>
              <p className="text-sm font-medium text-white">Has alcanzado tu límite mensual</p>
              <p className="text-xs text-white/50">
                Usaste {usage?.used}/{usage?.limit} pitches. Upgrade a Pro para 20 pitches/mes.
              </p>
            </div>
          </div>
          <Link href="/pricing" className="btn-primary text-sm px-5 py-2">
            Ver planes →
          </Link>
        </div>
      )}

      <div className="flex flex-1 overflow-hidden">
        {/* Left sidebar — config */}
        <aside className="w-72 flex-shrink-0 border-r border-white/5 bg-dark-850/50 overflow-y-auto p-5">
          <div className="mb-6">
            <h2 className="text-xs font-semibold text-white/40 uppercase tracking-widest mb-4">
              Configuration
            </h2>
            <ConfigPanel config={config} onChange={setConfig} />
          </div>
        </aside>

        {/* Main content */}
        <main className="flex-1 overflow-hidden flex flex-col">
          <AnimatePresence mode="wait">
            {/* INPUT STAGE */}
            {stage === 'input' && (
              <motion.div
                key="input"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex-1 flex flex-col p-6 overflow-y-auto"
              >
                {/* Mode tabs */}
                <div className="flex items-center gap-2 mb-6 p-1 bg-white/5 rounded-xl w-fit">
                  {(['improve', 'create'] as Mode[]).map((m) => (
                    <button
                      key={m}
                      onClick={() => setMode(m)}
                      className={`px-5 py-2 rounded-lg text-sm font-medium transition-all duration-150 ${
                        mode === m
                          ? 'bg-white/15 text-white'
                          : 'text-white/40 hover:text-white/70'
                      }`}
                    >
                      {m === 'improve' ? '✨ Improve Pitch' : '🚀 Create from Scratch'}
                    </button>
                  ))}
                </div>

                {mode === 'improve' ? (
                  <div className="flex flex-col gap-4 flex-1">
                    <div>
                      <label className="block text-sm font-medium text-white/60 mb-2">
                        Sube un archivo o pega tu pitch
                      </label>
                      <FileUpload
                        onExtracted={(text) => {
                          setPitchText(text)
                          setError('')
                        }}
                      />
                      <textarea
                        value={pitchText}
                        onChange={(e) => setPitchText(e.target.value)}
                        placeholder="Enter your existing pitch script here... The AI will analyze it across 6 dimensions and create an optimized version tailored to your configuration."
                        rows={14}
                        className="input-dark w-full resize-none text-sm leading-relaxed"
                      />
                      {error && (
                        <p className="text-red-400 text-xs mt-2">{error}</p>
                      )}
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-xs text-white/30">
                        {pitchText.length} characters · ~{Math.round(pitchText.split(/\s+/).length / 130)} min read
                      </span>
                      <button
                        onClick={handleAnalyze}
                        disabled={pitchText.trim().length < 20}
                        className="btn-primary px-8 py-3 flex items-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed"
                      >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                        </svg>
                        Analyze & Optimize
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex-1">
                    <ChatMode
                      config={config}
                      onComplete={handleCreate}
                      isLoading={false}
                    />
                    {error && (
                      <p className="text-red-400 text-xs mt-2">{error}</p>
                    )}
                  </div>
                )}
              </motion.div>
            )}

            {/* LOADING STAGE */}
            {stage === 'loading' && (
              <motion.div
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex-1 flex flex-col items-center justify-center p-6 gap-8"
              >
                <div className="text-center">
                  <div className="relative w-20 h-20 mx-auto mb-6">
                    <div className="absolute inset-0 border-2 border-brand-500/30 rounded-full" />
                    <div className="absolute inset-0 border-2 border-brand-500 border-t-transparent rounded-full animate-spin" />
                    <div className="absolute inset-3 border-2 border-purple-500/30 rounded-full" />
                    <div className="absolute inset-3 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }} />
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-2">
                    Analyzing your pitch...
                  </h3>
                  <p className="text-white/40 text-sm max-w-md">
                    Claude is evaluating clarity, impact, persuasion, storytelling, confidence, and differentiation.
                  </p>
                </div>

                {streamingText && (
                  <div className="w-full max-w-2xl glass-card p-4 max-h-48 overflow-y-auto">
                    <pre className="text-xs text-white/30 font-mono leading-relaxed whitespace-pre-wrap cursor-blink">
                      {streamingText}
                    </pre>
                  </div>
                )}
              </motion.div>
            )}

            {/* RESULTS STAGE */}
            {stage === 'results' && analysis && (
              <motion.div
                key="results"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex-1 overflow-y-auto p-6"
              >
                <ResultsPanel
                  analysis={analysis}
                  onQuickAction={handleQuickAction}
                  isImproving={isImproving}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </main>
      </div>
    </div>
  )
}
