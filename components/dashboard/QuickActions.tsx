'use client'

import type { QuickAction } from '@/lib/types'

interface QuickActionsProps {
  onAction: (action: QuickAction) => void
  isLoading: boolean
}

const actions: { value: QuickAction; label: string; icon: string; color: string }[] = [
  { value: 'more-persuasive', label: 'More Persuasive', icon: '🎯', color: 'hover:border-brand-500/50 hover:bg-brand-600/10' },
  { value: 'shorter', label: 'Make Shorter', icon: '✂️', color: 'hover:border-yellow-500/50 hover:bg-yellow-600/10' },
  { value: 'more-emotional', label: 'More Emotional', icon: '❤️', color: 'hover:border-pink-500/50 hover:bg-pink-600/10' },
  { value: 'more-professional', label: 'More Professional', icon: '👔', color: 'hover:border-cyan-500/50 hover:bg-cyan-600/10' },
  { value: 'better-storytelling', label: 'Better Storytelling', icon: '📖', color: 'hover:border-purple-500/50 hover:bg-purple-600/10' },
  { value: 'add-urgency', label: 'Add Urgency', icon: '⚡', color: 'hover:border-orange-500/50 hover:bg-orange-600/10' },
  { value: 'clearer', label: 'Make Clearer', icon: '💡', color: 'hover:border-blue-500/50 hover:bg-blue-600/10' },
  { value: 'investor-optimized', label: 'For Investors', icon: '💰', color: 'hover:border-green-500/50 hover:bg-green-600/10' },
]

export default function QuickActions({ onAction, isLoading }: QuickActionsProps) {
  return (
    <div>
      <p className="text-xs font-semibold text-white/40 uppercase tracking-widest mb-3">
        Quick Optimize
      </p>
      <div className="flex flex-wrap gap-2">
        {actions.map((action) => (
          <button
            key={action.value}
            onClick={() => onAction(action.value)}
            disabled={isLoading}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-white/60 border border-white/10 bg-white/5 transition-all duration-150 disabled:opacity-40 disabled:cursor-not-allowed ${action.color}`}
          >
            <span>{action.icon}</span>
            {action.label}
          </button>
        ))}
      </div>
    </div>
  )
}
