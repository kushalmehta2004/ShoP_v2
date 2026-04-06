"use client"

import React, { useEffect, useRef, useState, useMemo, useCallback } from "react"
import { ArrowLeft, ArrowRight } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

interface CarouselImage {
  src: string
  alt: string
  title?: string
  subtitle?: string
}

interface ImageCarouselProps {
  images: CarouselImage[]
  autoplay?: boolean
  autoplayInterval?: number
}

// Pre-defined random-looking rotations for the "messy stack" effect
const stackRotations = [0, -5, 7, -3, 9, -6, 4]
const stackXOffsets = [0, -10, 15, -8, 12, -6, 10]
const stackYOffsets = [0, 6, 4, 10, 8, 12, 6]

export function ImageCarousel({
  images,
  autoplay = true,
  autoplayInterval = 4000,
}: ImageCarouselProps) {
  const [activeIndex, setActiveIndex] = useState(0)
  const [exitDirection, setExitDirection] = useState<"left" | "right">("left")
  const autoplayIntervalRef = useRef<NodeJS.Timeout | null>(null)

  const imagesLength = useMemo(() => images.length, [images])
  const activeImage = useMemo(() => images[activeIndex], [activeIndex, images])

  // Autoplay
  useEffect(() => {
    if (autoplay) {
      autoplayIntervalRef.current = setInterval(() => {
        setExitDirection("left")
        setActiveIndex((prev) => (prev + 1) % imagesLength)
      }, autoplayInterval)
    }
    return () => {
      if (autoplayIntervalRef.current) clearInterval(autoplayIntervalRef.current)
    }
  }, [autoplay, autoplayInterval, imagesLength])

  // Keyboard navigation
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") handlePrev()
      if (e.key === "ArrowRight") handleNext()
    }
    window.addEventListener("keydown", handleKey)
    return () => window.removeEventListener("keydown", handleKey)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeIndex, imagesLength])

  const handleNext = useCallback(() => {
    setExitDirection("left")
    setActiveIndex((prev) => (prev + 1) % imagesLength)
    if (autoplayIntervalRef.current) clearInterval(autoplayIntervalRef.current)
  }, [imagesLength])

  const handlePrev = useCallback(() => {
    setExitDirection("right")
    setActiveIndex((prev) => (prev - 1 + imagesLength) % imagesLength)
    if (autoplayIntervalRef.current) clearInterval(autoplayIntervalRef.current)
  }, [imagesLength])

  // Get the visual position in the stack (0 = top, 1 = second, etc.)
  const getStackPosition = useCallback((index: number): number => {
    return (activeIndex - index + imagesLength) % imagesLength
  }, [activeIndex, imagesLength])

  // Build stack - show top 4 images
  const visibleImages = useMemo(() => {
    return images
      .map((image, index) => ({
        image,
        index,
        stackPos: getStackPosition(index),
      }))
      .filter(item => item.stackPos < 4)
      .sort((a, b) => b.stackPos - a.stackPos) // Render from back to front
  }, [images, getStackPosition])

  return (
    <div className="w-full">
      <div className="grid grid-cols-1 items-center justify-items-center gap-8 lg:grid-cols-2 lg:gap-12">
        {/* Stacked Images */}
        <div className="relative flex w-full items-center justify-center">
          <div className="relative mx-auto aspect-square w-[85%] max-w-[420px] sm:w-[80%] lg:max-w-[460px]">
            <AnimatePresence mode="popLayout">
              {visibleImages.map(({ image, index, stackPos }) => {
                const isActive = stackPos === 0
                const rotation = stackRotations[stackPos % stackRotations.length]
                const xOffset = stackXOffsets[stackPos % stackXOffsets.length]
                const yOffset = stackYOffsets[stackPos % stackYOffsets.length]

                return (
                  <motion.div
                    key={`${image.src}-${index}`}
                    className="absolute inset-0"
                    initial={{ 
                      scale: 0.94,
                      y: 20,
                      rotate: rotation,
                      x: xOffset,
                      opacity: 0.7,
                    }}
                    animate={{
                      zIndex: 10 - stackPos,
                      rotate: rotation,
                      x: xOffset,
                      y: yOffset,
                      scale: 1 - stackPos * 0.025,
                      opacity: 1,
                    }}
                    exit={{
                      x: exitDirection === "left" ? -300 : 300,
                      y: 50,
                      rotate: exitDirection === "left" ? -20 : 20,
                      scale: 0.85,
                      opacity: 0,
                      zIndex: 20,
                      transition: {
                        duration: 0.5,
                        ease: [0.32, 0.72, 0, 1],
                      }
                    }}
                    transition={{
                      duration: 0.6,
                      ease: [0.32, 0.72, 0, 1],
                    }}
                    style={{
                      transformOrigin: "center center",
                    }}
                  >
                    <motion.div
                      className="w-full h-full rounded-2xl overflow-hidden"
                      animate={{
                        boxShadow: isActive
                          ? "0 25px 60px -12px rgba(0, 0, 0, 0.5)"
                          : `0 ${15 - stackPos * 3}px ${40 - stackPos * 8}px -8px rgba(0, 0, 0, ${0.35 - stackPos * 0.05})`,
                      }}
                      transition={{ duration: 0.4 }}
                    >
                      <motion.img
                        src={image.src}
                        alt={image.alt}
                        className="w-full h-full object-cover"
                        animate={{
                          filter: isActive ? "blur(0px) brightness(1)" : `blur(${stackPos * 1.2}px) brightness(${1 - stackPos * 0.08})`,
                        }}
                        transition={{ duration: 0.5 }}
                      />
                    </motion.div>
                  </motion.div>
                )
              })}
            </AnimatePresence>
          </div>
        </div>

        {/* Content */}
        <div className="flex w-full max-w-xl flex-col items-center justify-center text-center">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeIndex}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4, ease: [0.32, 0.72, 0, 1] }}
              className="w-full"
            >
              {activeImage.title && (
                <h3 className="mb-3 font-serif text-2xl font-medium text-background sm:text-3xl lg:text-4xl">
                  {activeImage.title}
                </h3>
              )}
              {activeImage.subtitle && (
                <p className="mx-auto max-w-md text-sm leading-relaxed text-background/60 sm:text-base">
                  {activeImage.subtitle}
                </p>
              )}
            </motion.div>
          </AnimatePresence>

          {/* Navigation */}
          <div className="mt-8 flex items-center justify-center gap-4">
            <button
              onClick={handlePrev}
              className="w-12 h-12 rounded-full bg-background/10 hover:bg-gold flex items-center justify-center transition-colors duration-300 border border-background/20"
              aria-label="Previous image"
            >
              <ArrowLeft className="w-5 h-5 text-background" />
            </button>
            <button
              onClick={handleNext}
              className="w-12 h-12 rounded-full bg-background/10 hover:bg-gold flex items-center justify-center transition-colors duration-300 border border-background/20"
              aria-label="Next image"
            >
              <ArrowRight className="w-5 h-5 text-background" />
            </button>

            {/* Dots indicator */}
            <div className="flex items-center gap-2 ml-4">
              {images.map((_, index) => (
                <button
                  key={index}
                  onClick={() => {
                    setExitDirection(index > activeIndex ? "left" : "right")
                    setActiveIndex(index)
                    if (autoplayIntervalRef.current) clearInterval(autoplayIntervalRef.current)
                  }}
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${
                    index === activeIndex
                      ? "bg-gold w-6"
                      : "bg-background/30 hover:bg-background/50"
                  }`}
                  aria-label={`Go to image ${index + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ImageCarousel
