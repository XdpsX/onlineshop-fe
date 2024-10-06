import { OrderItem } from './orderItem.type'

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
