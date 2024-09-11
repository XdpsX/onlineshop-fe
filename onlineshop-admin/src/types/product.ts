import { Brand } from './brand'
import { Category } from './category'

export type Product = {
  id: number
  name: string
  slug: string
  price: number
  discountPercent: number
  inStock: boolean
  published: boolean
  mainImage: string
  category: Category
  brand: Omit<Brand, 'categories'>
}

export type ProductCreate = {
  name: string
  slug: string
  price: number
  discountPercent?: number
  inStock?: boolean
  published?: boolean
  description?: string
  categoryId: number
  brandId: number
  images: File[]
}

export type ProductDetails = Product & {
  description: string
  images: ProductImage[]
}

export type ProductImage = {
  id: number
  url: string
}

export type ProductUpdate = ProductCreate & {
  removedImageIds?: number[]
}

export type ProductParams = {
  pageNum: number
  pageSize?: 7
  search: string | null
  sort: string
  minPrice: number | null
  maxPrice: number | null
  hasPublished: boolean | null
  hasDiscount: boolean | null
  inStock: boolean | null
  categoryId: number | null
  brandId: number | null
}
