import { useAppDispatch, useAppSelector } from '~/store'
import { useSearchParams } from 'react-router-dom'
import { DEFAULT_SORT } from '~/utils/data'
import { PageParams } from '~/types/page'
import { getBrandsByPage, selectBrand, setShowModal } from '~/store/features/brandSlice'
import { useEffect } from 'react'
import { AddBrand, BrandContainer, DeleteBrand, EditBrand } from '~/components/brand'
import { AddButton, BasicFilter } from '~/components/common'
import { toast } from 'react-toastify'

const Brands = () => {
  const dispatch = useAppDispatch()
  const [searchParams, setSearchParams] = useSearchParams()
  const { brandPage, error } = useAppSelector(selectBrand)

  const { pageNum, search, sort }: PageParams = {
    pageNum: Number(searchParams.get('pageNum')) || 1,
    search: searchParams.get('search'),
    sort: searchParams.get('sort') || DEFAULT_SORT
  }

  useEffect(() => {
    dispatch(getBrandsByPage({ pageNum, search, sort }))
  }, [dispatch, searchParams, pageNum, search, sort])

  useEffect(() => {
    toast.error(error?.message)
  }, [error])

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
    <>
      <div className='px-2 lg:px-7 pt-5'>
        <AddButton onClick={() => dispatch(setShowModal(true))} />
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
      <AddBrand />
      <EditBrand />
      <DeleteBrand />
    </>
  )
}
export default Brands
