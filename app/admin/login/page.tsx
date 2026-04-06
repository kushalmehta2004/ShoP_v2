'use client'

import { createClient } from '@/lib/supabase/client'
import { Input } from '@/components/ui/input'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { motion } from 'framer-motion'
import { Spinner } from '@/components/ui/spinner'

export default function AdminLoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    const supabase = createClient()
    setIsLoading(true)
    setError(null)

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })
      if (error) throw error
      router.push('/admin')
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : 'An error occurred')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="border-b border-border">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
          <Link href="/">
            <h1 className="font-serif text-xl text-foreground">
              Ends With P
            </h1>
          </Link>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 flex items-center justify-center p-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-sm"
        >
          <div className="border border-border bg-card p-8">
            <div className="mb-8">
              <h2 className="font-serif text-2xl text-foreground mb-2">
                Admin Access
              </h2>
              <p className="text-sm text-muted-foreground">
                Sign in to manage your catalogue
              </p>
            </div>

            <form onSubmit={handleLogin} className="space-y-6">
              <div className="space-y-2">
                <label 
                  htmlFor="email" 
                  className="text-xs tracking-widest uppercase text-muted-foreground"
                >
                  Email
                </label>
                <Input
                  id="email"
                  type="email"
                  placeholder="admin@endswithp.com"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="border-border bg-background focus:ring-gold"
                />
              </div>

              <div className="space-y-2">
                <label 
                  htmlFor="password"
                  className="text-xs tracking-widest uppercase text-muted-foreground"
                >
                  Password
                </label>
                <Input
                  id="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="border-border bg-background focus:ring-gold"
                />
              </div>

              {error && (
                <p className="text-sm text-destructive">
                  {error}
                </p>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 text-sm tracking-widest uppercase bg-foreground text-background hover:bg-gold disabled:opacity-50 transition-colors duration-300 flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <>
                    <Spinner className="w-4 h-4" />
                    Signing in...
                  </>
                ) : (
                  'Sign In'
                )}
              </button>
            </form>

            <div className="mt-8 pt-6 border-t border-border text-center">
              <Link 
                href="/" 
                className="text-sm text-muted-foreground hover:text-foreground transition-colors duration-300"
              >
                Back to catalogue
              </Link>
            </div>
          </div>
        </motion.div>
      </main>
    </div>
  )
}
