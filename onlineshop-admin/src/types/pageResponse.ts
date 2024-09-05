export interface PageResponse<T> {
  items: T[] | null
  pageNum: number
  pageSize: number
  totalItems: number
  totalPages: number
}
