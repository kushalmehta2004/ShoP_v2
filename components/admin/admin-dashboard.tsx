'use client'

import { useState, useEffect, useCallback } from 'react'
import useSWR from 'swr'
import { motion } from 'framer-motion'
import { Plus, Search } from 'lucide-react'
import { AdminHeader } from './admin-header'
import { ProductTable } from './product-table'
import { ProductForm } from './product-form'
import { DeleteConfirmModal } from './delete-confirm-modal'
import { Input } from '@/components/ui/input'
import { createClient } from '@/lib/supabase/client'
import type { Product } from '@/lib/types'

interface AdminDashboardProps {
  userEmail?: string
}

const fetcher = async (): Promise<Product[]> => {
  const supabase = createClient()
  
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .order('created_at', { ascending: false })
  
  if (error) throw error
  return data || []
}

export function AdminDashboard({ userEmail }: AdminDashboardProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [deletingProduct, setDeletingProduct] = useState<Product | null>(null)

  const { data: products, isLoading, mutate } = useSWR('admin-products', fetcher, {
    revalidateOnFocus: false,
  })

  // Real-time subscription
  useEffect(() => {
    const supabase = createClient()
    
    const channel = supabase
      .channel('admin-products-changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'products' },
        () => mutate()
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [mutate])

  const filteredProducts = products?.filter((product) => {
    const query = searchQuery.toLowerCase()
    return (
      product.name.toLowerCase().includes(query) ||
      product.category.toLowerCase().includes(query) ||
      product.origin_country?.toLowerCase().includes(query)
    )
  })

  const handleToggleVisibility = useCallback(async (product: Product) => {
    const supabase = createClient()
    await supabase
      .from('products')
      .update({ is_visible: !product.is_visible })
      .eq('id', product.id)
    mutate()
  }, [mutate])

  const handleToggleFeatured = useCallback(async (product: Product) => {
    const supabase = createClient()
    await supabase
      .from('products')
      .update({ is_featured: !product.is_featured })
      .eq('id', product.id)
    mutate()
  }, [mutate])

  const handleDelete = useCallback(async () => {
    if (!deletingProduct) return
    
    const supabase = createClient()
    await supabase
      .from('products')
      .delete()
      .eq('id', deletingProduct.id)
    
    setDeletingProduct(null)
    mutate()
  }, [deletingProduct, mutate])

  const handleFormClose = useCallback(() => {
    setShowForm(false)
    setEditingProduct(null)
  }, [])

  const handleFormSuccess = useCallback(() => {
    handleFormClose()
    mutate()
  }, [handleFormClose, mutate])

  const handleEdit = useCallback((product: Product) => {
    setEditingProduct(product)
    setShowForm(true)
  }, [])

  const stats = {
    total: products?.length || 0,
    visible: products?.filter(p => p.is_visible).length || 0,
    featured: products?.filter(p => p.is_featured).length || 0,
    outOfStock: products?.filter(p => p.stock === 0).length || 0,
  }

  return (
    <div className="min-h-screen bg-background">
      <AdminHeader userEmail={userEmail} />

      <main className="py-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Page header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <h1 className="font-serif text-3xl text-foreground mb-2">
              Product Catalogue
            </h1>
            <p className="text-muted-foreground">
              Manage your luxury inventory
            </p>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8"
          >
            <div className="border border-border p-4">
              <p className="text-xs tracking-widest uppercase text-muted-foreground mb-1">
                Total Products
              </p>
              <p className="font-serif text-2xl text-foreground">{stats.total}</p>
            </div>
            <div className="border border-border p-4">
              <p className="text-xs tracking-widest uppercase text-muted-foreground mb-1">
                Visible
              </p>
              <p className="font-serif text-2xl text-foreground">{stats.visible}</p>
            </div>
            <div className="border border-border p-4">
              <p className="text-xs tracking-widest uppercase text-muted-foreground mb-1">
                Featured
              </p>
              <p className="font-serif text-2xl text-gold">{stats.featured}</p>
            </div>
            <div className="border border-border p-4">
              <p className="text-xs tracking-widest uppercase text-muted-foreground mb-1">
                Out of Stock
              </p>
              <p className="font-serif text-2xl text-muted-foreground">{stats.outOfStock}</p>
            </div>
          </motion.div>

          {/* Actions bar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 mb-6"
          >
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 border-border"
              />
            </div>
            <button
              onClick={() => setShowForm(true)}
              className="flex items-center justify-center gap-2 px-6 py-2 text-sm tracking-widest uppercase bg-foreground text-background hover:bg-gold transition-colors duration-300"
            >
              <Plus className="w-4 h-4" />
              Add Product
            </button>
          </motion.div>

          {/* Products table */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            {isLoading ? (
              <div className="border border-border p-12 text-center">
                <p className="text-muted-foreground">Loading products...</p>
              </div>
            ) : (
              <ProductTable
                products={filteredProducts || []}
                onEdit={handleEdit}
                onDelete={setDeletingProduct}
                onToggleVisibility={handleToggleVisibility}
                onToggleFeatured={handleToggleFeatured}
              />
            )}
          </motion.div>
        </div>
      </main>

      {/* Product form modal */}
      {showForm && (
        <ProductForm
          product={editingProduct}
          onClose={handleFormClose}
          onSuccess={handleFormSuccess}
        />
      )}

      {/* Delete confirmation modal */}
      {deletingProduct && (
        <DeleteConfirmModal
          productName={deletingProduct.name}
          onConfirm={handleDelete}
          onCancel={() => setDeletingProduct(null)}
        />
      )}
    </div>
  )
}
