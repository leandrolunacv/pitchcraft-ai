'use client'

import { useState } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'

interface Question {
  id: number
  question: string
  category: string
}

interface Evaluation {
  score: number
  verdict: 'strong' | 'acceptable' | 'weak'
  feedback: string
  betterAnswer: string
}

const CATEGORY_COLORS: Record<string, string> = {
  market: 'bg-blue-500/20 text-blue-300',
  financials: 'bg-green-500/20 text-green-300',
  team: 'bg-purple-500/20 text-purple-300',
  product: 'bg-brand-500/20 text-brand-300',
  competition: 'bg-red-500/20 text-red-300',
  traction: 'bg-yellow-500/20 text-yellow-300',
  vision: 'bg-pink-500/20 text-pink-300',
}

async function streamJSON(
  endpoint: string,
  body: Record<string, unknown>
): Promise<unknown> {
  const res = await fetch(endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
  const reader = res.body!.getReader()
  const decoder = new TextDecoder()
  let result: unknown = null

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
  return result
}

export default function QAPage() {
  const [pitch, setPitch] = useState('')
  const [stage, setStage] = useState<'input' | 'quiz' | 'done'>('input')
  const [questions, setQuestions] = useState<Question[]>([])
  const [current, setCurrent] = useState(0)
  const [answer, setAnswer] = useState('')
  const [evaluations, setEvaluations] = useState<Record<number, Evaluation>>({})
  const [loading, setLoading] = useState(false)
  const [showEval, setShowEval] = useState(false)

  async function startSimulation() {
    if (pitch.trim().length < 50) return
    setLoading(true)
    try {
      const result = await streamJSON('/api/tools/qa', { pitch, action: 'generate' }) as { questions: Question[] }
      if (result?.questions) {
        setQuestions(result.questions)
        setCurrent(0)
        setEvaluations({})
        setAnswer('')
        setShowEval(false)
        setStage('quiz')
      }
    } finally {
      setLoading(false)
    }
  }

  async function submitAnswer() {
    if (!answer.trim()) return
    setLoading(true)
    setShowEval(false)
    try {
      const q = questions[current]
      const result = await streamJSON('/api/tools/qa', {
        action: 'evaluate',
        question: q.question,
        answer,
      }) as Evaluation
      if (result) {
        setEvaluations((prev) => ({ ...prev, [q.id]: result }))
        setShowEval(true)
      }
    } finally {
      setLoading(false)
    }
  }

  function next() {
    if (current < questions.length - 1) {
      setCurrent((c) => c + 1)
      setAnswer('')
      setShowEval(false)
    } else {
      setStage('done')
    }
  }

  const avgScore = Object.values(evaluations).length > 0
    ? Math.round(Object.values(evaluations).reduce((a, e) => a + e.score, 0) / Object.values(evaluations).length * 10)
    : 0

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
          <Link href="/tools/practice" className="text-white/50 hover:text-white text-sm transition-colors">Práctica</Link>
        </div>
      </nav>

      <div className="max-w-3xl mx-auto px-6 py-10">
        <AnimatePresence mode="wait">
          {/* INPUT */}
          {stage === 'input' && (
            <motion.div key="input" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <div className="mb-8">
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-2xl">🎯</span>
                  <h1 className="text-3xl font-bold text-white">Simulador de Q&A</h1>
                </div>
                <p className="text-white/50">Pega tu pitch y un inversor IA te hará 7 preguntas difíciles. Practica tus respuestas.</p>
              </div>

              <div className="glass-card p-6">
                <label className="block text-xs font-semibold text-white/40 uppercase tracking-widest mb-2">
                  Tu pitch
                </label>
                <textarea
                  value={pitch}
                  onChange={(e) => setPitch(e.target.value)}
                  placeholder="Pega aquí tu pitch completo..."
                  rows={10}
                  className="input-dark w-full resize-none text-sm mb-4"
                />
                <button
                  onClick={startSimulation}
                  disabled={loading || pitch.trim().length < 50}
                  className="btn-primary px-8 py-3 flex items-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <>
                      <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                      Preparando preguntas...
                    </>
                  ) : '🎯 Iniciar simulación'}
                </button>
              </div>
            </motion.div>
          )}

          {/* QUIZ */}
          {stage === 'quiz' && (
            <motion.div key="quiz" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              {/* Progress */}
              <div className="flex items-center gap-3 mb-6">
                {questions.map((_, i) => (
                  <div
                    key={i}
                    className={`h-1.5 flex-1 rounded-full transition-all ${
                      i < current ? 'bg-brand-500' :
                      i === current ? 'bg-brand-500/60' :
                      'bg-white/10'
                    }`}
                  />
                ))}
                <span className="text-xs text-white/40 flex-shrink-0">{current + 1}/{questions.length}</span>
              </div>

              {/* Question card */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={current}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="glass-card p-6 mb-4"
                >
                  <div className="flex items-start gap-3 mb-5">
                    <div className="w-10 h-10 rounded-full bg-brand-600/20 border border-brand-500/30 flex items-center justify-center text-brand-300 font-bold flex-shrink-0">
                      {current + 1}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                          CATEGORY_COLORS[questions[current]?.category] || 'bg-white/10 text-white/50'
                        }`}>
                          {questions[current]?.category}
                        </span>
                      </div>
                      <p className="text-white font-medium leading-relaxed">
                        {questions[current]?.question}
                      </p>
                    </div>
                  </div>

                  <textarea
                    value={answer}
                    onChange={(e) => setAnswer(e.target.value)}
                    placeholder="Tu respuesta..."
                    rows={5}
                    className="input-dark w-full resize-none text-sm mb-4"
                    disabled={showEval}
                  />

                  {!showEval ? (
                    <button
                      onClick={submitAnswer}
                      disabled={loading || !answer.trim()}
                      className="btn-primary px-6 py-2.5 flex items-center gap-2 disabled:opacity-40"
                    >
                      {loading ? (
                        <>
                          <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                          Evaluando...
                        </>
                      ) : 'Enviar respuesta →'}
                    </button>
                  ) : null}
                </motion.div>
              </AnimatePresence>

              {/* Evaluation */}
              <AnimatePresence>
                {showEval && evaluations[questions[current]?.id] && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="glass-card p-6 mb-4 border border-white/10"
                  >
                    {(() => {
                      const ev = evaluations[questions[current].id]
                      const scoreColor = ev.score >= 7 ? 'text-green-400' : ev.score >= 5 ? 'text-yellow-400' : 'text-red-400'
                      return (
                        <>
                          <div className="flex items-center gap-4 mb-4">
                            <div className={`text-4xl font-bold ${scoreColor}`}>{ev.score}<span className="text-lg text-white/30">/10</span></div>
                            <span className={`text-sm px-3 py-1 rounded-full font-medium ${
                              ev.verdict === 'strong' ? 'bg-green-500/20 text-green-300' :
                              ev.verdict === 'acceptable' ? 'bg-yellow-500/20 text-yellow-300' :
                              'bg-red-500/20 text-red-300'
                            }`}>
                              {ev.verdict === 'strong' ? '✓ Sólida' : ev.verdict === 'acceptable' ? '~ Aceptable' : '✗ Débil'}
                            </span>
                          </div>
                          <p className="text-white/70 text-sm mb-4">{ev.feedback}</p>
                          <div className="bg-white/5 rounded-xl p-4">
                            <p className="text-xs font-semibold text-white/40 uppercase tracking-wider mb-2">Respuesta más fuerte</p>
                            <p className="text-white/80 text-sm italic">"{ev.betterAnswer}"</p>
                          </div>
                        </>
                      )
                    })()}
                  </motion.div>
                )}
              </AnimatePresence>

              {showEval && (
                <button onClick={next} className="btn-primary px-8 py-3">
                  {current < questions.length - 1 ? 'Siguiente pregunta →' : 'Ver resultado final →'}
                </button>
              )}
            </motion.div>
          )}

          {/* DONE */}
          {stage === 'done' && (
            <motion.div key="done" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center">
              <div className="glass-card p-10 mb-6">
                <div className="text-6xl font-bold text-white mb-2">{avgScore}<span className="text-2xl text-white/30">/100</span></div>
                <p className="text-white/50 mb-8">Score promedio de tus respuestas</p>

                <div className="grid grid-cols-1 gap-3 text-left mb-8">
                  {questions.map((q, i) => {
                    const ev = evaluations[q.id]
                    if (!ev) return null
                    const scoreColor = ev.score >= 7 ? 'text-green-400' : ev.score >= 5 ? 'text-yellow-400' : 'text-red-400'
                    return (
                      <div key={i} className="flex items-start gap-3 p-3 bg-white/5 rounded-xl">
                        <span className={`font-bold text-lg ${scoreColor} flex-shrink-0 w-8`}>{ev.score}</span>
                        <p className="text-white/60 text-sm">{q.question}</p>
                      </div>
                    )
                  })}
                </div>

                <div className="flex items-center justify-center gap-3">
                  <button onClick={() => { setStage('input'); setPitch('') }} className="btn-secondary px-6 py-2.5">
                    Nuevo pitch
                  </button>
                  <button onClick={() => { setStage('quiz'); setCurrent(0); setEvaluations({}); setAnswer(''); setShowEval(false) }} className="btn-primary px-6 py-2.5">
                    Repetir
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
