import { useAppDispatch, useAppSelector } from '~/store'
import { Modal } from '../common'
import { FaRegTrashAlt } from 'react-icons/fa'
import { useState } from 'react'
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom'
import { DEFAULT_SORT } from '~/utils/data'
import { deleteBrand, getBrandsByPage, selectBrand, setDeleteBrand } from '~/store/features/brandSlice'

const DeleteBrand = () => {
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const { deleteBrand: brandToDelete } = useAppSelector(selectBrand)
  const showModal = brandToDelete !== null

  const [isProcessing, setIsProcessing] = useState(false)

  const onClose = () => {
    dispatch(setDeleteBrand(null))
  }

  const deleteHandler = () => {
    if (!brandToDelete) return

    setIsProcessing(true)
    dispatch(deleteBrand(brandToDelete.id))
      .unwrap()
      .then(() => {
        toast.success('Xoá thương hiệu thành công')
        dispatch(getBrandsByPage({ pageNum: 1, search: null, sort: DEFAULT_SORT }))
        navigate('/brands?pageNum=1&sort=-date')
      })
      .catch((err) => {
        toast.error(err.message)
      })
      .finally(() => {
        onClose()
        setIsProcessing(false)
      })
  }

  if (!brandToDelete) return

  return (
    <Modal isOpen={showModal} onClose={onClose}>
      <div className='p-4 md:p-5 text-center'>
        <FaRegTrashAlt className='mx-auto mb-4 text-red-600 w-12 h-12' />
        <h3 className='mb-5 text-lg font-normal text-gray-700 dark:text-gray-500'>
          Bạn có chắc muốn xoá thương hiệu <strong>{brandToDelete.name}</strong>?
        </h3>
        {isProcessing ? (
          <button className='text-white bg-gray-600 focus:ring-4 focus:outline-none font-medium rounded-lg text-sm inline-flex items-center px-5 py-2.5 text-center cursor-none'>
            Loading...
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
export default DeleteBrand
