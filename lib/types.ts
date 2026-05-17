export type PitchDuration = '1min' | '3min' | '5min' | '10min'

export type PitchTone =
  | 'professional'
  | 'friendly'
  | 'inspiring'
  | 'corporate'
  | 'emotional'
  | 'persuasive'
  | 'formal'
  | 'innovative'

export type PitchAudience =
  | 'general'
  | 'investors'
  | 'clients'
  | 'companies'
  | 'partners'
  | 'judges'
  | 'incubators'

export type PitchStructure =
  | 'problem-solution'
  | 'storytelling'
  | 'elevator'
  | 'sales'
  | 'investor'

export type QuickAction =
  | 'more-persuasive'
  | 'shorter'
  | 'more-emotional'
  | 'more-professional'
  | 'better-storytelling'
  | 'add-urgency'
  | 'clearer'
  | 'investor-optimized'

export interface PitchConfig {
  duration: PitchDuration
  tone: PitchTone
  audience: PitchAudience
  structure?: PitchStructure
}

export interface ScoreMetric {
  label: string
  score: number
  description: string
}

export interface PitchAnalysis {
  overallScore: number
  metrics: {
    clarity: ScoreMetric
    impact: ScoreMetric
    persuasion: ScoreMetric
    storytelling: ScoreMetric
    confidence: ScoreMetric
    differentiation: ScoreMetric
  }
  strengths: string[]
  weaknesses: string[]
  recommendations: string[]
  estimatedReadingTime: string
  optimizedVersion: string
  narrativeStructure: string[]
}

export interface ChatMessage {
  role: 'user' | 'assistant'
  content: string
}

export interface PitchSession {
  id: string
  mode: 'improve' | 'create'
  originalPitch?: string
  config: PitchConfig
  analysis?: PitchAnalysis
  optimizedPitch?: string
  chatHistory: ChatMessage[]
  createdAt: Date
}

export interface CreatePitchAnswers {
  productService: string
  problemSolved: string
  idealCustomer: string
  differentiators: string
  businessModel: string
  validationResults: string
  pitchGoal: string
  callToAction: string
}
