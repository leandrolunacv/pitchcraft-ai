'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import type { PitchConfig, CreatePitchAnswers } from '@/lib/types'

interface ChatModeProps {
  config: PitchConfig
  onComplete: (answers: CreatePitchAnswers) => void
  isLoading: boolean
}

const questions = [
  {
    key: 'productService' as keyof CreatePitchAnswers,
    question: "What is your product or service?",
    placeholder: 'e.g., A mobile app that helps freelancers manage invoices automatically...',
    hint: 'Describe it in 1-2 sentences.',
  },
  {
    key: 'problemSolved' as keyof CreatePitchAnswers,
    question: "What problem does it solve?",
    placeholder: 'e.g., Freelancers spend 8+ hours per month on invoicing and often forget to follow up...',
    hint: 'Be specific about the pain point.',
  },
  {
    key: 'idealCustomer' as keyof CreatePitchAnswers,
    question: "Who is your ideal customer?",
    placeholder: 'e.g., Freelance designers and developers in the US earning $50K-$150K/year...',
    hint: 'Demographics, psychographics, behaviors.',
  },
  {
    key: 'differentiators' as keyof CreatePitchAnswers,
    question: "What makes you different from competitors?",
    placeholder: 'e.g., We use AI to automatically detect overdue invoices and send personalized follow-ups...',
    hint: 'Your unique advantage.',
  },
  {
    key: 'businessModel' as keyof CreatePitchAnswers,
    question: "How do you make money?",
    placeholder: 'e.g., $29/month SaaS subscription with a 14-day free trial...',
    hint: 'Revenue model and pricing.',
  },
  {
    key: 'validationResults' as keyof CreatePitchAnswers,
    question: "What validation or results do you have?",
    placeholder: 'e.g., 500 beta users, $15K MRR, 94% retention, featured in TechCrunch...',
    hint: 'Traction, metrics, testimonials.',
  },
  {
    key: 'pitchGoal' as keyof CreatePitchAnswers,
    question: "What is the goal of this pitch?",
    placeholder: 'e.g., Raise $500K seed round to hire 2 engineers and scale marketing...',
    hint: 'What do you want the audience to do?',
  },
  {
    key: 'callToAction' as keyof CreatePitchAnswers,
    question: "What's your call to action?",
    placeholder: 'e.g., Schedule a 30-minute demo call this week...',
    hint: 'The specific next step you want.',
  },
]

export default function ChatMode({ config, onComplete, isLoading }: ChatModeProps) {
  const [currentStep, setCurrentStep] = useState(0)
  const [answers, setAnswers] = useState<Partial<CreatePitchAnswers>>({})
  const [currentAnswer, setCurrentAnswer] = useState('')

  const current = questions[currentStep]
  const progress = ((currentStep) / questions.length) * 100

  const handleNext = () => {
    if (!currentAnswer.trim()) return

    const newAnswers = { ...answers, [current.key]: currentAnswer }
    setAnswers(newAnswers)
    setCurrentAnswer('')

    if (currentStep < questions.length - 1) {
      setCurrentStep((s) => s + 1)
    } else {
      onComplete(newAnswers as CreatePitchAnswers)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && e.metaKey) {
      handleNext()
    }
  }

  return (
    <div className="flex flex-col h-full">
      {/* Progress */}
      <div className="mb-8">
        <div className="flex justify-between text-xs text-white/40 mb-2">
          <span>Question {currentStep + 1} of {questions.length}</span>
          <span>{Math.round(progress)}% complete</span>
        </div>
        <div className="h-1 bg-white/10 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-brand-500 rounded-full"
            initial={{ width: '0%' }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.4 }}
          />
        </div>
      </div>

      {/* Previous answers summary */}
      {currentStep > 0 && (
        <div className="mb-6 space-y-2 max-h-32 overflow-y-auto">
          {Object.entries(answers).slice(-2).map(([key, value]) => {
            const q = questions.find((q) => q.key === key)
            return (
              <div key={key} className="flex gap-2 text-xs">
                <span className="text-brand-400 font-medium flex-shrink-0">✓</span>
                <span className="text-white/40 truncate">{value as string}</span>
              </div>
            )
          })}
        </div>
      )}

      {/* Current question */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
          className="flex-1 flex flex-col"
        >
          <div className="flex items-start gap-3 mb-6">
            <div className="w-8 h-8 rounded-full bg-brand-600/30 border border-brand-500/30 flex items-center justify-center flex-shrink-0 mt-0.5">
              <svg className="w-4 h-4 text-brand-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <div>
              <p className="text-white font-semibold text-lg mb-1">{current.question}</p>
              <p className="text-white/40 text-sm">{current.hint}</p>
            </div>
          </div>

          <textarea
            value={currentAnswer}
            onChange={(e) => setCurrentAnswer(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={current.placeholder}
            rows={4}
            className="input-dark w-full resize-none flex-1 text-sm"
            autoFocus
          />

          <div className="flex items-center justify-between mt-4">
            <span className="text-xs text-white/30">⌘ + Enter to continue</span>
            <div className="flex items-center gap-3">
              {currentStep > 0 && (
                <button
                  onClick={() => {
                    setCurrentStep((s) => s - 1)
                    setCurrentAnswer((answers as any)[questions[currentStep - 1].key] || '')
                  }}
                  className="btn-secondary text-sm px-4 py-2"
                >
                  Back
                </button>
              )}
              <button
                onClick={handleNext}
                disabled={!currentAnswer.trim() || isLoading}
                className="btn-primary text-sm px-6 py-2 disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {currentStep === questions.length - 1 ? (
                  isLoading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      Generate Pitch
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                    </>
                  )
                ) : (
                  <>
                    Next
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </>
                )}
              </button>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  )
}
