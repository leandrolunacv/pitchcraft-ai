import Link from 'next/link'
import Image from 'next/image'

export default function NavLogo() {
  return (
    <Link href="/" className="flex items-center gap-2.5">
      <Image
        src="/logo-efectomentor.png"
        alt="Efecto Mentor"
        width={110}
        height={43}
        className="h-6 w-auto object-contain"
        priority
      />
      <div className="w-px h-4 bg-white/20" />
      <div className="w-7 h-7 rounded-lg bg-brand-600 flex items-center justify-center flex-shrink-0">
        <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      </div>
      <span className="font-bold text-white text-base">PitchCraft AI</span>
    </Link>
  )
}
