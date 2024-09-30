import { Product } from './product.type'
import { ProductImage } from './productImage.type'

export type ProductDetails = Product & {
  description: string
  images: ProductImage[]
}
