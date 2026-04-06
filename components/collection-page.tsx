'use client'

import { useState, useEffect, useCallback } from 'react'
import useSWR from 'swr'
import Link from 'next/link'
import { motion } from 'motion/react'
import { ArrowLeft } from 'lucide-react'
import { ProductGrid } from './product-grid'
import { ProductModal } from './product-modal'
import { Footer } from './footer'
import { createClient } from '@/lib/supabase/client'
import type { Product } from '@/lib/types'

const categories = [
  'All',
  'Watches',
  'Leather',
  'Accessories',
  'Home',
  'Art',
]

const fetcher = async (key: string): Promise<Product[]> => {
  const supabase = createClient()
  const category = key.split(':')[1] || 'All'
  
  let query = supabase
    .from('products')
    .select('*')
    .eq('is_visible', true)
    .order('is_featured', { ascending: false })
    .order('created_at', { ascending: false })
  
  if (category !== 'All') {
    query = query.eq('category', category)
  }
  
  const { data, error } = await query
  
  if (error) {
    console.error('Error fetching products:', error)
    throw error
  }
  
  return data || []
}

export function CollectionPage() {
  const [activeCategory, setActiveCategory] = useState('All')
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  
  const { data: products, isLoading, mutate } = useSWR(
    `products:${activeCategory}`,
    fetcher,
    {
      revalidateOnFocus: false,
      dedupingInterval: 5000,
    }
  )

  // Set up real-time subscription
  useEffect(() => {
    const supabase = createClient()
    
    const channel = supabase
      .channel('products-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'products',
        },
        () => {
          mutate()
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [mutate])

  const handleProductClick = useCallback((product: Product) => {
    setSelectedProduct(product)
  }, [])

  const handleCloseModal = useCallback(() => {
    setSelectedProduct(null)
  }, [])

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-20">
            {/* Back link */}
            <Link 
              href="/" 
              className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="text-xs tracking-widest uppercase">Back</span>
            </Link>

            {/* Logo */}
            <Link href="/" className="absolute left-1/2 -translate-x-1/2">
              <img src="/logo.jpg" alt="ShoP" className="h-8 w-auto sm:h-10" />
            </Link>

            {/* Spacer for alignment */}
            <div className="w-16" />
          </div>
        </div>
      </header>

      <main className="pt-20 sm:pt-24">
        {/* Hero section */}
        <section className="py-16 sm:py-20 lg:py-24 border-b border-border">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <p className="text-xs tracking-[0.4em] uppercase text-muted-foreground mb-3">
                Our Collection
              </p>
              <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl text-foreground mb-6 text-balance">
                Browse the Catalogue
              </h1>
              <p className="text-muted-foreground text-lg max-w-2xl leading-relaxed">
                A curated selection of exceptional pieces, sourced from the world&apos;s 
                most prestigious houses. Each item tells a story of craftsmanship and heritage.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Category filters */}
        <section className="sticky top-16 sm:top-20 z-40 bg-background border-b border-border">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-2 py-4 overflow-x-auto scrollbar-hide">
              {categories.map((category) => (
                <motion.button
                  key={category}
                  onClick={() => setActiveCategory(category)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`flex-shrink-0 px-5 py-2.5 text-xs tracking-widest uppercase transition-all duration-300 border ${
                    activeCategory === category
                      ? 'bg-foreground text-background border-foreground'
                      : 'bg-transparent text-muted-foreground border-border hover:border-foreground hover:text-foreground'
                  }`}
                >
                  {category}
                </motion.button>
              ))}
            </div>
          </div>
        </section>

        {/* Products grid */}
        <section className="py-12 sm:py-16 lg:py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <ProductGrid
              products={products || []}
              onProductClick={handleProductClick}
              isLoading={isLoading}
            />
            
            {!isLoading && products?.length === 0 && (
              <div className="text-center py-20">
                <p className="text-muted-foreground text-lg">
                  No products found in this category.
                </p>
              </div>
            )}
          </div>
        </section>
      </main>

      <Footer />

      <ProductModal
        product={selectedProduct}
        isOpen={!!selectedProduct}
        onClose={handleCloseModal}
      />
    </div>
  )
}
