'use client'

import { useState, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { createSupabaseBrowserClient } from '@/lib/supabase/client'

function LoginForm() {
  const params = useSearchParams()
  const nextPath = params.get('next') || '/dashboard'

  const [email, setEmail] = useState('')
  const [fullName, setFullName] = useState('')
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const supabase = createSupabaseBrowserClient()
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          data: { full_name: fullName || undefined },
          emailRedirectTo: `${location.origin}/auth/callback?next=${encodeURIComponent(nextPath)}`,
        },
      })
      if (error) throw error
      setSent(true)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'No se pudo enviar el magic link')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-6 bg-dark-900">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-brand-600/10 rounded-full blur-3xl" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative w-full max-w-md"
      >
        <Link href="/" className="flex items-center gap-2.5 mb-8 justify-center">
          <img src="/logo-efectomentor.png" alt="Efecto Mentor" className="h-6 w-auto object-contain" />
          <div className="w-px h-5 bg-white/20 flex-shrink-0" />
          <div className="w-9 h-9 rounded-lg bg-brand-600 flex items-center justify-center flex-shrink-0">
            <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <span className="font-bold text-white text-lg">PitchCraft AI</span>
        </Link>

        <div className="glass-card p-8">
          {sent ? (
            <div className="text-center py-6">
              <div className="w-14 h-14 rounded-full bg-green-600/20 border border-green-500/30 flex items-center justify-center mx-auto mb-5">
                <svg className="w-7 h-7 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h2 className="text-xl font-bold text-white mb-2">¡Revisa tu email!</h2>
              <p className="text-sm text-white/60 leading-relaxed">
                Te enviamos un link mágico a <strong className="text-white">{email}</strong>. Haz clic en él para entrar.
              </p>
              <p className="text-xs text-white/30 mt-4">
                El link expira en 1 hora. ¿No lo ves? Revisa spam.
              </p>
            </div>
          ) : (
            <>
              <h1 className="text-2xl font-bold text-white mb-2">Inicia sesión</h1>
              <p className="text-sm text-white/50 mb-6">
                Recibirás un magic link para entrar sin contraseña.
              </p>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-white/50 uppercase tracking-widest mb-2">
                    Nombre
                  </label>
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Cómo te llamamos"
                    className="input-dark w-full"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-white/50 uppercase tracking-widest mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="tu@email.com"
                    className="input-dark w-full"
                  />
                </div>

                {error && <p className="text-red-400 text-xs">{error}</p>}

                <button
                  type="submit"
                  disabled={loading || !email}
                  className="btn-primary w-full py-3 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Enviando...
                    </>
                  ) : (
                    <>Enviar magic link →</>
                  )}
                </button>
              </form>
            </>
          )}
        </div>

        <p className="text-center text-xs text-white/30 mt-6">
          Al continuar aceptas usar PitchCraft AI con responsabilidad.
        </p>
      </motion.div>
    </div>
  )
}

export default function LoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  )
}
