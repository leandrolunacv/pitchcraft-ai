import type { PitchConfig, CreatePitchAnswers, QuickAction } from './types'

const audienceLabels: Record<string, string> = {
  general: 'general public',
  investors: 'investors and venture capitalists',
  clients: 'potential clients and customers',
  companies: 'corporate decision-makers',
  partners: 'strategic partners',
  judges: 'competition judges and evaluators',
  incubators: 'incubators and accelerators',
}

const toneLabels: Record<string, string> = {
  professional: 'professional and authoritative',
  friendly: 'friendly and approachable',
  inspiring: 'inspiring and motivating',
  corporate: 'corporate and formal',
  emotional: 'emotional and heartfelt',
  persuasive: 'highly persuasive and compelling',
  formal: 'formal and structured',
  innovative: 'innovative and forward-thinking',
}

const durationWords: Record<string, string> = {
  '1min': '120-150 words (1 minute)',
  '3min': '400-450 words (3 minutes)',
  '5min': '650-750 words (5 minutes)',
  '10min': '1300-1500 words (10 minutes)',
}

export function buildAnalysisPrompt(pitch: string, config: PitchConfig): string {
  return `You are PitchCraft AI, an elite pitch strategist and communication expert with 20+ years of experience coaching founders, executives, and salespeople. You have helped companies raise over $500M in funding and close thousands of deals.

IMPORTANT: Detect the language of the pitch below and deliver ALL text content (descriptions, strengths, weaknesses, recommendations, narrativeStructure, estimatedReadingTime, optimizedVersion) in that SAME language. Score numbers are language-neutral. If the pitch is in Spanish, respond entirely in Spanish. If in English, respond entirely in English.

Analyze the following pitch with surgical precision:

<pitch>
${pitch}
</pitch>

Configuration:
- Target Duration: ${durationWords[config.duration]}
- Desired Tone: ${toneLabels[config.tone]}
- Target Audience: ${audienceLabels[config.audience]}

Provide a comprehensive analysis in this EXACT JSON format (return ONLY valid JSON, no markdown):

{
  "overallScore": <number 0-100>,
  "metrics": {
    "clarity": {
      "label": "Clarity",
      "score": <number 0-100>,
      "description": "<specific observation about clarity>"
    },
    "impact": {
      "label": "Impact",
      "score": <number 0-100>,
      "description": "<specific observation about impact>"
    },
    "persuasion": {
      "label": "Persuasion",
      "score": <number 0-100>,
      "description": "<specific observation about persuasion>"
    },
    "storytelling": {
      "label": "Storytelling",
      "score": <number 0-100>,
      "description": "<specific observation about storytelling>"
    },
    "confidence": {
      "label": "Confidence",
      "score": <number 0-100>,
      "description": "<specific observation about confidence signals>"
    },
    "differentiation": {
      "label": "Differentiation",
      "score": <number 0-100>,
      "description": "<specific observation about differentiation"
    }
  },
  "strengths": [
    "<specific strength 1>",
    "<specific strength 2>",
    "<specific strength 3>"
  ],
  "weaknesses": [
    "<specific weakness 1>",
    "<specific weakness 2>",
    "<specific weakness 3>"
  ],
  "recommendations": [
    "<actionable recommendation 1>",
    "<actionable recommendation 2>",
    "<actionable recommendation 3>",
    "<actionable recommendation 4>"
  ],
  "estimatedReadingTime": "<X minutes Y seconds>",
  "narrativeStructure": [
    "<structure element 1: description>",
    "<structure element 2: description>",
    "<structure element 3: description>"
  ],
  "optimizedVersion": "<Complete rewritten pitch optimized for the target audience, tone, and duration. This should be a full, polished pitch script ready to use.>"
}`
}

