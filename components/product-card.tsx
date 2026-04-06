'use client'

import * as React from 'react'
import { motion } from 'framer-motion'
import { ArrowRight, MapPin, Package, Sparkles } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { Product } from '@/lib/types'

interface ProductCardProps {
  product: Product
  index: number
  onClick: () => void
  className?: string
}

export function ProductCard({ product, index, onClick, className }: ProductCardProps) {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(price)
  }

  // Get up to 3 images for the stacked effect
  const images = product.images?.length > 0 
    ? product.images.slice(0, 3) 
    : ['https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400']

  // Determine stock label
  const getStockLabel = () => {
    if (product.stock === 0) return 'Inquire'
    if (product.stock === 1) return 'Last Piece'
    return `${product.stock} in stock`
  }

  // Build stats array
  const stats = [
    ...(product.origin_country ? [{
      icon: <MapPin className="h-4 w-4" />,
      label: product.origin_country
    }] : []),
    {
      icon: <Package className="h-4 w-4" />,
      label: getStockLabel()
    },
    ...(product.is_featured ? [{
      icon: <Sparkles className="h-4 w-4" />,
      label: 'Featured'
    }] : [])
  ]

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ 
        duration: 0.5, 
        delay: index * 0.08,
        ease: [0.22, 1, 0.36, 1] 
      }}
      onClick={onClick}
      className={cn(
        "group relative block w-full cursor-pointer rounded-2xl border border-border bg-card p-6 text-card-foreground shadow-sm transition-all duration-300 ease-in-out hover:-translate-y-1 hover:shadow-lg",
        className
      )}
      aria-label={`View details for ${product.name}`}
    >
      <div className="flex flex-col">
        {/* Card Header: Title, Category and Arrow */}
        <div className="mb-6 flex items-start justify-between gap-4">
          <div>
            <p className="text-xs tracking-widest uppercase text-muted-foreground mb-1">
              {product.category}
            </p>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
              {product.name}
            </h2>
          </div>
          <ArrowRight className="h-6 w-6 flex-shrink-0 text-muted-foreground transition-transform duration-300 ease-in-out group-hover:translate-x-1 group-hover:text-foreground" />
        </div>

        {/* Stacked Images with Hover Animation */}
        <div className="relative mb-6 h-32">
          {images.map((src, imgIndex) => (
            <div
              key={imgIndex}
              className={cn(
                "absolute h-full w-[40%] overflow-hidden rounded-lg border-2 border-background shadow-md transition-all duration-300 ease-in-out",
                "group-hover:translate-x-[var(--tx)] group-hover:rotate-[var(--r)]"
              )}
              style={{
                transform: `translateX(${imgIndex * 32}px)`,
                '--tx': `${imgIndex * 80}px`,
                '--r': `${imgIndex * 5 - 5}deg`,
                zIndex: images.length - imgIndex,
              } as React.CSSProperties}
            >
              <img
                src={src}
                alt={`${product.name} view ${imgIndex + 1}`}
                className="h-full w-full object-cover"
              />
            </div>
          ))}
        </div>

        {/* Stats Section */}
        <div className="mb-4 flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
          {stats.map((stat, statIndex) => (
            <div key={statIndex} className="flex items-center gap-1.5">
              {stat.icon}
              <span>{stat.label}</span>
            </div>
          ))}
        </div>

        {/* Description */}
        {product.description && (
          <p className="text-sm leading-relaxed text-muted-foreground line-clamp-2 mb-4">
            {product.description}
          </p>
        )}

        {/* Price */}
        <div className="mt-auto pt-4 border-t border-border">
          <span className="font-serif text-xl text-foreground">
            {formatPrice(product.price)}
          </span>
        </div>
      </div>
    </motion.article>
  )
}
