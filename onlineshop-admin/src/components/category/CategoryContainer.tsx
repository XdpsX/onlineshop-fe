import { useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useAppDispatch } from '~/store'
import { getCategoriesByPage, updateParams } from '~/store/features/categorySlice'
import { Search, Sort } from '../common'
import CategoryList from './CategoryList'

import { DEFAULT_SORT, sortOptions } from '~/utils/data'

const CategoryContainer = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const pageNum = Number(searchParams.get('pageNum')) || 1
  const pageSize = 7
  const search = searchParams.get('search')
  const sort = searchParams.get('sort') || DEFAULT_SORT

  const dispatch = useAppDispatch()

  useEffect(() => {
    dispatch(getCategoriesByPage({ pageNum, pageSize, search, sort }))
  }, [dispatch, pageNum, pageSize, search, sort])

  // Cập nhật query param trên url
  useEffect(() => {
    const params: { [key: string]: string } = { pageNum: String(pageNum), sort }
    if (search) {
      params.search = search
    }
    setSearchParams(params)
    dispatch(updateParams(params))
  }, [pageNum, search, sort, setSearchParams, dispatch])

  const onSearching = (searchTerm: string) => {
    setSearchParams({ pageNum: '1', search: searchTerm, sort })
  }

  const onSortChange = (newSort: string) => {
    const params: { [key: string]: string } = { pageNum: '1', sort: newSort }
    if (search) {
      params.search = search
    }
    setSearchParams(params)
  }

  const onClear = () => {
    setSearchParams({ pageNum: '1', sort: DEFAULT_SORT })
  }

  return (
    <div className='w-full p-4 bg-violet-500 text-white rounded-md shadow-md'>
      <div className='flex flex-col md:flex-row gap-3 md:gap-0 justify-between items-center mb-5'>
        <Search curSearch={search} onSearching={onSearching} onClear={onClear} />
        <Sort selectOpt={sort} options={sortOptions} onSortChange={onSortChange} />
      </div>
      <CategoryList />
    </div>
  )
}
export default CategoryContainer
