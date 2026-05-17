'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'

interface PitchRecord {
  id: string
  mode: 'improve' | 'create'
  title: string | null
  original_pitch: string | null
  optimized_pitch: string | null
  analysis: any
  config: any
  created_at: string
}

export default function HistoryPage() {
  const [pitches, setPitches] = useState<PitchRecord[]>([])
  const [loading, setLoading] = useState(true)
  const [selected, setSelected] = useState<PitchRecord | null>(null)

  useEffect(() => {
    fetch('/api/pitches')
      .then((r) => r.json())
      .then((d) => setPitches(d.pitches || []))
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="min-h-screen bg-dark-900">
      <nav className="bg-dark-850/90 backdrop-blur-md border-b border-white/5 px-6 h-14 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5">
          <img src="/logo-efectomentor.png" alt="Efecto Mentor" className="h-7 w-auto object-contain" />
          <div className="w-px h-4 bg-white/20 flex-shrink-0" />
          <div className="w-7 h-7 rounded-lg bg-brand-600 flex items-center justify-center text-white text-sm flex-shrink-0">⚡</div>
          <span className="font-bold text-white">PitchCraft AI</span>
        </Link>
        <div className="flex items-center gap-3">
          <Link href="/dashboard" className="btn-secondary text-sm px-4 py-2">Dashboard</Link>
        </div>
      </nav>

      <div className="max-w-5xl mx-auto px-6 py-10">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white mb-1">Mi Historial</h1>
            <p className="text-white/50 text-sm">Todos tus pitches guardados</p>
          </div>
          <Link href="/dashboard" className="btn-primary text-sm px-5 py-2.5">+ Nuevo pitch</Link>
        </div>

        {loading ? (
          <div className="text-center py-20">
            <div className="w-8 h-8 border-2 border-brand-500 border-t-transparent rounded-full animate-spin mx-auto" />
          </div>
        ) : pitches.length === 0 ? (
          <div className="glass-card p-12 text-center">
            <div className="w-16 h-16 rounded-2xl bg-brand-600/20 flex items-center justify-center text-3xl mx-auto mb-4">📝</div>
            <h3 className="text-lg font-semibold text-white mb-2">No tienes pitches todavía</h3>
            <p className="text-white/50 text-sm mb-6">Crea tu primer pitch desde el dashboard.</p>
            <Link href="/dashboard" className="btn-primary inline-block px-6 py-2.5">Crear mi primer pitch</Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {pitches.map((p, i) => (
              <motion.div
                key={p.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                onClick={() => setSelected(p)}
                className="glass-card p-5 cursor-pointer hover:bg-white/8 transition-all"
              >
                <div className="flex items-center justify-between mb-3">
                  <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                    p.mode === 'improve'
                      ? 'bg-brand-600/20 text-brand-300'
                      : 'bg-purple-600/20 text-purple-300'
                  }`}>
                    {p.mode === 'improve' ? '✨ Mejorado' : '🚀 Creado'}
                  </span>
                  <span className="text-xs text-white/30">
                    {new Date(p.created_at).toLocaleDateString('es', { day: 'numeric', month: 'short' })}
                  </span>
                </div>
                {p.analysis?.overallScore && (
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-2xl font-bold text-white">{p.analysis.overallScore}</span>
                    <span className="text-xs text-white/40">/ 100</span>
                  </div>
                )}
                <p className="text-sm text-white/70 line-clamp-3">
                  {(p.optimized_pitch || p.original_pitch || '').slice(0, 180)}...
                </p>
              </motion.div>
            ))}
          </div>
        )}

        {/* Detail modal */}
        {selected && (
          <div
            onClick={() => setSelected(null)}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-6"
          >
            <motion.div
              onClick={(e) => e.stopPropagation()}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-dark-850 border border-white/10 rounded-2xl max-w-3xl w-full max-h-[80vh] overflow-y-auto p-8"
            >
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-white mb-1">
                    Pitch {selected.mode === 'improve' ? 'Optimizado' : 'Creado'}
                  </h2>
                  <p className="text-white/40 text-sm">
                    {new Date(selected.created_at).toLocaleString('es')}
                  </p>
                </div>
                <button onClick={() => setSelected(null)} className="text-white/40 hover:text-white p-2">
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {selected.analysis?.overallScore && (
                <div className="mb-6 flex items-center gap-4 p-4 glass-card">
                  <div className="text-4xl font-bold text-white">{selected.analysis.overallScore}</div>
                  <div>
                    <p className="text-sm text-white/60">Score global</p>
                    <p className="text-xs text-white/30">{selected.analysis.estimatedReadingTime}</p>
                  </div>
                </div>
              )}

              <pre className="whitespace-pre-wrap text-white/80 text-sm leading-relaxed font-sans">
                {selected.optimized_pitch}
              </pre>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  )
}
