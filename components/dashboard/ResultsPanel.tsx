'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import type { PitchAnalysis } from '@/lib/types'
import AnalysisScore from './AnalysisScore'
import QuickActions from './QuickActions'
import type { QuickAction } from '@/lib/types'

interface ResultsPanelProps {
  analysis: PitchAnalysis
  onQuickAction: (action: QuickAction) => void
  isImproving: boolean
}

type Tab = 'pitch' | 'analysis'

export default function ResultsPanel({ analysis, onQuickAction, isImproving }: ResultsPanelProps) {
  const [activeTab, setActiveTab] = useState<Tab>('pitch')
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    await navigator.clipboard.writeText(analysis.optimizedVersion)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleDownload = () => {
    const blob = new Blob([analysis.optimizedVersion], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'pitch-script.txt'
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="h-full flex flex-col"
    >
      {/* Tab bar */}
      <div className="flex items-center gap-1 mb-6 p-1 bg-white/5 rounded-xl w-fit">
        {(['pitch', 'analysis'] as Tab[]).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-lg text-sm font-medium capitalize transition-all duration-150 ${
              activeTab === tab
                ? 'bg-white/15 text-white'
                : 'text-white/40 hover:text-white/70'
            }`}
          >
            {tab === 'pitch' ? '📝 Optimized Pitch' : '📊 Analysis'}
          </button>
        ))}
      </div>

      {activeTab === 'pitch' && (
        <div className="flex flex-col flex-1 gap-4">
          {/* Action buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium bg-white/10 hover:bg-white/15 text-white border border-white/10 transition-all"
            >
              {copied ? (
                <>
                  <svg className="w-4 h-4 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Copied!
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                  </svg>
                  Copy
                </>
              )}
            </button>
            <button
              onClick={handleDownload}
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium bg-white/10 hover:bg-white/15 text-white border border-white/10 transition-all"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              Download
            </button>
            <div className="ml-auto flex items-center gap-2 text-sm text-white/40">
              <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
              Score: {analysis.overallScore}/100
            </div>
          </div>

          {/* Quick actions */}
          <QuickActions onAction={onQuickAction} isLoading={isImproving} />

          {/* Pitch content */}
          <div className="flex-1 relative">
            {isImproving && (
              <div className="absolute inset-0 bg-dark-900/80 backdrop-blur-sm z-10 flex items-center justify-center rounded-xl">
                <div className="flex flex-col items-center gap-3">
                  <div className="w-8 h-8 border-2 border-brand-500 border-t-transparent rounded-full animate-spin" />
                  <span className="text-sm text-white/60">Improving your pitch...</span>
                </div>
              </div>
            )}
            <div className="glass-card p-6 h-full min-h-[300px] overflow-y-auto">
              <pre className="whitespace-pre-wrap text-white/80 text-sm leading-relaxed font-sans">
                {analysis.optimizedVersion}
              </pre>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'analysis' && (
        <div className="flex-1 overflow-y-auto">
          <AnalysisScore analysis={analysis} />
        </div>
      )}
    </motion.div>
  )
}
