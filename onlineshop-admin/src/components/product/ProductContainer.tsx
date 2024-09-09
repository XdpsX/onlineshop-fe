import { useEffect } from 'react'
import { useAppDispatch, useAppSelector } from '~/store'
import { getProductsPage, selectProduct, updateProductParams } from '~/store/features/productSlice'
import { Loader, Pagination } from '../common'
import ProductTable from './ProductTable'
import { toast } from 'react-toastify'
import { ProductParams } from '~/types/product'

const ProductContainer = () => {
  const dispatch = useAppDispatch()
  const { params, productPage, isLoading, error } = useAppSelector(selectProduct)

  useEffect(() => {
    dispatch(getProductsPage(params))
  }, [dispatch, params])

  useEffect(() => {
    if (error) {
      toast.error(error.message)
    }
  }, [error])

  const onPageChange = (newPage: number) => {
    const newParams: ProductParams = { ...params, pageNum: newPage }
    dispatch(updateProductParams(newParams))
  }

  return (
    <>
      <div className='w-full p-4 bg-violet-500 text-white rounded-md shadow-md py-12'>
        {isLoading ? <Loader isDark /> : <ProductTable productPage={productPage} />}
      </div>
      {productPage?.totalPages && productPage.totalPages > 1 && (
        <Pagination pageNum={productPage.pageNum} onPageChange={onPageChange} totalPages={productPage.totalPages} />
      )}
    </>
  )
}
export default ProductContainer
