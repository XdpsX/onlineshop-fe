import { useSearchParams } from 'react-router-dom'
import { useAppSelector } from '~/store'
import { selectCategory } from '~/store/features/categorySlice'
import CategoryList from './CategoryList'
import { Pagination } from '../common'

const CategoryContainer = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const { categoryPage } = useAppSelector(selectCategory)

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
    <div className='pb-12'>
      <CategoryList />
      {categoryPage?.totalPages && categoryPage.totalPages > 1 && (
        <Pagination pageNum={categoryPage.pageNum} onPageChange={onPageChange} totalPages={categoryPage.totalPages} />
      )}
    </div>
  )
}
export default CategoryContainer
