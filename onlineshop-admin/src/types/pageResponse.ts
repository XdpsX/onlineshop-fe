export interface PageResponse<T> {
  items: T[]
  pageNum: number
  pageSize: number
  totalItems: number
  totalPages: number
}
