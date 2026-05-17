'use client'

import { motion } from 'framer-motion'
import type { PitchConfig, PitchDuration, PitchTone, PitchAudience } from '@/lib/types'

interface ConfigPanelProps {
  config: PitchConfig
  onChange: (config: PitchConfig) => void
}

const durations: { value: PitchDuration; label: string; desc: string }[] = [
  { value: '1min', label: '1 min', desc: 'Elevator' },
  { value: '3min', label: '3 min', desc: 'Quick' },
  { value: '5min', label: '5 min', desc: 'Standard' },
  { value: '10min', label: '10 min', desc: 'Full' },
]

const tones: { value: PitchTone; label: string; emoji: string }[] = [
  { value: 'professional', label: 'Professional', emoji: '👔' },
  { value: 'friendly', label: 'Friendly', emoji: '😊' },
  { value: 'inspiring', label: 'Inspiring', emoji: '✨' },
  { value: 'corporate', label: 'Corporate', emoji: '🏢' },
  { value: 'emotional', label: 'Emotional', emoji: '❤️' },
  { value: 'persuasive', label: 'Persuasive', emoji: '🎯' },
  { value: 'formal', label: 'Formal', emoji: '📋' },
  { value: 'innovative', label: 'Innovative', emoji: '🚀' },
]

const audiences: { value: PitchAudience; label: string; icon: string }[] = [
  { value: 'general', label: 'General Public', icon: '🌍' },
  { value: 'investors', label: 'Investors', icon: '💰' },
  { value: 'clients', label: 'Clients', icon: '🤝' },
  { value: 'companies', label: 'Companies', icon: '🏗️' },
  { value: 'partners', label: 'Partners', icon: '🔗' },
  { value: 'judges', label: 'Judges', icon: '🏆' },
  { value: 'incubators', label: 'Incubators', icon: '🌱' },
]

export default function ConfigPanel({ config, onChange }: ConfigPanelProps) {
  return (
    <div className="space-y-6">
      {/* Duration */}
      <div>
        <label className="block text-xs font-semibold text-white/50 uppercase tracking-widest mb-3">
          Duration
        </label>
        <div className="grid grid-cols-4 gap-2">
          {durations.map((d) => (
            <button
              key={d.value}
              onClick={() => onChange({ ...config, duration: d.value })}
              className={`py-2 px-1 rounded-lg text-center transition-all duration-150 ${
                config.duration === d.value
                  ? 'bg-brand-600 text-white border border-brand-500'
                  : 'bg-white/5 text-white/50 border border-white/10 hover:bg-white/10 hover:text-white'
              }`}
            >
              <div className="text-sm font-bold">{d.label}</div>
              <div className="text-xs opacity-70">{d.desc}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Tone */}
      <div>
        <label className="block text-xs font-semibold text-white/50 uppercase tracking-widest mb-3">
          Tone
        </label>
        <div className="grid grid-cols-2 gap-2">
          {tones.map((t) => (
            <button
              key={t.value}
              onClick={() => onChange({ ...config, tone: t.value })}
              className={`py-2 px-3 rounded-lg text-left flex items-center gap-2 transition-all duration-150 text-sm ${
                config.tone === t.value
                  ? 'bg-brand-600/30 text-white border border-brand-500/50'
                  : 'bg-white/5 text-white/50 border border-white/10 hover:bg-white/10 hover:text-white'
              }`}
            >
              <span>{t.emoji}</span>
              <span className="font-medium">{t.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Audience */}
      <div>
        <label className="block text-xs font-semibold text-white/50 uppercase tracking-widest mb-3">
          Audience
        </label>
        <div className="grid grid-cols-1 gap-2">
          {audiences.map((a) => (
            <button
              key={a.value}
              onClick={() => onChange({ ...config, audience: a.value })}
              className={`py-2.5 px-3 rounded-lg text-left flex items-center gap-3 transition-all duration-150 text-sm ${
                config.audience === a.value
                  ? 'bg-brand-600/30 text-white border border-brand-500/50'
                  : 'bg-white/5 text-white/50 border border-white/10 hover:bg-white/10 hover:text-white'
              }`}
            >
              <span className="text-base">{a.icon}</span>
              <span className="font-medium">{a.label}</span>
              {config.audience === a.value && (
                <span className="ml-auto">
                  <svg className="w-4 h-4 text-brand-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </span>
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
