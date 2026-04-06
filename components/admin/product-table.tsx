'use client'

import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import { Pencil, Trash2, Eye, EyeOff, Star } from 'lucide-react'
import type { Product } from '@/lib/types'

interface ProductTableProps {
  products: Product[]
  onEdit: (product: Product) => void
  onDelete: (product: Product) => void
  onToggleVisibility: (product: Product) => void
  onToggleFeatured: (product: Product) => void
}

export function ProductTable({
  products,
  onEdit,
  onDelete,
  onToggleVisibility,
  onToggleFeatured,
}: ProductTableProps) {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(price)
  }

  if (products.length === 0) {
    return (
      <div className="border border-border p-12 text-center">
        <p className="font-serif text-xl text-muted-foreground mb-2">
          No products yet
        </p>
        <p className="text-sm text-muted-foreground">
          Add your first product to get started
        </p>
      </div>
    )
  }

  return (
    <div className="border border-border overflow-hidden">
      {/* Desktop table */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border bg-muted/50">
              <th className="text-left text-xs tracking-widest uppercase text-muted-foreground p-4">
                Product
              </th>
              <th className="text-left text-xs tracking-widest uppercase text-muted-foreground p-4">
                Category
              </th>
              <th className="text-left text-xs tracking-widest uppercase text-muted-foreground p-4">
                Price
              </th>
              <th className="text-left text-xs tracking-widest uppercase text-muted-foreground p-4">
                Stock
              </th>
              <th className="text-left text-xs tracking-widest uppercase text-muted-foreground p-4">
                Status
              </th>
              <th className="text-right text-xs tracking-widest uppercase text-muted-foreground p-4">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            <AnimatePresence mode="popLayout">
              {products.map((product) => (
                <motion.tr
                  key={product.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="border-b border-border last:border-b-0 hover:bg-muted/30 transition-colors"
                >
                  <td className="p-4">
                    <div className="flex items-center gap-4">
                      <div className="relative w-12 h-12 bg-muted flex-shrink-0">
                        {product.images && product.images[0] ? (
                          <Image
                            src={product.images[0]}
                            alt={product.name}
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <span className="font-serif text-lg text-muted-foreground/50">
                              {product.name.charAt(0)}
                            </span>
                          </div>
                        )}
                      </div>
                      <div>
                        <p className="font-medium text-foreground">
                          {product.name}
                        </p>
                        {product.origin_country && (
                          <p className="text-xs text-muted-foreground">
                            {product.origin_country}
                          </p>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <span className="text-sm text-foreground">
                      {product.category}
                    </span>
                  </td>
                  <td className="p-4">
                    <span className="text-sm text-foreground">
                      {formatPrice(product.price)}
                    </span>
                  </td>
                  <td className="p-4">
                    <span className={`text-sm ${product.stock > 0 ? 'text-foreground' : 'text-muted-foreground'}`}>
                      {product.stock > 0 ? product.stock : 'Out of stock'}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      {product.is_featured && (
                        <span className="px-2 py-0.5 text-xs bg-gold text-background">
                          Featured
                        </span>
                      )}
                      {!product.is_visible && (
                        <span className="px-2 py-0.5 text-xs border border-border text-muted-foreground">
                          Hidden
                        </span>
                      )}
                      {product.is_visible && !product.is_featured && (
                        <span className="px-2 py-0.5 text-xs border border-border text-muted-foreground">
                          Visible
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => onToggleFeatured(product)}
                        className={`p-2 transition-colors ${
                          product.is_featured
                            ? 'text-gold hover:text-foreground'
                            : 'text-muted-foreground hover:text-gold'
                        }`}
                        title={product.is_featured ? 'Remove from featured' : 'Add to featured'}
                      >
                        <Star className="w-4 h-4" fill={product.is_featured ? 'currentColor' : 'none'} />
                      </button>
                      <button
                        onClick={() => onToggleVisibility(product)}
                        className="p-2 text-muted-foreground hover:text-foreground transition-colors"
                        title={product.is_visible ? 'Hide product' : 'Show product'}
                      >
                        {product.is_visible ? (
                          <Eye className="w-4 h-4" />
                        ) : (
                          <EyeOff className="w-4 h-4" />
                        )}
                      </button>
                      <button
                        onClick={() => onEdit(product)}
                        className="p-2 text-muted-foreground hover:text-foreground transition-colors"
                        title="Edit product"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => onDelete(product)}
                        className="p-2 text-muted-foreground hover:text-destructive transition-colors"
                        title="Delete product"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </AnimatePresence>
          </tbody>
        </table>
      </div>

      {/* Mobile cards */}
      <div className="md:hidden divide-y divide-border">
        <AnimatePresence mode="popLayout">
          {products.map((product) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="p-4"
            >
              <div className="flex gap-4">
                <div className="relative w-16 h-16 bg-muted flex-shrink-0">
                  {product.images && product.images[0] ? (
                    <Image
                      src={product.images[0]}
                      alt={product.name}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <span className="font-serif text-xl text-muted-foreground/50">
                        {product.name.charAt(0)}
                      </span>
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="font-medium text-foreground truncate">
                        {product.name}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {product.category}
                      </p>
                    </div>
                    <div className="flex items-center gap-1">
                      {product.is_featured && (
                        <span className="px-2 py-0.5 text-xs bg-gold text-background">
                          Featured
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="mt-2 flex items-center justify-between">
                    <div>
                      <p className="text-sm text-foreground">
                        {formatPrice(product.price)}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Stock: {product.stock}
                      </p>
                    </div>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => onToggleFeatured(product)}
                        className={`p-2 transition-colors ${
                          product.is_featured
                            ? 'text-gold'
                            : 'text-muted-foreground'
                        }`}
                      >
                        <Star className="w-4 h-4" fill={product.is_featured ? 'currentColor' : 'none'} />
                      </button>
                      <button
                        onClick={() => onToggleVisibility(product)}
                        className="p-2 text-muted-foreground"
                      >
                        {product.is_visible ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                      </button>
                      <button
                        onClick={() => onEdit(product)}
                        className="p-2 text-muted-foreground"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => onDelete(product)}
                        className="p-2 text-muted-foreground"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  )
}
