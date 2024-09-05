import { Loader } from '../common'
import { useAppDispatch, useAppSelector } from '~/store'
import { selectCategory, setDeleteCategory, setShowModal, setUpdateCategory } from '~/store/features/categorySlice'
import { FaEdit, FaTrash } from 'react-icons/fa'
import { Category } from '~/types/category'

const CategoryList = () => {
  const dispatch = useAppDispatch()
  const { categoryPage, isLoading } = useAppSelector(selectCategory)

  const onEditCategory = (categoryToUpdate: Category) => {
    dispatch(setUpdateCategory(categoryToUpdate))
    dispatch(setShowModal(true))
  }

  const onDeleteCategory = (categoryToDelete: Category) => {
    dispatch(setDeleteCategory(categoryToDelete))
  }

  if (isLoading) {
    return <Loader isDark />
  }

  if (!categoryPage) {
    return
  }
  const { items: categories, pageSize, pageNum } = categoryPage

  return (
    <div className='w-full p-4 bg-violet-500 text-white rounded-md shadow-md py-12'>
      {categories.length === 0 ? (
        <div className='text-center py-24 lg:py-36'>
          <h2 className='font-bold text-2xl'>Không tìm thấy Danh mục nào</h2>
        </div>
      ) : (
        <>
          <div className='relative overflow-x-auto'>
            <table className='w-full text-lg md:text-xl text-left'>
              <thead className='text-lg uppercase border-b border-slate-700 mb-2'>
                <tr>
                  <th scope='col' className='py-3 px-4'>
                    No
                  </th>
                  <th scope='col' className='py-3 px-4'>
                    Name
                  </th>
                  <th scope='col' className='py-3 px-4'>
                    Slug
                  </th>
                  <th scope='col' className='py-3 px-4'>
                    Action
                  </th>
                </tr>
              </thead>

              <tbody>
                {categories.map((cat, i) => (
                  <tr key={cat.id}>
                    <td scope='row' className='py-1 px-4 font-medium whitespace-nowrap'>
                      {(pageNum - 1) * pageSize + i + 1}
                    </td>
                    <td scope='row' className='py-1 px-4 font-medium whitespace-nowrap'>
                      {cat.name}
                    </td>
                    <td scope='row' className='py-1 px-4 font-medium whitespace-nowrap'>
                      {cat.slug}
                    </td>

                    <td scope='row' className='py-1 px-4 font-medium whitespace-nowrap'>
                      <div className='flex justify-start items-center gap-4 text-white'>
                        <button
                          onClick={() => onEditCategory(cat)}
                          title='Edit'
                          className='p-3 bg-yellow-500 rounded hover:shadow-lg hover:shadow-yellow-500/50'
                        >
                          <FaEdit />
                        </button>
                        <button
                          onClick={() => onDeleteCategory(cat)}
                          title='Delete'
                          className='p-3 bg-red-500 rounded hover:shadow-lg hover:shadow-red-500/50'
                        >
                          <FaTrash />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  )
}
export default CategoryList
