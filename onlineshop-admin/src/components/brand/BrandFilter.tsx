import { useAppDispatch } from '~/store'
import { Search, Sort } from '../common'
import { useSearchParams } from 'react-router-dom'
import { DEFAULT_SORT, sortOptions } from '~/utils/data'
import { PageParams } from '~/types/page'
import { getBrandsByPage } from '~/store/features/brandSlice'
import { useEffect } from 'react'

const BrandFilter = () => {
  const dispatch = useAppDispatch()
  const [searchParams, setSearchParams] = useSearchParams()

  const { pageNum, search, sort }: PageParams = {
    pageNum: Number(searchParams.get('pageNum')) || 1,
    search: searchParams.get('search'),
    sort: searchParams.get('sort') || DEFAULT_SORT
  }

  useEffect(() => {
    dispatch(getBrandsByPage({ pageNum, search, sort }))
  }, [dispatch, searchParams, pageNum, search, sort])

  const onSearching = (searchTerm: string) => {
    const updateParams: { [key: string]: string } = {
      pageNum: String(pageNum),
      search: searchTerm,
      sort: sort
    }
    setSearchParams(updateParams)
  }

  const onSortChange = (newSort: string) => {
    const newParams: { [key: string]: string } = { pageNum: String(pageNum), sort: newSort }
    if (search) {
      newParams.search = search
    }
    setSearchParams(newParams)
  }

  const onClear = () => {
    setSearchParams({ pageNum: '1', sort: DEFAULT_SORT })
  }
  return (
    <div className='flex flex-col md:flex-row gap-3 md:gap-0 justify-between items-center mb-5'>
      <Search curSearch={search} onSearching={onSearching} onClear={onClear} />
      <Sort selectOpt={sort} options={sortOptions} onSortChange={onSortChange} />
    </div>
  )
}
export default BrandFilter
