'use client'

import { motion } from 'framer-motion'

export function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="relative bg-foreground text-background overflow-hidden">
      {/* Large brand text */}
      <div className="relative">
        <h2 className="text-[18vw] sm:text-[16vw] leading-[0.85] uppercase font-serif font-medium text-center bg-gradient-to-b from-background/20 to-background/5 bg-clip-text text-transparent select-none translate-y-8 sm:translate-y-12">
          ShoP
        </h2>
      </div>

      {/* Footer content */}
      <div className="relative z-10 bg-foreground">
        <div className="mx-auto max-w-7xl px-6 py-12 sm:py-16">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-8">
            {/* Brand */}
            <div>
              <h3 className="font-serif text-xl text-background mb-3">
                ShoP
              </h3>
              <p className="text-sm text-background/60 leading-relaxed">
                Luxury imports for the discerning collector. Premium goods sourced from around the world.
              </p>
            </div>
            
            {/* Quick Links */}
            <div>
              <p className="text-xs tracking-[0.3em] uppercase text-background/40 mb-4">
                Categories
              </p>
              <ul className="space-y-2">
                {['Watches', 'Leather', 'Accessories', 'Home', 'Art'].map((category) => (
                  <li key={category}>
                    <a 
                      href="#products" 
                      className="text-sm text-background/70 hover:text-gold transition-colors duration-300"
                    >
                      {category}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            
            {/* Contact */}
            <div>
              <p className="text-xs tracking-[0.3em] uppercase text-background/40 mb-4">
                Inquiries
              </p>
              <a 
                href="mailto:hello@endswithp.com" 
                className="text-sm text-background hover:text-gold transition-colors duration-300"
              >
                hello@endswithp.com
              </a>
              <p className="text-sm text-background/60 mt-4 leading-relaxed">
                For private viewings and authentication services, please reach out directly.
              </p>
            </div>
          </div>
          
          <div className="mt-12 pt-8 border-t border-background/10 flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-xs text-background/40">
              {currentYear} ShoP. All rights reserved.
            </p>
            <p className="text-xs text-background/40">
              Curated in India
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}
