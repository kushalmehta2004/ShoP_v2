'use client'

import { useScroll, useTransform, motion, MotionValue } from 'motion/react'
import React, { useRef } from 'react'
import { ArrowDown } from 'lucide-react'
import { ImageCarousel } from './image-carousel'
import { ContainerScroll } from './container-scroll-animation'
import WaveBackground from './wave-background'

const featuredImages = [
  {
    src: "https://images.unsplash.com/photo-1523170335258-f5ed11844a49?w=800&auto=format&fit=crop",
    alt: "Luxury timepiece",
    title: "Vintage Timepieces",
    subtitle: "Rare and collectible watches from prestigious Swiss manufacturers. Each piece tells a story of exceptional craftsmanship.",
  },
  {
    src: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=800&auto=format&fit=crop",
    alt: "Designer handbag",
    title: "Leather Goods",
    subtitle: "Exquisite handbags and accessories from the world's most coveted fashion houses. Timeless elegance meets modern luxury.",
  },
  {
    src: "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=800&auto=format&fit=crop",
    alt: "Luxury luggage",
    title: "Travel Essentials",
    subtitle: "Distinguished luggage and travel accessories for the discerning globetrotter. Journey in style.",
  },
  {
    src: "https://images.unsplash.com/photo-1585336261022-680e295ce3fe?w=800&auto=format&fit=crop",
    alt: "Fine writing instrument",
    title: "Writing Instruments",
    subtitle: "Masterfully crafted pens from legendary maisons. The art of writing, elevated to perfection.",
  },
  {
    src: "https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=800&auto=format&fit=crop",
    alt: "Crystal glassware",
    title: "Home & Art",
    subtitle: "Exceptional crystal, porcelain, and decorative arts. Transform your space into a sanctuary of refinement.",
  },
]

interface SectionProps {
  scrollYProgress: MotionValue<number>
}

const HeroSection: React.FC<SectionProps> = ({ scrollYProgress }) => {
  const scale = useTransform(scrollYProgress, [0, 1], [1, 0.8])
  const rotate = useTransform(scrollYProgress, [0, 1], [0, -5])
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0])

  return (
    <motion.section
      style={{ scale, rotate }}
      className="sticky top-0 h-screen bg-background flex flex-col items-center justify-center"
    >
      {/* Subtle grid pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1a1a1a08_1px,transparent_1px),linear-gradient(to_bottom,#1a1a1a08_1px,transparent_1px)] bg-[size:64px_64px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />

      <div className="relative z-10 text-center px-6 max-w-5xl mx-auto">
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-xs tracking-[0.4em] uppercase text-muted-foreground mb-6"
        >
          Curated Luxury Imports
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="font-serif text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-medium tracking-tight leading-[1.05] text-foreground mb-8 text-balance"
        >
          Premium Goods From
          <br />
          <span className="text-gold">Around The World</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="text-base sm:text-lg text-muted-foreground leading-relaxed max-w-xl mx-auto mb-12"
        >
          A carefully curated selection of exceptional items.
          <br className="hidden sm:block" />
          Each piece is sourced directly and authenticated for discerning collectors.
        </motion.p>

        <motion.div
          style={{ opacity }}
          className="flex flex-col items-center gap-2"
        >
          <span className="text-xs tracking-widest uppercase text-muted-foreground">
            Scroll to explore
          </span>
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
          >
            <ArrowDown className="w-5 h-5 text-gold" />
          </motion.div>
        </motion.div>
      </div>
    </motion.section>
  )
}

export function HeroScrollAnimation() {
  const containerRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end start'],
  })

  return (
    <section ref={containerRef} className="relative">
      <HeroSection scrollYProgress={scrollYProgress} />

      <div className="-mt-16 md:-mt-24">
        <ContainerScroll
          titleComponent={
            <div className="px-6">
              <p className="mb-4 text-xs uppercase tracking-[0.4em] text-muted-foreground">
                Featured Collection
              </p>
              <h2 className="font-serif text-3xl font-medium leading-[1.1] text-foreground sm:text-4xl lg:text-6xl">
                Timeless Pieces,
                <br />
                <span className="text-gold">Extraordinary Craftsmanship</span>
              </h2>
            </div>
          }
        >
          <div className="relative flex h-full w-full items-center overflow-hidden rounded-2xl bg-foreground p-4 text-background md:p-10">
            <div className="absolute inset-0 opacity-60">
              <WaveBackground darkTheme />
            </div>
            <div className="relative z-10 mx-auto w-full max-w-6xl">
              <ImageCarousel images={featuredImages} autoplay={true} autoplayInterval={5000} />
            </div>
          </div>
        </ContainerScroll>
      </div>
    </section>
  )
}

export default HeroScrollAnimation
