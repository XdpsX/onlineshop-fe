import { useInfiniteQuery } from '@tanstack/react-query'
import api from '../../services/api'
import { useAppDispatch, useAppSelector } from '../../app/hooks'
import { selectProduct, setSort } from '../../features/products/productSlice'
import Loading from './Loading'
import ProductList from '../shared/ProductList'
import { Page } from '../../models/page.type'
import { Product } from '../../models/product/product.type'
import ProductFilters from './ProductFilters'
import { sortOptions } from '../../utils/data'

function CategoryProducts({ categoryId }: { categoryId: number }) {
  const dispatch = useAppDispatch()
  const { pageNum, brandIds, sort, minPrice, maxPrice } = useAppSelector(selectProduct)

  const { data, isLoading, isError, error, fetchNextPage, hasNextPage, isFetchingNextPage } = useInfiniteQuery({
    queryKey: ['fetchProductsByCategoryId', categoryId, brandIds, sort, minPrice, maxPrice],
    queryFn: async ({ pageParam }): Promise<Page<Product>> => {
      const brandIdsStr = brandIds ? brandIds.join(',') : ''
      const res = await api.get(`/categories/${categoryId}/products`, {
        params: {
          pageNum: pageParam,
          brandIds: brandIdsStr,
          sort,
          minPrice,
          maxPrice
        }
      })
      return res.data
    },
    getNextPageParam: (lastPage: Page<Product>) => {
      return lastPage.pageNum < lastPage.totalPages ? lastPage.pageNum + 1 : undefined
    },
    initialPageParam: pageNum,
    retry: 2
  })

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    dispatch(setSort(e.target.value))
  }

  if (isLoading) {
    return (
      <div className='h-screen'>
        <Loading size='medium' />
      </div>
    )
  }
  if (isError || !data) {
    console.error(error)
    return null
  }

  const { pages } = data
  const products = pages.flatMap((page) => page.items)
  const totalItems = pages[0].totalItems

  return (
    <div className='w-full flex flex-wrap px-8 py-14 md:px-12 xl:px-48'>
      <div className='w-full md:w-3/12'>
        <ProductFilters categoryId={categoryId} />
      </div>
      <div className='w-full md:w-9/12'>
        <div className='py-4 bg-white mb-10 px-3 rounded-md flex justify-between items-start border'>
          <h2 className='text-lg font-medium text-slate-600'>{totalItems} Sản phẩm</h2>
          <div className='flex justify-center items-center gap-3'>
            <select
              onChange={handleSortChange}
              className='p-1 border outline-0 text-slate-600 font-semibold'
              name='sort'
              id='sort'
              value={sort || '-date'}
            >
              {sortOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div>
          <ProductList products={products} />
          {isFetchingNextPage && (
            <div className='mt-6'>
              <Loading size='medium' />
            </div>
          )}
        </div>
        {hasNextPage && (
          <div className='text-center mt-4'>
            <button onClick={() => fetchNextPage()} className='bg-blue-500 px-9 py-3 text-white rounded-sm'>
              Tải thêm
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
export default CategoryProducts
