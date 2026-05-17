'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'

export default function CTA() {
  return (
    <section className="py-32 relative">
      <div className="max-w-4xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="relative glass-card p-16 text-center overflow-hidden gradient-border"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-brand-600/10 via-transparent to-purple-600/10 pointer-events-none" />
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-64 bg-brand-600/20 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10">
            <span className="text-brand-400 text-sm font-semibold uppercase tracking-widest mb-4 block">
              Ready to Start?
            </span>
            <h2 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
              Your next pitch will be{' '}
              <span className="brand-gradient">unforgettable</span>
            </h2>
            <p className="text-xl text-white/50 max-w-xl mx-auto mb-10">
              Join thousands of founders and sales professionals who craft winning pitches with PitchCraft AI.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/dashboard"
                className="btn-primary text-lg px-10 py-4 glow-brand inline-flex items-center gap-2 group"
              >
                Create Your Pitch Now
                <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Link>
              <p className="text-white/30 text-sm">No credit card required • Free to use</p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
