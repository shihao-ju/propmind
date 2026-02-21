import Link from 'next/link'
import { Building2 } from 'lucide-react'

export default function LandingNav() {
  return (
    <nav className="absolute top-0 left-0 right-0 z-50">
      <div className="max-w-7xl mx-auto px-6 py-5 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-white/20 backdrop-blur flex items-center justify-center">
            <Building2 className="h-4 w-4 text-white" />
          </div>
          <span className="text-lg font-bold tracking-tight text-white">
            PropMind
          </span>
        </Link>
        <Link
          href="/login"
          className="text-sm font-semibold text-white/90 hover:text-white transition-colors"
        >
          Sign In
        </Link>
      </div>
    </nav>
  )
}
