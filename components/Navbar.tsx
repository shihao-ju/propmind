'use client'

import Link from 'next/link'
import { Building2, LogOut } from 'lucide-react'
import { useSession } from '@/lib/useSession'

export default function Navbar() {
  const { user, loading, logout } = useSession()

  return (
    <header className="h-16 border-b bg-white flex items-center px-6 shrink-0">
      <Link href="/" className="flex items-center gap-2">
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
        {user?.role === 'landlord' && (
          <Link
            href="/tenant/portland-oak-st"
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            Tenant Chat
          </Link>
        )}
      </nav>

      <div className="ml-auto flex items-center gap-3">
        {loading ? (
          <div className="flex items-center gap-2">
            <div className="h-4 w-20 bg-muted animate-pulse rounded" />
            <div className="h-5 w-16 bg-muted animate-pulse rounded-full" />
          </div>
        ) : user ? (
          <>
            <span className="text-sm font-medium">{user.name}</span>
            <span
              className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                user.role === 'landlord'
                  ? 'bg-primary/10 text-primary'
                  : 'bg-info/10 text-info'
              }`}
            >
              {user.role === 'landlord' ? 'Landlord' : 'Tenant'}
            </span>
            <button
              onClick={logout}
              className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <LogOut className="h-4 w-4" />
              Sign Out
            </button>
          </>
        ) : null}
      </div>
    </header>
  )
}
