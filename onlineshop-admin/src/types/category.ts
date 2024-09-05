export type Category = {
  id: number
  name: string
  slug: string
}

export interface CategoryParams {
  pageNum: number | 1
  pageSize?: 7
  search: string | null
  sort: string
}

export type CategoryRequest = {
  name: string
  slug: string
}
