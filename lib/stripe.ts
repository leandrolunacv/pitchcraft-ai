import Stripe from 'stripe'

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2026-04-22.dahlia' as any,
})

export const PLANS = {
  monthly: {
    priceId: process.env.STRIPE_PRICE_MONTHLY!,
    amount: 700,
    label: 'Pro Monthly',
    interval: 'month' as const,
    pitches: 20,
  },
  lifetime: {
    priceId: process.env.STRIPE_PRICE_LIFETIME!,
    amount: 5000,
    label: 'Pro Lifetime',
    interval: null,
    pitches: 20,
  },
}
