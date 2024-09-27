import { useQuery } from '@tanstack/react-query'
import { useParams, useSearchParams } from 'react-router-dom'
import { Category } from '../models/category/category.type'
import api from '../services/api'
import Loading from '../components/ui/Loading'
import { Error as ErrorDTO } from '../models/error.type'
import { json } from 'react-router-dom'
import CategoryProducts from '../components/ui/CategoryProducts'
import { useEffect } from 'react'
import { useAppDispatch } from '../app/hooks'
import { resetFilters, setPageNum } from '../features/products/productSlice'

function ProductsByCategory() {
  const dispatch = useAppDispatch()
  const { slug } = useParams()
  const [searchParams] = useSearchParams()

  useEffect(() => {
    const pageNum = searchParams.get('pageNum') || 1
    dispatch(setPageNum(pageNum))
  }, [searchParams, dispatch])

  useEffect(() => {
    return () => {
      dispatch(resetFilters())
    }
  }, [dispatch])

  const {
    isLoading,
    isError,
    error,
    data: category
  } = useQuery({
    queryKey: ['fetchCategoryBySlug', slug],
    queryFn: async (): Promise<Category> => {
      const res = await api.get(`/categories/${slug}`)
      return res.data
    },
    retry: 1
  })

  if (isLoading) {
    return (
      <div className='h-screen'>
        <Loading size='large' />
      </div>
    )
  }
  if (isError || !category) {
    const err = error as unknown as ErrorDTO
    throw json(err.message, { status: err.status })
  }

  return (
    <>
      <div className='bg-[url("/banners/1.jpg")] h-[220px] bg-cover bg-no-repeat relative bg-left'>
        <div className='absolute left-0 top-0 w-full h-full bg-[#2422228a]'>
          <div className='w-[85%] md:w-[80%] sm:w-[90%] lg:w-[90%] h-full mx-auto'>
            <div className='flex flex-col justify-center gap-1 items-center h-full w-full text-white'>
              <h2 className='text-3xl font-bold'>Sản phẩm {category.name}</h2>
            </div>
          </div>
        </div>
      </div>
      <CategoryProducts categoryId={category.id} />
    </>
  )
}
export default ProductsByCategory
