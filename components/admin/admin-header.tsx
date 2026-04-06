'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { LogOut, ExternalLink } from 'lucide-react'

interface AdminHeaderProps {
  userEmail?: string
}

export function AdminHeader({ userEmail }: AdminHeaderProps) {
  const router = useRouter()

  const handleSignOut = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/admin/login')
  }

  return (
    <header className="border-b border-border bg-background">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-6">
            <Link href="/admin" className="flex-shrink-0">
              <h1 className="font-serif text-xl text-foreground">
                Ends With P
              </h1>
            </Link>
            <span className="text-xs tracking-widest uppercase text-muted-foreground">
              Admin
            </span>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-4">
            <Link
              href="/"
              target="_blank"
              className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors duration-300"
            >
              <span className="hidden sm:inline">View Site</span>
              <ExternalLink className="w-4 h-4" />
            </Link>

            {userEmail && (
              <span className="hidden md:block text-sm text-muted-foreground">
                {userEmail}
              </span>
            )}

            <button
              onClick={handleSignOut}
              className="flex items-center gap-2 px-3 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors duration-300"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Sign Out</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  )
}
