import OpenAI from 'openai'

let client: OpenAI | null = null

export function getOpenAIClient(): OpenAI {
  if (!client) {
    if (!process.env.OPENAI_API_KEY) {
      throw new Error('OPENAI_API_KEY is not set in environment variables.')
    }
    client = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    })
  }
  return client
}
