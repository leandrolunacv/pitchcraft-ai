'use client'

import Link from 'next/link'
import Hero from '@/components/landing/Hero'
import Features from '@/components/landing/Features'
import HowItWorks from '@/components/landing/HowItWorks'
import CTA from '@/components/landing/CTA'
import { LanguageProvider, useLang } from '@/context/LanguageContext'
import { translations } from '@/lib/i18n'

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

function NavBar() {
  const { lang } = useLang()
  const t = translations[lang].nav
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-dark-900/80 backdrop-blur-md border-b border-white/5">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5">
          <img src="/logo-efectomentor.png" alt="Efecto Mentor" className="h-7 w-auto object-contain" />
          <div className="w-px h-4 bg-white/20 flex-shrink-0" />
          <div className="w-8 h-8 rounded-lg bg-brand-600 flex items-center justify-center flex-shrink-0">
            <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <span className="font-bold text-white text-lg">PitchCraft AI</span>
        </Link>

        <div className="hidden md:flex items-center gap-8">
          <a href="#features" className="text-white/50 hover:text-white text-sm transition-colors">{t.features}</a>
          <a href="#how-it-works" className="text-white/50 hover:text-white text-sm transition-colors">{t.howItWorks}</a>
          <Link href="/pricing" className="text-white/50 hover:text-white text-sm transition-colors">{t.pricing}</Link>
        </div>

        <div className="flex items-center gap-3">
          <LangToggle />
          <Link href="/dashboard" className="btn-primary text-sm px-5 py-2.5">
            {t.getStarted}
          </Link>
        </div>
      </div>
    </nav>
  )
}

function HomePage() {
  const { lang } = useLang()
  return (
    <main className="bg-dark-900 min-h-screen">
      <NavBar />
      <Hero lang={lang} />
      <Features lang={lang} />
      <HowItWorks lang={lang} />
      <CTA lang={lang} />
      <footer className="border-t border-white/5 py-12">
        <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-brand-600 flex items-center justify-center">
              <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <span className="text-white/60 text-sm font-medium">PitchCraft AI</span>
          </div>
          <p className="text-white/30 text-xs">
            Built with Claude Opus 4.7 · {new Date().getFullYear()}
          </p>
        </div>
      </footer>
    </main>
  )
}

export default function HomePageWrapper() {
  return (
    <LanguageProvider>
      <HomePage />
    </LanguageProvider>
  )
}
