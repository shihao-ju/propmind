import Link from 'next/link'
import { Building2 } from 'lucide-react'

export default function Navbar() {
  return (
    <header className="h-16 border-b bg-white flex items-center px-6 shrink-0">
      <Link href="/dashboard" className="flex items-center gap-2">
        <div className="h-8 w-8 rounded-lg bg-[#2D6A4F] flex items-center justify-center">
          <Building2 className="h-4 w-4 text-white" />
        </div>
        <span className="text-lg font-bold tracking-tight">PropMind</span>
      </Link>
      <nav className="ml-8 flex items-center gap-4">
        <Link
          href="/dashboard"
          className="text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          Dashboard
        </Link>
      </nav>
    </header>
  )
}
