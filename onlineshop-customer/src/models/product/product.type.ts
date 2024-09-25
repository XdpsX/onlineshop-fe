import { Brand } from '../brand/brand.type'
import { Category } from '../category/category.type'

export type Product = {
  id: number
  name: string
  slug: string
  price: number
  discountedPrice: number
  discountPercent: number
  inStock: boolean
  published: boolean
  mainImage: string
  category: Category
  brand: Brand
}
