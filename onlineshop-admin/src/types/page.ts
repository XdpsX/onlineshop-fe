export interface PageResponse<T> {
  items: T[]
  pageNum: number
  pageSize: number
  totalItems: number
  totalPages: number
}

export interface PageParams {
  pageNum: number | 1
  pageSize?: 7
  search: string | null
  sort: string
}
