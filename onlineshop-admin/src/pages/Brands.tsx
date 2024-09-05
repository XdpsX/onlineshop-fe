import { useAppDispatch, useAppSelector } from '~/store'
import { useSearchParams } from 'react-router-dom'
import { DEFAULT_SORT } from '~/utils/data'
import { PageParams } from '~/types/page'
import { getBrandsByPage, selectBrand } from '~/store/features/brandSlice'
import { useEffect } from 'react'
import { BrandContainer } from '~/components/brand'
import { BasicFilter } from '~/components/common'

const Brands = () => {
  const dispatch = useAppDispatch()
  const [searchParams, setSearchParams] = useSearchParams()
  const { brandPage } = useAppSelector(selectBrand)

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
    <div className='px-2 lg:px-7 pt-5'>
      <BasicFilter
        pageResult={brandPage}
        curSearch={search}
        onSearching={onSearching}
        onClear={onClear}
        curSort={sort}
        onSortChange={onSortChange}
      />
      <BrandContainer />
    </div>
  )
}
export default Brands
