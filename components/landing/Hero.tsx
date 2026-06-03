'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { translations, type Lang } from '@/lib/i18n'

export default function Hero({ lang = 'en' }: { lang?: Lang }) {
  const t = translations[lang].hero
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-brand-600/10 rounded-full blur-3xl" />
        <div className="absolute top-1/3 left-1/4 w-[300px] h-[300px] bg-brand-500/5 rounded-full blur-2xl" />
        <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-purple-600/5 rounded-full blur-3xl" />
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `linear-gradient(rgba(97,114,243,1) 1px, transparent 1px), linear-gradient(90deg, rgba(97,114,243,1) 1px, transparent 1px)`,
            backgroundSize: '60px 60px',
          }}
        />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-600/20 border border-brand-500/30 text-brand-300 text-sm font-medium mb-8"
        >
          <span className="w-2 h-2 bg-brand-400 rounded-full animate-pulse" />
          {t.badge}
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-5xl md:text-7xl font-bold tracking-tight mb-6 leading-tight"
        >
          {t.title1}{' '}
          <span className="brand-gradient">{t.title2}</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-xl md:text-2xl text-white/60 max-w-3xl mx-auto mb-12 leading-relaxed"
        >
          {t.subtitle}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16"
        >
          <Link
            href="/dashboard"
            className="btn-primary text-lg px-8 py-4 glow-brand inline-flex items-center gap-2 group"
          >
            {t.cta}
            <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </Link>
          <a href="#how-it-works" className="btn-secondary text-lg px-8 py-4 inline-flex items-center gap-2">
            {t.ctaSecondary}
          </a>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="flex flex-wrap items-center justify-center gap-8 text-white/40 text-sm"
        >
          {t.stats.map((stat) => (
            <div key={stat.label} className="flex flex-col items-center">
              <span className="text-2xl font-bold text-white/80">{stat.value}</span>
              <span className="text-xs">{stat.label}</span>
            </div>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="mt-20 relative max-w-4xl mx-auto"
        >
          <div className="glass-card p-6 text-left gradient-border">
            <div className="flex items-center gap-3 mb-4">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-red-500/60" />
                <div className="w-3 h-3 rounded-full bg-yellow-500/60" />
                <div className="w-3 h-3 rounded-full bg-green-500/60" />
              </div>
              <span className="text-white/30 text-xs font-mono">pitchcraft-ai — dashboard</span>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-3">
                <div className="h-4 bg-white/10 rounded w-3/4" />
                <div className="h-4 bg-white/5 rounded w-full" />
                <div className="h-4 bg-white/5 rounded w-5/6" />
                <div className="h-20 bg-white/5 rounded mt-4" />
              </div>
              <div className="space-y-2">
                {[
                  { label: 'Clarity', score: 87, color: 'bg-brand-500' },
                  { label: 'Persuasion', score: 92, color: 'bg-purple-500' },
                  { label: 'Impact', score: 78, color: 'bg-pink-500' },
                  { label: 'Storytelling', score: 84, color: 'bg-cyan-500' },
                ].map((metric) => (
                  <div key={metric.label}>
                    <div className="flex justify-between text-xs text-white/40 mb-1">
                      <span>{metric.label}</span>
                      <span>{metric.score}%</span>
                    </div>
                    <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                      <div className={`h-full ${metric.color} rounded-full`} style={{ width: `${metric.score}%` }} />
                    </div>
                  </div>
                ))}
                <div className="mt-4 flex items-center gap-2 text-white/60 text-xs">
                  <div className="w-8 h-8 rounded-lg bg-brand-600/30 flex items-center justify-center text-brand-400 font-bold text-sm">85</div>
                  <span>Overall Score</span>
                </div>
              </div>
            </div>
          </div>
          <div className="absolute -inset-px rounded-2xl bg-gradient-to-b from-brand-500/10 to-transparent pointer-events-none" />
        </motion.div>
      </div>
    </section>
  )
}
