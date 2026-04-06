'use client'

import { Header } from './header'
import { HeroScrollAnimation } from './ui/hero-scroll-animation'
import { Component as SectionBackground } from './ui/background-components'
import { Footer } from './footer'
import Link from 'next/link'
import { motion } from 'motion/react'
import { ArrowRight } from 'lucide-react'

export function Catalogue() {
  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      <Header />
      
      <main>
        {/* Hero scroll animation section */}
        <HeroScrollAnimation />
        
        {/* CTA Section - Browse Collection */}
        <SectionBackground className="py-14 sm:py-18 lg:py-24">
          <section>
            <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
              <motion.div
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                viewport={{ once: true, margin: '-100px' }}
              >
                <p className="mb-4 text-xs uppercase tracking-[0.4em] text-muted-foreground">
                  Discover More
                </p>
                <h2 className="mb-6 text-balance font-serif text-3xl text-foreground sm:text-4xl lg:text-5xl">
                  Want to see more products?
                </h2>
                <p className="mx-auto mb-10 max-w-2xl text-lg leading-relaxed text-muted-foreground sm:text-xl">
                  Explore our complete collection of luxury timepieces, leather goods, 
                  and curated accessories from the world&apos;s finest artisans.
                </p>
                
                <Link href="/collection">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="group inline-flex items-center gap-3 bg-foreground px-8 py-4 text-sm font-medium uppercase tracking-widest text-background transition-all duration-300 hover:bg-gold"
                  >
                    Browse the Catalogue
                    <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                  </motion.button>
                </Link>
              </motion.div>
            </div>
          </section>
        </SectionBackground>
      </main>

      <Footer />
    </div>
  )
}
