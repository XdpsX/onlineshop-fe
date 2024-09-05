import { useSearchParams } from 'react-router-dom'
import BrandList from './BrandList'
import { useAppSelector } from '~/store'
import { selectBrand } from '~/store/features/brandSlice'
import { Pagination } from '../common'

const BrandContainer = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const { brandPage } = useAppSelector(selectBrand)

  const onPageChange = (newPage: number) => {
    const search = searchParams.get('search')
    const sort = searchParams.get('sort')
    const newParams: { [key: string]: string } = { pageNum: String(newPage) }
    if (search) {
      newParams.search = search
    }
    if (sort) {
      newParams.sort = sort
    }
    setSearchParams(newParams)
  }

  return (
    <>
      <BrandList />
      {brandPage?.totalPages && brandPage.totalPages > 1 && (
        <Pagination pageNum={brandPage.pageNum} onPageChange={onPageChange} totalPages={brandPage.totalPages} />
      )}
    </>
  )
}
export default BrandContainer
