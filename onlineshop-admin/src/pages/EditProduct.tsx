import { useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { Loader } from '~/components/common'
import { EditProductForm } from '~/components/product'
import { useAppDispatch, useAppSelector } from '~/store'
import { getProductById, selectProduct } from '~/store/features/productSlice'

const EditProduct = () => {
  const dispatch = useAppDispatch()
  const { id } = useParams()
  const { loading, prodToEdit } = useAppSelector(selectProduct)

  useEffect(() => {
    if (id) {
      const prodId = Number(id)
      dispatch(getProductById(prodId))
    }
  }, [dispatch, id])

  if (loading.getProductById) {
    return <Loader />
  }
  if (!prodToEdit) return null

  return <EditProductForm prodToEdit={prodToEdit} />
}
export default EditProduct
