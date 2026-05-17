'use client'

import { motion } from 'framer-motion'

const features = [
  {
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
      </svg>
    ),
    title: 'AI Pitch Analysis',
    description: 'Get a detailed breakdown of your pitch with scores across 6 dimensions: clarity, impact, persuasion, storytelling, confidence, and differentiation.',
    color: 'text-brand-400',
    bg: 'bg-brand-600/10',
    border: 'border-brand-500/20',
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
      </svg>
    ),
    title: 'Pitch from Scratch',
    description: 'Our AI coach asks the right questions and builds a complete, polished pitch script tailored to your product, audience, and goals.',
    color: 'text-purple-400',
    bg: 'bg-purple-600/10',
    border: 'border-purple-500/20',
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    ),
    title: 'One-Click Optimization',
    description: '8 quick-action buttons to instantly transform your pitch: make it more persuasive, shorter, emotional, or investor-optimized — in seconds.',
    color: 'text-yellow-400',
    bg: 'bg-yellow-600/10',
    border: 'border-yellow-500/20',
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
    title: 'Audience Targeting',
    description: 'Tailor every pitch to 7 different audiences: investors, clients, partners, judges, incubators, corporations, or general public.',
    color: 'text-green-400',
    bg: 'bg-green-600/10',
    border: 'border-green-500/20',
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    title: 'Duration Control',
    description: 'Generate pitches calibrated for any time slot: 1 minute elevator pitch, 3 minutes, 5 minutes, or a full 10-minute presentation.',
    color: 'text-cyan-400',
    bg: 'bg-cyan-600/10',
    border: 'border-cyan-500/20',
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
      </svg>
    ),
    title: 'Export & Share',
    description: 'Copy your pitch, download as PDF, or share with your team. Keep a history of all your pitches and iterations.',
    color: 'text-pink-400',
    bg: 'bg-pink-600/10',
    border: 'border-pink-500/20',
  },
]

export default function Features() {
  return (
    <section id="features" className="py-32 relative">
      <div className="max-w-6xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-20"
        >
          <span className="text-brand-400 text-sm font-semibold uppercase tracking-widest mb-4 block">
            Features
          </span>
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Everything you need to{' '}
            <span className="brand-gradient">win the room</span>
          </h2>
          <p className="text-xl text-white/50 max-w-2xl mx-auto">
            Professional-grade pitch tools powered by the most advanced AI, built for founders and sales professionals.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, i) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className={`glass-card p-6 border ${feature.border} hover:scale-[1.02] transition-transform duration-200`}
            >
              <div className={`w-12 h-12 rounded-xl ${feature.bg} ${feature.color} flex items-center justify-center mb-5`}>
                {feature.icon}
              </div>
              <h3 className="text-lg font-semibold text-white mb-3">{feature.title}</h3>
              <p className="text-white/50 text-sm leading-relaxed">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
