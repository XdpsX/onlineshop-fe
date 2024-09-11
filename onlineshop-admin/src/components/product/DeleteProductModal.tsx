import { useAppDispatch, useAppSelector } from '~/store'
import { deleteProduct, selectProduct, setDeleteId } from '~/store/features/productSlice'
import { Modal } from '../common'
import { FaRegTrashAlt } from 'react-icons/fa'
import { toast } from 'react-toastify'

const DeleteProductModal = () => {
  const dispatch = useAppDispatch()
  const {
    deleteId,
    productPage,
    loading: { deleteProduct: isDeleting }
  } = useAppSelector(selectProduct)
  const isOpen = !!deleteId

  const onClose = () => {
    dispatch(setDeleteId(null))
  }
  if (!deleteId || !productPage) return
  const productToDelete = productPage.items.find((p) => p.id === deleteId)
  if (!productToDelete) return

  const deleteHandler = () => {
    dispatch(deleteProduct(deleteId))
      .unwrap()
      .then(() => {
        toast.success('Xoá sản phẩm thành công')
        onClose()
      })
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className='p-4 md:p-5 text-center'>
        <FaRegTrashAlt className='mx-auto mb-4 text-red-600 w-12 h-12' />
        <h3 className='mb-5 text-lg font-normal text-gray-700 dark:text-gray-500'>
          Bạn có chắc muốn xoá sản phẩm <strong>{productToDelete.name}</strong>?
        </h3>
        {isDeleting ? (
          <button className='text-white bg-gray-600 focus:ring-4 focus:outline-none font-medium rounded-lg text-sm inline-flex items-center px-5 py-2.5 text-center cursor-none'>
            Deleting...
          </button>
        ) : (
          <button
            onClick={deleteHandler}
            type='button'
            className='text-white bg-red-600 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 dark:focus:ring-red-800 font-medium rounded-lg text-sm inline-flex items-center px-5 py-2.5 text-center'
          >
            Đồng ý
          </button>
        )}
        <button
          onClick={onClose}
          type='button'
          className='py-2.5 px-5 ms-3 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-600 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700'
        >
          Huỷ
        </button>
      </div>
    </Modal>
  )
}
export default DeleteProductModal
