export type Plan = 'free' | 'paid' | 'lifetime'

export const PLAN_LIMITS: Record<Plan, number> = {
  free: 3,
  paid: 999999, // unlimited
  lifetime: 999999, // unlimited
}

export const PLAN_LABELS: Record<Plan, string> = {
  free: 'Free',
  paid: 'Pro',
  lifetime: 'Lifetime',
}

export function getMonthStart(): Date {
  const now = new Date()
  return new Date(now.getFullYear(), now.getMonth(), 1)
}

export interface UsageStatus {
  plan: Plan
  limit: number
  used: number
  remaining: number
  resetAt: Date
}

export async function checkUsage(
  supabaseAdmin: any,
  userId: string
): Promise<UsageStatus> {
  const { data: profile } = await supabaseAdmin
    .from('profiles')
    .select('plan')
    .eq('id', userId)
    .single()

  const plan: Plan = (profile?.plan as Plan) || 'free'
  const limit = PLAN_LIMITS[plan]
  const monthStart = getMonthStart()

  const { count } = await supabaseAdmin
    .from('usage_log')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', userId)
    .in('action', ['analyze', 'create'])
    .gte('created_at', monthStart.toISOString())

  const used = count || 0
  const nextMonth = new Date(monthStart)
  nextMonth.setMonth(nextMonth.getMonth() + 1)

  return {
    plan,
    limit,
    used,
    remaining: Math.max(0, limit - used),
    resetAt: nextMonth,
  }
}

export async function logUsage(
  supabaseAdmin: any,
  userId: string,
  action: string
) {
  await supabaseAdmin.from('usage_log').insert({ user_id: userId, action })
}
