import { Product } from '../product/product.type'

export type OrderItem = {
  id: number
  quantity: number
  product: Product
}
