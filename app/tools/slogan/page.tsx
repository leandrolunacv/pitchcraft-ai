'use client'

import { useState } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'

interface SloganResult {
  names: { name: string; reasoning: string }[]
  slogans: { slogan: string; vibe: string }[]
}

const INDUSTRIES = ['Tech/SaaS', 'Fintech', 'Health', 'E-commerce', 'EdTech', 'AI/ML', 'B2B', 'Consumer', 'Real Estate', 'Food & Beverage']
const STYLES = ['Profesional', 'Creativo y atrevido', 'Minimalista', 'Inspiracional', 'Técnico', 'Divertido']

export default function SloganPage() {
  const [description, setDescription] = useState('')
  const [industry, setIndustry] = useState('Tech/SaaS')
  const [style, setStyle] = useState('Profesional')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<SloganResult | null>(null)
  const [copied, setCopied] = useState<string | null>(null)

  async function generate() {
    if (!description.trim()) return
    setLoading(true)
    setResult(null)

    try {
      const res = await fetch('/api/tools/slogan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ description, industry, style }),
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
            if (data.done && data.result) setResult(data.result)
          } catch {}
        }
      }
    } finally {
      setLoading(false)
    }
  }

  function copy(text: string) {
    navigator.clipboard.writeText(text)
    setCopied(text)
    setTimeout(() => setCopied(null), 2000)
  }

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
          <Link href="/tools/qa" className="text-white/50 hover:text-white text-sm transition-colors">Q&A Simulator</Link>
          <Link href="/tools/practice" className="text-white/50 hover:text-white text-sm transition-colors">Práctica</Link>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-6 py-10">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <span className="text-2xl">✨</span>
            <h1 className="text-3xl font-bold text-white">Generador de Nombres & Slogans</h1>
          </div>
          <p className="text-white/50">Describe tu producto y la IA generará nombres y slogans que impactan.</p>
        </div>

        <div className="glass-card p-6 mb-6">
          <div className="mb-4">
            <label className="block text-xs font-semibold text-white/40 uppercase tracking-widest mb-2">
              Describe tu producto o empresa
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Ej: Una plataforma que usa IA para ayudar a pequeños restaurantes a reducir el desperdicio de alimentos, optimizando pedidos y prediciendo demanda..."
              rows={4}
              className="input-dark w-full resize-none text-sm"
            />
          </div>

          <div className="grid grid-cols-2 gap-4 mb-5">
            <div>
              <label className="block text-xs font-semibold text-white/40 uppercase tracking-widest mb-2">Industria</label>
              <select
                value={industry}
                onChange={(e) => setIndustry(e.target.value)}
                className="input-dark w-full text-sm"
              >
                {INDUSTRIES.map((i) => <option key={i} value={i}>{i}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-white/40 uppercase tracking-widest mb-2">Estilo</label>
              <select
                value={style}
                onChange={(e) => setStyle(e.target.value)}
                className="input-dark w-full text-sm"
              >
                {STYLES.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
          </div>

          <button
            onClick={generate}
            disabled={loading || description.trim().length < 10}
            className="btn-primary px-8 py-3 flex items-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                Generando...
              </>
            ) : (
              <>✨ Generar</>
            )}
          </button>
        </div>

        <AnimatePresence>
          {result && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              {/* Names */}
              <div>
                <h2 className="text-sm font-semibold text-white/40 uppercase tracking-widest mb-3">
                  Nombres sugeridos
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {result.names.map((item, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.05 }}
                      className="glass-card p-4 flex items-start justify-between gap-3 group"
                    >
                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-white text-lg">{item.name}</p>
                        <p className="text-xs text-white/40 mt-1">{item.reasoning}</p>
                      </div>
                      <button
                        onClick={() => copy(item.name)}
                        className="text-white/20 hover:text-brand-400 transition-colors flex-shrink-0 mt-1"
                        title="Copiar"
                      >
                        {copied === item.name ? (
                          <svg className="w-4 h-4 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        ) : (
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                          </svg>
                        )}
                      </button>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Slogans */}
              <div>
                <h2 className="text-sm font-semibold text-white/40 uppercase tracking-widest mb-3">
                  Slogans sugeridos
                </h2>
                <div className="space-y-2">
                  {result.slogans.map((item, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.05 }}
                      className="glass-card p-4 flex items-center justify-between gap-3"
                    >
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        <span className="text-xs text-white/30 font-mono w-5 flex-shrink-0">{String(i + 1).padStart(2, '0')}</span>
                        <div>
                          <p className="font-semibold text-white">"{item.slogan}"</p>
                          <p className="text-xs text-white/30 mt-0.5">{item.vibe}</p>
                        </div>
                      </div>
                      <button
                        onClick={() => copy(item.slogan)}
                        className="text-white/20 hover:text-brand-400 transition-colors flex-shrink-0"
                      >
                        {copied === item.slogan ? (
                          <svg className="w-4 h-4 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        ) : (
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                          </svg>
                        )}
                      </button>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