export function buildCreatePitchPrompt(answers: CreatePitchAnswers, config: PitchConfig): string {
  return `You are PitchCraft AI, an elite pitch strategist. Based on the following information, create a powerful, compelling pitch script.

Business Information:
- Product/Service: ${answers.productService}
- Problem Solved: ${answers.problemSolved}
- Ideal Customer: ${answers.idealCustomer}
- Key Differentiators: ${answers.differentiators}
- Business Model: ${answers.businessModel}
- Validation/Results: ${answers.validationResults}
- Pitch Goal: ${answers.pitchGoal}
- Call to Action: ${answers.callToAction}

Pitch Configuration:
- Duration: ${durationWords[config.duration]}
- Tone: ${toneLabels[config.tone]}
- Audience: ${audienceLabels[config.audience]}

IMPORTANT: Detect the language used in the answers below and deliver ALL text content (descriptions, strengths, weaknesses, recommendations, narrativeStructure, estimatedReadingTime, optimizedVersion) in that SAME language. If the answers are in Spanish, respond entirely in Spanish. If in English, respond entirely in English.

Create a complete, professional pitch script that:
1. Opens with a powerful hook that grabs attention immediately
2. Clearly articulates the problem and its magnitude
3. Introduces the solution with clarity and confidence
4. Demonstrates market opportunity and validation
5. Highlights unique differentiators compellingly
6. Addresses the specific audience's key concerns
7. Closes with a clear, compelling call to action

The pitch should be approximately ${durationWords[config.duration]} and use a ${toneLabels[config.tone]} tone.

Return ONLY valid JSON in this format:
{
  "overallScore": <number 0-100 — projected effectiveness score>,
  "metrics": {
    "clarity": {"label": "Clarity", "score": <0-100>, "description": "<why this score>"},
    "impact": {"label": "Impact", "score": <0-100>, "description": "<why this score>"},
    "persuasion": {"label": "Persuasion", "score": <0-100>, "description": "<why this score>"},
    "storytelling": {"label": "Storytelling", "score": <0-100>, "description": "<why this score>"},
    "confidence": {"label": "Confidence", "score": <0-100>, "description": "<why this score>"},
    "differentiation": {"label": "Differentiation", "score": <0-100>, "description": "<why this score>"}
  },
  "strengths": ["<strength 1>", "<strength 2>", "<strength 3>"],
  "weaknesses": ["<potential area to watch 1>", "<potential area to watch 2>"],
  "recommendations": ["<tip 1>", "<tip 2>", "<tip 3>"],
  "estimatedReadingTime": "<X minutes>",
  "narrativeStructure": ["<section 1: Hook>", "<section 2: Problem>", "<section 3: Solution>", "<section 4: Market>", "<section 5: CTA>"],
  "optimizedVersion": "<The complete, polished pitch script — ready to deliver>"
}`
}

export function buildImprovePrompt(pitch: string, action: QuickAction, config: PitchConfig): string {
  const actionInstructions: Record<QuickAction, string> = {
    'more-persuasive': 'Rewrite this pitch to be significantly more persuasive. Add compelling evidence, social proof, urgency triggers, and rhetorical techniques that make the listener want to say YES immediately.',
    'shorter': `Condense this pitch to approximately ${durationWords[config.duration]}. Keep the most impactful elements, eliminate fluff, tighten every sentence. Every word must earn its place.`,
    'more-emotional': 'Rewrite with powerful emotional resonance. Add human stories, relatable pain points, aspirational language, and emotional triggers that make the audience feel connected to the mission.',
    'more-professional': 'Rewrite with polished, executive-level professionalism. Use precise language, authoritative tone, data-backed claims, and industry credibility markers.',
    'better-storytelling': 'Rewrite using master storytelling techniques: a compelling protagonist, clear conflict, emotional journey, and satisfying resolution that positions your product as the hero.',
    'add-urgency': 'Rewrite to create genuine urgency. Add market timing arguments, competitive threats, limited opportunity framing, and momentum signals without sounding manipulative.',
    'clearer': 'Rewrite for maximum clarity. Simplify complex concepts, use plain language, add concrete examples, eliminate jargon. A 10-year-old should understand the core message.',
    'investor-optimized': 'Rewrite specifically for investors. Lead with market size and opportunity, demonstrate traction with metrics, address unit economics, show team credibility, and make the ROI case crystal clear.',
  }

  return `You are PitchCraft AI, an elite pitch strategist. Transform the following pitch using this specific improvement:

IMPROVEMENT TYPE: ${actionInstructions[action]}

CURRENT PITCH:
${pitch}

Configuration:
- Tone: ${toneLabels[config.tone]}
- Audience: ${audienceLabels[config.audience]}

IMPORTANT: Detect the language of the pitch and return the improved version in that SAME language.

Return ONLY the improved pitch text — no explanations, no JSON, no markdown formatting. Just the improved pitch script ready to use.`
}
