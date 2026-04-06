'use client'

import { Header } from './header'
import { HeroScrollAnimation } from './ui/hero-scroll-animation'
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
        <section className="py-14 sm:py-18 lg:py-24 bg-background">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              viewport={{ once: true, margin: '-100px' }}
            >
              <p className="text-xs tracking-[0.4em] uppercase text-muted-foreground mb-4">
                Discover More
              </p>
              <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-foreground mb-6 text-balance">
                Want to see more products?
              </h2>
              <p className="text-muted-foreground text-lg sm:text-xl max-w-2xl mx-auto mb-10 leading-relaxed">
                Explore our complete collection of luxury timepieces, leather goods, 
                and curated accessories from the world&apos;s finest artisans.
              </p>
              
              <Link href="/collection">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="group inline-flex items-center gap-3 px-8 py-4 bg-foreground text-background font-medium text-sm tracking-widest uppercase transition-all duration-300 hover:bg-gold"
                >
                  Browse the Catalogue
                  <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
                </motion.button>
              </Link>
            </motion.div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
