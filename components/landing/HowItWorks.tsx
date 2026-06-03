'use client'

import { motion } from 'framer-motion'
import { translations, type Lang } from '@/lib/i18n'

const colors = [
  'from-brand-600 to-brand-400',
  'from-purple-600 to-purple-400',
  'from-cyan-600 to-cyan-400',
  'from-green-600 to-green-400',
]

export default function HowItWorks({ lang = 'en' }: { lang?: Lang }) {
  const t = translations[lang].howItWorks
  return (
    <section id="how-it-works" className="py-32 relative">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-brand-600/5 rounded-full blur-3xl" />
      </div>

      <div className="max-w-6xl mx-auto px-6 relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-20"
        >
          <span className="text-brand-400 text-sm font-semibold uppercase tracking-widest mb-4 block">{t.tag}</span>
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            {t.title1}{' '}
            <span className="brand-gradient">{t.title2}</span>
          </h2>
          <p className="text-xl text-white/50 max-w-2xl mx-auto">{t.subtitle}</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative">
          <div className="hidden lg:block absolute top-8 left-[12.5%] right-[12.5%] h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
          {t.steps.map((step, i) => (
            <motion.div
              key={step.num}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.15 }}
              className="relative flex flex-col items-center text-center"
            >
              <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${colors[i]} flex items-center justify-center text-white font-bold text-lg mb-6 shadow-lg relative z-10`}>
                {step.num}
              </div>
              <h3 className="text-lg font-semibold text-white mb-3">{step.title}</h3>
              <p className="text-white/50 text-sm leading-relaxed">{step.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
