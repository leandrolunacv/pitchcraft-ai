import { NextRequest, NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'
import { createSupabaseAdminClient } from '@/lib/supabase/server'
import type Stripe from 'stripe'

export const config = { api: { bodyParser: false } }

async function updateUserPlan(
  admin: ReturnType<typeof createSupabaseAdminClient>,
  customerId: string,
  plan: 'paid' | 'free' | 'lifetime',
  subscriptionId?: string
) {
  await admin
    .from('profiles')
    .update({
      plan,
      stripe_subscription_id: subscriptionId ?? null,
    })
    .eq('stripe_customer_id', customerId)
}

export async function POST(req: NextRequest) {
  const body = await req.text()
  const sig = req.headers.get('stripe-signature')!
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(body, sig, webhookSecret)
  } catch (err) {
    return NextResponse.json({ error: 'Webhook signature invalid' }, { status: 400 })
  }

  const admin = createSupabaseAdminClient()

  switch (event.type) {
    case 'checkout.session.completed': {
      const session = event.data.object as Stripe.Checkout.Session
      const customerId = session.customer as string
      const plan = session.metadata?.plan

      if (plan === 'lifetime') {
        await updateUserPlan(admin, customerId, 'lifetime')
      } else if (plan === 'monthly') {
        await updateUserPlan(admin, customerId, 'paid', session.subscription as string)
      }
      break
    }

    case 'customer.subscription.deleted': {
      const sub = event.data.object as Stripe.Subscription
      await updateUserPlan(admin, sub.customer as string, 'free')
      break
    }

    case 'customer.subscription.updated': {
      const sub = event.data.object as Stripe.Subscription
      const status = sub.status
      if (status === 'active' || status === 'trialing') {
        await updateUserPlan(admin, sub.customer as string, 'paid', sub.id)
      } else if (status === 'canceled' || status === 'unpaid') {
        await updateUserPlan(admin, sub.customer as string, 'free')
      }
      break
    }

    case 'invoice.payment_failed': {
      // Could notify user — for now just log
      break
    }
  }

  return NextResponse.json({ received: true })
}
