import { AddCategory, CategoryContainer, DeleteCategory } from '~/components/category'
import { FaPlus } from 'react-icons/fa'
import { useAppDispatch, useAppSelector } from '~/store'
import { selectCategory, setShowModal } from '~/store/features/categorySlice'
import { useEffect } from 'react'
import { toast } from 'react-toastify'

const Categories = () => {
  const dispatch = useAppDispatch()
  const { error } = useAppSelector(selectCategory)

  useEffect(() => {
    toast.error(error?.message)
  }, [error])

  return (
    <>
      <div className='px-2 lg:px-7 pt-5'>
        <div className='mb-4 flex'>
          <button
            onClick={() => dispatch(setShowModal(true))}
            className='px-5 py-3 flex items-center gap-3 text-white bg-green-500 transition-colors hover:bg-green-600 cursor-pointer rounded-md'
            type='button'
          >
            <FaPlus size={28} />
            <span className='text-xl'>Thêm</span>
          </button>
        </div>
        <CategoryContainer />
      </div>
      <AddCategory />
      <DeleteCategory />
    </>
  )
}
export default Categories
