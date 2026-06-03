'use client'

import { useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { LanguageProvider, useLang } from '@/context/LanguageContext'
import { pricingTranslations } from '@/lib/i18n'

const planIds = ['free', 'monthly', 'teams', 'lifetime']
const highlights = [false, true, false, false]

function LangToggle() {
  const { lang, setLang } = useLang()
  return (
    <button
      onClick={() => setLang(lang === 'en' ? 'es' : 'en')}
      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-white/60 hover:text-white text-sm font-medium transition-all"
    >
      <span>{lang === 'en' ? '🇺🇸' : '🇪🇸'}</span>
      <span>{lang === 'en' ? 'EN' : 'ES'}</span>
    </button>
  )
}

function PricingContent() {
  const { lang } = useLang()
  const t = pricingTranslations[lang]
  const [loading, setLoading] = useState<string | null>(null)

  async function handleCheckout(plan: 'monthly' | 'teams' | 'lifetime') {
    setLoading(plan)
    try {
      const res = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plan }),
      })
      const data = await res.json()
      if (data.url) {
        window.location.href = data.url
      } else if (res.status === 401) {
        window.location.href = '/login'
      }
    } catch {
      alert(lang === 'es' ? 'Error al iniciar el pago. Intenta de nuevo.' : 'Payment error. Please try again.')
    } finally {
      setLoading(null)
    }
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
          <LangToggle />
          <Link href="/dashboard" className="btn-secondary text-sm px-4 py-2">Dashboard</Link>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-6 py-20">
        <div className="text-center mb-14">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <span className="text-xs font-semibold text-brand-400 uppercase tracking-widest mb-4 block">{t.tag}</span>
            <h1 className="text-4xl font-bold text-white mb-4">
              {t.title} <span className="text-brand-400">{t.titleHighlight}</span>
            </h1>
            <p className="text-white/50 text-lg max-w-xl mx-auto">{t.subtitle}</p>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 pt-4">
          {t.plans.map((plan, i) => (
            <motion.div
              key={plan.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className={`relative rounded-2xl p-8 flex flex-col mt-4 ${
                highlights[i] ? 'bg-brand-600/10 border-2 border-brand-500/50' : 'glass-card'
              }`}
            >
              {highlights[i] && (
                <div className="flex justify-center mb-4 -mt-4">
                  <span className="bg-brand-600 text-white text-xs font-bold px-4 py-1.5 rounded-full">
                    {t.mostPopular}
                  </span>
                </div>
              )}

              <div className="mb-6">
                <h2 className="text-lg font-bold text-white mb-1">{plan.name}</h2>
                <p className="text-white/40 text-sm mb-4">{plan.description}</p>
                <div className="flex items-end gap-1">
                  <span className="text-4xl font-bold text-white">{plan.price}</span>
                  <span className="text-white/40 text-sm mb-1">{plan.period}</span>
                </div>
              </div>

              <ul className="space-y-3 mb-8 flex-1">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-start gap-2.5 text-sm text-white/70">
                    <svg className="w-4 h-4 text-brand-400 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                    </svg>
                    {f}
                  </li>
                ))}
              </ul>

              {plan.id === 'free' ? (
                <Link
                  href="/login"
                  className={`w-full text-center py-3 rounded-xl font-semibold text-sm transition-all ${highlights[i] ? 'btn-primary' : 'btn-secondary'}`}
                >
                  {plan.cta}
                </Link>
              ) : (
                <button
                  onClick={() => handleCheckout(planIds[i] as 'monthly' | 'teams' | 'lifetime')}
                  disabled={loading === planIds[i]}
                  className={`w-full py-3 rounded-xl font-semibold text-sm transition-all disabled:opacity-60 disabled:cursor-not-allowed ${highlights[i] ? 'btn-primary' : 'btn-secondary'}`}
                >
                  {loading === planIds[i] ? (
                    <span className="flex items-center justify-center gap-2">
                      <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                      {lang === 'es' ? 'Redirigiendo...' : 'Redirecting...'}
                    </span>
                  ) : plan.cta}
                </button>
              )}
            </motion.div>
          ))}
        </div>

        <p className="text-center text-white/30 text-sm mt-10">{t.footer}</p>
      </div>
    </div>
  )
}

export default function PricingPage() {
  return (
    <LanguageProvider>
      <PricingContent />
    </LanguageProvider>
  )
}
