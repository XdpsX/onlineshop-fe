import { useAppDispatch, useAppSelector } from '~/store'
import { Modal } from '../common'
import CategoryForm from './CategoryForm'
import { selectCategory, setShowModal, setUpdateCategory } from '~/store/features/categorySlice'

const AddCategory = () => {
  const dispatch = useAppDispatch()
  const { showModal, updateCategory } = useAppSelector(selectCategory)
  const isEditMode = updateCategory !== null

  const closeModal = () => {
    dispatch(setShowModal(false))
    setTimeout(() => {
      if (isEditMode) {
        dispatch(setUpdateCategory(null))
      }
    }, 200)
  }

  return (
    <Modal isOpen={showModal} onClose={closeModal}>
      <div className='ps-2 md:ps-8 pe-8 md:pe-10 py-4'>
        <div className='py-2 md:p-5 border-b'>
          <h3 className='text-2xl md:text-3xl font-semibold text-gray-900 text-center'>
            {isEditMode ? 'Cập nhật danh mục' : 'Tạo danh mục mới'}
          </h3>
        </div>
        <CategoryForm isEditMode={isEditMode} closeModal={closeModal} />
      </div>
    </Modal>
  )
}
export default AddCategory
