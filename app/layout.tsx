import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'PitchCraft AI — Craft Pitches That Close',
  description:
    'AI-powered pitch creation and optimization for entrepreneurs, startups, and salespeople. Create compelling pitches that win investors, clients, and deals.',
  keywords: 'pitch, AI, startup, investor, sales, pitch deck, pitch script, Claude AI',
  openGraph: {
    title: 'PitchCraft AI — Craft Pitches That Close',
    description: 'AI-powered pitch creation and optimization',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es" className="dark">
      <body className="bg-dark-900 text-white antialiased flex flex-col min-h-screen">
        <main className="flex-1">{children}</main>
        <footer className="border-t border-white/5 py-3 px-6 flex items-center justify-center">
          <p className="text-xs text-white/30">
            By{' '}
            <a
              href="https://www.efectomentor.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-brand-400 hover:text-brand-300 transition-colors font-medium"
            >
              Efectomentor.com
            </a>
          </p>
        </footer>
      </body>
    </html>
  )
}
