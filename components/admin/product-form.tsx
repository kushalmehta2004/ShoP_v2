'use client'

import { useState, useRef } from 'react'
import { motion } from 'framer-motion'
import { X, Plus, Trash2, Upload, Image as ImageIcon, Link as LinkIcon } from 'lucide-react'
import Image from 'next/image'
import { Input } from '@/components/ui/input'
import { Spinner } from '@/components/ui/spinner'
import { createClient } from '@/lib/supabase/client'
import type { Product, ProductInsert } from '@/lib/types'

const CATEGORIES = ['Watches', 'Leather', 'Accessories', 'Home', 'Art']

interface ProductFormProps {
  product?: Product | null
  onClose: () => void
  onSuccess: () => void
}

export function ProductForm({ product, onClose, onSuccess }: ProductFormProps) {
  const isEditing = !!product
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [formData, setFormData] = useState({
    name: product?.name || '',
    category: product?.category || CATEGORIES[0],
    description: product?.description || '',
    price: product?.price?.toString() || '',
    origin_country: product?.origin_country || '',
    stock: product?.stock?.toString() || '0',
    is_featured: product?.is_featured || false,
    is_visible: product?.is_visible ?? true,
  })

  const [variants, setVariants] = useState<string[]>(product?.variants || [])
  const [newVariant, setNewVariant] = useState('')
  const [images, setImages] = useState<string[]>(product?.images || [])
  const [newImageUrl, setNewImageUrl] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [imageAddMode, setImageAddMode] = useState<'upload' | 'url'>('upload')

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target
    const checked = (e.target as HTMLInputElement).checked

    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }))
  }

  const addVariant = () => {
    if (newVariant.trim() && !variants.includes(newVariant.trim())) {
      setVariants((prev) => [...prev, newVariant.trim()])
      setNewVariant('')
    }
  }

  const removeVariant = (index: number) => {
    setVariants((prev) => prev.filter((_, i) => i !== index))
  }

  const convertGoogleDriveLink = (url: string): string => {
    // Extract file ID from various Google Drive URL formats
    let fileId: string | null = null
    
    // Format: https://drive.google.com/file/d/FILE_ID/view
    const fileMatch = url.match(/\/file\/d\/([a-zA-Z0-9_-]+)/)
    if (fileMatch) {
      fileId = fileMatch[1]
    }
    
    // Format: https://drive.google.com/open?id=FILE_ID
    const openMatch = url.match(/[?&]id=([a-zA-Z0-9_-]+)/)
    if (!fileId && openMatch) {
      fileId = openMatch[1]
    }
    
    // Format: https://drive.google.com/uc?id=FILE_ID
    const ucMatch = url.match(/\/uc\?.*id=([a-zA-Z0-9_-]+)/)
    if (!fileId && ucMatch) {
      fileId = ucMatch[1]
    }

    if (fileId) {
      // Use lh3.googleusercontent.com which is more reliable for embedding
      return `https://lh3.googleusercontent.com/d/${fileId}`
    }
    
    return url
  }

  const addImageUrl = () => {
    if (newImageUrl.trim() && !images.includes(newImageUrl.trim())) {
      let imageUrl = newImageUrl.trim()
      
      // Check if it's a Google Drive link and convert it
      if (imageUrl.includes('drive.google.com')) {
        imageUrl = convertGoogleDriveLink(imageUrl)
      }

      setImages((prev) => [...prev, imageUrl])
      setNewImageUrl('')
    }
  }

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return

    setIsUploading(true)
    setError(null)

    try {
      for (const file of Array.from(files)) {
        const formData = new FormData()
        formData.append('file', file)

        const response = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        })

        const result = await response.json()

        if (!response.ok) {
          throw new Error(result.error || 'Upload failed')
        }

        setImages((prev) => [...prev, result.url])
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to upload image')
    } finally {
      setIsUploading(false)
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    }
  }

  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      const supabase = createClient()

      const productData: ProductInsert = {
        name: formData.name,
        category: formData.category,
        description: formData.description || null,
        price: parseFloat(formData.price),
        origin_country: formData.origin_country || null,
        stock: parseInt(formData.stock, 10),
        variants,
        images,
        is_featured: formData.is_featured,
        is_visible: formData.is_visible,
      }

      if (isEditing && product) {
        const { error } = await supabase
          .from('products')
          .update(productData)
          .eq('id', product.id)

        if (error) throw error
      } else {
        const { error } = await supabase
          .from('products')
          .insert(productData)

        if (error) throw error
      }

      onSuccess()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setIsLoading(false)
    }
  }

  return (
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
        initial={{ opacity: 0, x: '100%' }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: '100%' }}
        transition={{ type: 'spring', damping: 30, stiffness: 300 }}
        className="fixed inset-y-0 right-0 w-full max-w-lg z-50 bg-background border-l border-border overflow-y-auto"
      >
        {/* Header */}
        <div className="sticky top-0 bg-background border-b border-border p-6 flex items-center justify-between">
          <h2 className="font-serif text-xl text-foreground">
            {isEditing ? 'Edit Product' : 'Add Product'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-muted transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Name */}
          <div className="space-y-2">
            <label className="text-xs tracking-widest uppercase text-muted-foreground">
              Product Name *
            </label>
            <Input
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              placeholder="e.g., Vintage Rolex Submariner"
              className="border-border"
            />
          </div>

          {/* Category */}
          <div className="space-y-2">
            <label className="text-xs tracking-widest uppercase text-muted-foreground">
              Category *
            </label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 bg-background border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-gold"
            >
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <label className="text-xs tracking-widest uppercase text-muted-foreground">
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={4}
              placeholder="Describe the product..."
              className="w-full px-3 py-2 bg-background border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-gold resize-none"
            />
          </div>

          {/* Price and Stock */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-xs tracking-widest uppercase text-muted-foreground">
                Price (INR) *
              </label>
              <Input
                name="price"
                type="number"
                min="0"
                step="0.01"
                value={formData.price}
                onChange={handleChange}
                required
                placeholder="0"
                className="border-border"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs tracking-widest uppercase text-muted-foreground">
                Stock *
              </label>
              <Input
                name="stock"
                type="number"
                min="0"
                value={formData.stock}
                onChange={handleChange}
                required
                placeholder="0"
                className="border-border"
              />
            </div>
          </div>

          {/* Origin Country */}
          <div className="space-y-2">
            <label className="text-xs tracking-widest uppercase text-muted-foreground">
              Origin Country
            </label>
            <Input
              name="origin_country"
              value={formData.origin_country}
              onChange={handleChange}
              placeholder="e.g., Switzerland"
              className="border-border"
            />
          </div>

          {/* Variants */}
          <div className="space-y-2">
            <label className="text-xs tracking-widest uppercase text-muted-foreground">
              Variants
            </label>
            <div className="flex gap-2">
              <Input
                value={newVariant}
                onChange={(e) => setNewVariant(e.target.value)}
                placeholder="e.g., Black, 40mm"
                className="border-border"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault()
                    addVariant()
                  }
                }}
              />
              <button
                type="button"
                onClick={addVariant}
                className="px-3 py-2 border border-border hover:bg-muted transition-colors"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
            {variants.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {variants.map((variant, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-1 px-3 py-1 border border-border text-sm"
                  >
                    {variant}
                    <button
                      type="button"
                      onClick={() => removeVariant(index)}
                      className="ml-1 text-muted-foreground hover:text-foreground"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Images */}
          <div className="space-y-3">
            <label className="text-xs tracking-widest uppercase text-muted-foreground">
              Product Images
            </label>

            {/* Toggle buttons for upload mode */}
            <div className="flex border border-border">
              <button
                type="button"
                onClick={() => setImageAddMode('upload')}
                className={`flex-1 py-2 px-4 text-sm flex items-center justify-center gap-2 transition-colors ${
                  imageAddMode === 'upload'
                    ? 'bg-foreground text-background'
                    : 'hover:bg-muted'
                }`}
              >
                <Upload className="w-4 h-4" />
                Upload
              </button>
              <button
                type="button"
                onClick={() => setImageAddMode('url')}
                className={`flex-1 py-2 px-4 text-sm flex items-center justify-center gap-2 transition-colors ${
                  imageAddMode === 'url'
                    ? 'bg-foreground text-background'
                    : 'hover:bg-muted'
                }`}
              >
                <LinkIcon className="w-4 h-4" />
                URL
              </button>
            </div>

            {/* Upload mode */}
            {imageAddMode === 'upload' && (
              <div className="space-y-2">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/webp,image/gif"
                  multiple
                  onChange={handleFileUpload}
                  className="hidden"
                  id="image-upload"
                />
                <label
                  htmlFor="image-upload"
                  className={`flex flex-col items-center justify-center gap-2 py-8 border-2 border-dashed border-border cursor-pointer hover:border-gold hover:bg-muted/50 transition-colors ${
                    isUploading ? 'opacity-50 pointer-events-none' : ''
                  }`}
                >
                  {isUploading ? (
                    <>
                      <Spinner className="w-6 h-6" />
                      <span className="text-sm text-muted-foreground">Uploading...</span>
                    </>
                  ) : (
                    <>
                      <ImageIcon className="w-8 h-8 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">
                        Click to upload or drag and drop
                      </span>
                      <span className="text-xs text-muted-foreground">
                        JPEG, PNG, WebP, GIF up to 10MB
                      </span>
                    </>
                  )}
                </label>
              </div>
            )}

            {/* URL mode */}
            {imageAddMode === 'url' && (
              <div className="space-y-2">
                <div className="flex gap-2">
                  <Input
                    value={newImageUrl}
                    onChange={(e) => setNewImageUrl(e.target.value)}
                    placeholder="https://... or Google Drive link"
                    className="border-border"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault()
                        addImageUrl()
                      }
                    }}
                  />
                  <button
                    type="button"
                    onClick={addImageUrl}
                    className="px-3 py-2 border border-border hover:bg-muted transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
                <p className="text-xs text-muted-foreground">
                  Google Drive: File must be shared as &quot;Anyone with the link can view&quot;
                </p>
              </div>
            )}

            {/* Image previews */}
            {images.length > 0 && (
              <div className="grid grid-cols-3 gap-2 mt-3">
                {images.map((image, index) => (
                  <div
                    key={index}
                    className="relative aspect-square border border-border group"
                  >
                    <Image
                      src={image}
                      alt={`Product image ${index + 1}`}
                      fill
                      className="object-cover"
                      unoptimized
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute top-1 right-1 p-1 bg-background/80 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-destructive hover:text-destructive-foreground"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                    {index === 0 && (
                      <span className="absolute bottom-1 left-1 px-1.5 py-0.5 bg-gold text-foreground text-[10px] uppercase tracking-wider">
                        Main
                      </span>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Toggles */}
          <div className="space-y-4 pt-4 border-t border-border">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                name="is_visible"
                checked={formData.is_visible}
                onChange={handleChange}
                className="w-4 h-4 border-border accent-gold"
              />
              <span className="text-sm text-foreground">
                Visible on public catalogue
              </span>
            </label>
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                name="is_featured"
                checked={formData.is_featured}
                onChange={handleChange}
                className="w-4 h-4 border-border accent-gold"
              />
              <span className="text-sm text-foreground">
                Featured product
              </span>
            </label>
          </div>

          {/* Error */}
          {error && (
            <p className="text-sm text-destructive">{error}</p>
          )}

          {/* Submit */}
          <div className="pt-4">
            <button
              type="submit"
              disabled={isLoading || isUploading}
              className="w-full py-3 text-sm tracking-widest uppercase bg-foreground text-background hover:bg-gold disabled:opacity-50 transition-colors duration-300 flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <Spinner className="w-4 h-4" />
                  {isEditing ? 'Updating...' : 'Creating...'}
                </>
              ) : (
                isEditing ? 'Update Product' : 'Create Product'
              )}
            </button>
          </div>
        </form>
      </motion.div>
    </>
  )
}
