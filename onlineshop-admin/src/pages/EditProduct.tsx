import { useEffect } from 'react'
import { Navigate } from 'react-router-dom'
import { Loader } from '~/components/common'
import { EditProductForm } from '~/components/product'
import { useAppDispatch, useAppSelector } from '~/store'
import { getProductById, selectProduct } from '~/store/features/productSlice'

const EditProduct = () => {
  const dispatch = useAppDispatch()
  const { editId, loading, prodToEdit } = useAppSelector(selectProduct)

  useEffect(() => {
    if (editId) {
      dispatch(getProductById(editId))
    }
  }, [dispatch, editId])

  if (!editId) {
    return <Navigate to='/products/list' />
  }
  if (loading.getProductById) {
    return <Loader />
  }
  if (!prodToEdit) return <Navigate to='/products/list' />

  return <EditProductForm prodToEdit={prodToEdit} />
}
export default EditProduct
