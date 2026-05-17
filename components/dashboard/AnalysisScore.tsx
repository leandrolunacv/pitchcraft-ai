'use client'

import { motion } from 'framer-motion'
import type { PitchAnalysis } from '@/lib/types'

interface AnalysisScoreProps {
  analysis: PitchAnalysis
}

const metricColors: Record<string, string> = {
  clarity: 'bg-blue-500',
  impact: 'bg-purple-500',
  persuasion: 'bg-brand-500',
  storytelling: 'bg-pink-500',
  confidence: 'bg-green-500',
  differentiation: 'bg-yellow-500',
}

function ScoreCircle({ score }: { score: number }) {
  const radius = 40
  const circumference = 2 * Math.PI * radius
  const strokeDashoffset = circumference - (score / 100) * circumference

  const color =
    score >= 80 ? '#22c55e' : score >= 60 ? '#6172f3' : score >= 40 ? '#f59e0b' : '#ef4444'

  return (
    <div className="relative w-28 h-28 flex items-center justify-center">
      <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 100 100">
        <circle cx="50" cy="50" r={radius} fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="6" />
        <motion.circle
          cx="50"
          cy="50"
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth="6"
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset }}
          transition={{ duration: 1.2, ease: 'easeOut' }}
        />
      </svg>
      <div className="text-center z-10">
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="text-3xl font-bold text-white"
        >
          {score}
        </motion.div>
        <div className="text-xs text-white/40 font-medium">/ 100</div>
      </div>
    </div>
  )
}

export default function AnalysisScore({ analysis }: AnalysisScoreProps) {
  const metrics = Object.entries(analysis.metrics)

  return (
    <div className="space-y-8">
      {/* Overall score */}
      <div className="flex items-center gap-8 p-6 glass-card">
        <ScoreCircle score={analysis.overallScore} />
        <div>
          <div className="text-sm text-white/40 font-medium uppercase tracking-widest mb-1">
            Overall Score
          </div>
          <div className="text-2xl font-bold text-white mb-2">
            {analysis.overallScore >= 80
              ? 'Excellent Pitch'
              : analysis.overallScore >= 60
              ? 'Good Pitch'
              : analysis.overallScore >= 40
              ? 'Needs Work'
              : 'Requires Major Revision'}
          </div>
          <div className="text-white/50 text-sm">{analysis.estimatedReadingTime} read</div>
        </div>
      </div>

      {/* Metrics breakdown */}
      <div className="space-y-4">
        <h3 className="text-xs font-semibold text-white/40 uppercase tracking-widest">
          Dimension Breakdown
        </h3>
        {metrics.map(([key, metric], i) => (
          <motion.div
            key={key}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: i * 0.08 }}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-white">{metric.label}</span>
              <span className="text-sm font-bold text-white">{metric.score}</span>
            </div>
            <div className="h-1.5 bg-white/10 rounded-full overflow-hidden mb-1">
              <motion.div
                className={`h-full ${metricColors[key] || 'bg-brand-500'} rounded-full`}
                initial={{ width: '0%' }}
                animate={{ width: `${metric.score}%` }}
                transition={{ duration: 0.8, delay: i * 0.08, ease: 'easeOut' }}
              />
            </div>
            <p className="text-xs text-white/40">{metric.description}</p>
          </motion.div>
        ))}
      </div>

      {/* Strengths */}
      <div>
        <h3 className="text-xs font-semibold text-white/40 uppercase tracking-widest mb-3">
          Strengths
        </h3>
        <ul className="space-y-2">
          {analysis.strengths.map((s, i) => (
            <motion.li
              key={i}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
              className="flex items-start gap-2 text-sm text-white/70"
            >
              <svg className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              {s}
            </motion.li>
          ))}
        </ul>
      </div>

      {/* Weaknesses */}
      <div>
        <h3 className="text-xs font-semibold text-white/40 uppercase tracking-widest mb-3">
          Areas to Improve
        </h3>
        <ul className="space-y-2">
          {analysis.weaknesses.map((w, i) => (
            <motion.li
              key={i}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
              className="flex items-start gap-2 text-sm text-white/70"
            >
              <svg className="w-4 h-4 text-yellow-400 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              {w}
            </motion.li>
          ))}
        </ul>
      </div>

      {/* Recommendations */}
      <div>
        <h3 className="text-xs font-semibold text-white/40 uppercase tracking-widest mb-3">
          Recommendations
        </h3>
        <ul className="space-y-2">
          {analysis.recommendations.map((r, i) => (
            <motion.li
              key={i}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
              className="flex items-start gap-2 text-sm text-white/70"
            >
              <span className="text-brand-400 font-bold text-xs mt-1 flex-shrink-0">→</span>
              {r}
            </motion.li>
          ))}
        </ul>
      </div>

      {/* Narrative structure */}
      {analysis.narrativeStructure && analysis.narrativeStructure.length > 0 && (
        <div>
          <h3 className="text-xs font-semibold text-white/40 uppercase tracking-widest mb-3">
            Narrative Structure
          </h3>
          <div className="space-y-2">
            {analysis.narrativeStructure.map((section, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: i * 0.1 }}
                className="flex items-center gap-3"
              >
                <div className="w-6 h-6 rounded-full bg-brand-600/30 text-brand-400 flex items-center justify-center text-xs font-bold flex-shrink-0">
                  {i + 1}
                </div>
                <p className="text-sm text-white/60">{section}</p>
              </motion.div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
