'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import { X, ChevronLeft, ChevronRight } from 'lucide-react'
import type { Product } from '@/lib/types'

interface ProductModalProps {
  product: Product | null
  isOpen: boolean
  onClose: () => void
}

export function ProductModal({ product, isOpen, onClose }: ProductModalProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  if (!product) return null

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(price)
  }

  const hasImages = product.images && product.images.length > 0
  const hasMultipleImages = product.images && product.images.length > 1

  const nextImage = () => {
    if (product.images) {
      setCurrentImageIndex((prev) => 
        prev === product.images!.length - 1 ? 0 : prev + 1
      )
    }
  }

  const prevImage = () => {
    if (product.images) {
      setCurrentImageIndex((prev) => 
        prev === 0 ? product.images!.length - 1 : prev - 1
      )
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-foreground/20 backdrop-blur-sm z-50"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.98 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-4 sm:inset-8 md:inset-12 lg:inset-20 z-50 bg-background border border-border overflow-hidden flex flex-col lg:flex-row"
          >
            {/* Close button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 z-10 p-2 hover:bg-muted transition-colors duration-200"
              aria-label="Close modal"
            >
              <X className="w-5 h-5 text-foreground" />
            </button>

            {/* Image section */}
            <div className="relative flex-1 lg:flex-[1.2] bg-secondary flex items-center justify-center min-h-[40vh] lg:min-h-0">
              {hasImages ? (
                <>
                  <Image
                    src={product.images![currentImageIndex]}
                    alt={product.name}
                    fill
                    className="object-contain p-8"
                    sizes="(max-width: 1024px) 100vw, 60vw"
                  />
                  
                  {hasMultipleImages && (
                    <>
                      <button
                        onClick={prevImage}
                        className="absolute left-4 top-1/2 -translate-y-1/2 p-2 bg-background/80 hover:bg-background transition-colors duration-200"
                        aria-label="Previous image"
                      >
                        <ChevronLeft className="w-5 h-5" />
                      </button>
                      <button
                        onClick={nextImage}
                        className="absolute right-4 top-1/2 -translate-y-1/2 p-2 bg-background/80 hover:bg-background transition-colors duration-200"
                        aria-label="Next image"
                      >
                        <ChevronRight className="w-5 h-5" />
                      </button>
                      
                      {/* Image indicators */}
                      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                        {product.images!.map((_, index) => (
                          <button
                            key={index}
                            onClick={() => setCurrentImageIndex(index)}
                            className={`w-2 h-2 rounded-full transition-colors duration-200 ${
                              index === currentImageIndex ? 'bg-foreground' : 'bg-foreground/30'
                            }`}
                            aria-label={`View image ${index + 1}`}
                          />
                        ))}
                      </div>
                    </>
                  )}
                </>
              ) : (
                <span className="font-serif text-8xl text-muted-foreground/20">
                  {product.name.charAt(0)}
                </span>
              )}

              {/* Featured badge */}
              {product.is_featured && (
                <div className="absolute top-4 left-4">
                  <span className="px-3 py-1 text-xs tracking-widest uppercase bg-gold text-background">
                    Featured
                  </span>
                </div>
              )}
            </div>

            {/* Info section */}
            <div className="flex-1 lg:flex-[0.8] p-6 sm:p-8 lg:p-12 overflow-y-auto">
              <div className="h-full flex flex-col">
                <div className="flex-1">
                  <p className="text-xs tracking-[0.3em] uppercase text-muted-foreground mb-3">
                    {product.category}
                    {product.origin_country && ` / ${product.origin_country}`}
                  </p>
                  
                  <h2 className="font-serif text-3xl sm:text-4xl text-foreground mb-6 text-balance">
                    {product.name}
                  </h2>
                  
                  <p className="text-2xl text-foreground mb-8">
                    {formatPrice(product.price)}
                  </p>
                  
                  {product.description && (
                    <div className="mb-8">
                      <h3 className="text-xs tracking-widest uppercase text-muted-foreground mb-3">
                        Description
                      </h3>
                      <p className="text-sm text-foreground leading-relaxed">
                        {product.description}
                      </p>
                    </div>
                  )}

                  {product.variants && product.variants.length > 0 && (
                    <div className="mb-8">
                      <h3 className="text-xs tracking-widest uppercase text-muted-foreground mb-3">
                        Available Variants
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {product.variants.map((variant, index) => (
                          <span
                            key={index}
                            className="px-3 py-1 text-sm border border-border text-foreground"
                          >
                            {variant}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="mb-8">
                    <h3 className="text-xs tracking-widest uppercase text-muted-foreground mb-3">
                      Availability
                    </h3>
                    <p className={`text-sm ${product.stock > 0 ? 'text-foreground' : 'text-gold'}`}>
                      {product.stock > 0 ? `${product.stock} in stock` : 'Available on inquiry'}
                    </p>
                  </div>
                </div>

                {/* CTA */}
                <div className="pt-6 border-t border-border">
                  <a
                    href={`mailto:hello@endswithp.com?subject=Inquiry: ${encodeURIComponent(product.name)}`}
                    className="block w-full py-4 text-center text-sm tracking-widest uppercase bg-foreground text-background hover:bg-gold transition-colors duration-300"
                  >
                    Inquire About This Item
                  </a>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
