import { AddCategory, CategoryContainer, DeleteCategory } from '~/components/category'
import { useAppDispatch, useAppSelector } from '~/store'
import { getCategoriesByPage, selectCategory, setShowModal } from '~/store/features/categorySlice'
import { useEffect } from 'react'
import { toast } from 'react-toastify'
import { AddButton, BasicFilter } from '~/components/common'
import { useSearchParams } from 'react-router-dom'
import { DEFAULT_SORT } from '~/utils/data'
import { PageParams } from '~/types/page'

const Categories = () => {
  const dispatch = useAppDispatch()
  const { categoryPage, error } = useAppSelector(selectCategory)
  const [searchParams, setSearchParams] = useSearchParams()

  const { pageNum, search, sort }: PageParams = {
    pageNum: Number(searchParams.get('pageNum')) || 1,
    search: searchParams.get('search'),
    sort: searchParams.get('sort') || DEFAULT_SORT
  }

  useEffect(() => {
    dispatch(getCategoriesByPage({ pageNum, search, sort }))
  }, [dispatch, searchParams, pageNum, search, sort])

  useEffect(() => {
    toast.error(error?.message)
  }, [error])

  const onSearching = (searchTerm: string) => {
    const params: { [key: string]: string } = { pageNum: '1', search: searchTerm, sort: sort }
    setSearchParams(params)
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
    <>
      <div className='px-2 lg:px-7 pt-5'>
        <AddButton onClick={() => dispatch(setShowModal(true))} />
        <BasicFilter
          pageResult={categoryPage}
          curSearch={search}
          onSearching={onSearching}
          onClear={onClear}
          curSort={sort}
          onSortChange={onSortChange}
        />

        {categoryPage && <CategoryContainer />}
      </div>
      <AddCategory />
      <DeleteCategory />
    </>
  )
}
export default Categories
