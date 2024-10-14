import { Product } from './product'

export type Order = {
  id: number
  trackingNumber: string
  status: string
  total: number
  address: string
  mobileNumber: string
  paymentStatus: string
  createdAt: string
  deliveredAt: string
}

export type OrderDetails = {
  id: number
  trackingNumber: string
  status: string
  total: number
  address: string
  mobileNumber: string
  paymentStatus: string
  createdAt: string
  deliveredAt: string
  username: string
  items: OrderItem[]
}

export type OrderItem = {
  id: number
  quantity: number
  product: Product
}

export type OrderParams = {
  pageNum: number
  orderStatus: string
  paymentStatus: string
}
