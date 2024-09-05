import { AddCategory, CategoryContainer, DeleteCategory } from '~/components/category'
import { useAppDispatch, useAppSelector } from '~/store'
import { selectCategory, setShowModal } from '~/store/features/categorySlice'
import { useEffect } from 'react'
import { toast } from 'react-toastify'
import { AddButton } from '~/components/common'

const Categories = () => {
  const dispatch = useAppDispatch()
  const { error } = useAppSelector(selectCategory)

  useEffect(() => {
    toast.error(error?.message)
  }, [error])

  return (
    <>
      <div className='px-2 lg:px-7 pt-5'>
        <AddButton onClick={() => dispatch(setShowModal(true))} />
        <CategoryContainer />
      </div>
      <AddCategory />
      <DeleteCategory />
    </>
  )
}
export default Categories
