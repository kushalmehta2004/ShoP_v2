'use client'

import Link from 'next/link'
import { motion, useScroll, useTransform } from 'motion/react'
import { Menu, X } from 'lucide-react'
import { useState } from 'react'

const navLinks = [
  { name: 'Collection', href: '/collection' },
  { name: 'About', href: '#' },
  { name: 'Contact', href: '#' },
]

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const { scrollY } = useScroll()
  
  // Header background opacity based on scroll
  const headerBg = useTransform(scrollY, [0, 100], [0, 1])

  return (
    <motion.header
      className="fixed top-0 left-0 right-0 z-50 transition-colors duration-300"
    >
      {/* Background layer with scroll-based opacity */}
      <motion.div 
        style={{ opacity: headerBg }}
        className="absolute inset-0 bg-background/95 backdrop-blur-sm border-b border-border"
      />
      
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Main header row */}
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Logo */}
          <Link href="/" className="flex-shrink-0">
            <h1 className="font-serif text-xl sm:text-2xl tracking-wide text-foreground">
              Ends With P
            </h1>
          </Link>

          {/* Desktop navigation */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="text-xs tracking-[0.2em] uppercase text-muted-foreground hover:text-foreground transition-colors duration-300"
              >
                {link.name}
              </Link>
            ))}
          </nav>

          {/* Mobile menu button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 -mr-2"
            aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
          >
            {mobileMenuOpen ? (
              <X className="w-5 h-5 text-foreground" />
            ) : (
              <Menu className="w-5 h-5 text-foreground" />
            )}
          </button>
        </div>

        {/* Mobile navigation */}
        {mobileMenuOpen && (
          <motion.nav
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden py-4 border-t border-border bg-background"
          >
            <div className="flex flex-col gap-4">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-left text-sm tracking-widest uppercase text-muted-foreground hover:text-foreground transition-colors duration-300"
                >
                  {link.name}
                </Link>
              ))}
            </div>
          </motion.nav>
        )}
      </div>
    </motion.header>
  )
}
