import { Category } from './category'

export type Brand = {
  id: number
  name: string
  logo: string
  categories: Category[]
}
