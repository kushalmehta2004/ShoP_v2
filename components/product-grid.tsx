'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { ProductCard } from './product-card'
import type { Product } from '@/lib/types'

interface ProductGridProps {
  products: Product[]
  onProductClick: (product: Product) => void
  isLoading?: boolean
}

export function ProductGrid({ products, onProductClick, isLoading }: ProductGridProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="animate-pulse">
            <div className="h-[320px] sm:h-[360px] bg-muted rounded-2xl" />
          </div>
        ))}
      </div>
    )
  }

  if (products.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex flex-col items-center justify-center py-20 text-center"
      >
        <p className="font-serif text-2xl text-muted-foreground mb-2">
          No products found
        </p>
        <p className="text-sm text-muted-foreground">
          Check back soon for new arrivals
        </p>
      </motion.div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
      <AnimatePresence mode="popLayout">
        {products.map((product, index) => (
          <ProductCard
            key={product.id}
            product={product}
            index={index}
            onClick={() => onProductClick(product)}
          />
        ))}
      </AnimatePresence>
    </div>
  )
}
