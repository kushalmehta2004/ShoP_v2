export interface Product {
  id: string
  name: string
  category: string
  description: string | null
  price: number
  origin_country: string | null
  stock: number
  variants: string[]
  images: string[]
  is_featured: boolean
  is_visible: boolean
  created_at: string
  updated_at: string
}

export type ProductCategory = 
  | 'Bags'
  | 'Accessories'
  | 'Footwear'
  | 'Watches'
  | 'Sunglasses'
  | 'Apparel'
  | 'Other'

export const CATEGORIES: ProductCategory[] = [
  'Bags',
  'Accessories',
  'Footwear',
  'Watches',
  'Sunglasses',
  'Apparel',
  'Other',
]

export type SortOption = 'newest' | 'price-low' | 'price-high'

export const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: 'newest', label: 'Newest' },
  { value: 'price-low', label: 'Price: Low to High' },
  { value: 'price-high', label: 'Price: High to Low' },
]
