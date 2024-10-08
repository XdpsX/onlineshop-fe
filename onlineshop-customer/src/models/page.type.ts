export type Page<T> = {
  items: T[]
  pageNum: number
  pageSize: number
  totalItems: number
  totalPages: number
}
