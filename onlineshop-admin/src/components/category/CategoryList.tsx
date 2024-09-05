import { Loader, Pagination } from '../common'
import { useSearchParams } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '~/store'
import { selectCategory, setDeleteCategory, setShowModal, setUpdateCategory } from '~/store/features/categorySlice'
import { FaEdit, FaTrash } from 'react-icons/fa'
import { Category } from '~/types/category'

const CategoryList = () => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_, setSearchParams] = useSearchParams()

  const dispatch = useAppDispatch()
  const { categoryPage, isLoading, params } = useAppSelector(selectCategory)
  const { items: categories, pageNum, pageSize, totalPages } = categoryPage
  const { search, sort } = params

  const onPageChange = (newPageNum: number) => {
    const params: { [key: string]: string } = { pageNum: String(newPageNum), sort: sort }
    if (search) {
      params.search = search
    }
    setSearchParams(params)
  }

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

  if (!categories) {
    return
  }
  return (
    <div className='py-12'>
      {categories.length === 0 ? (
        <div className='text-center py-24 lg:py-36'>
          <h2 className='font-bold text-2xl'>No Category Found</h2>
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
          {totalPages > 1 && (
            <div className='w-full flex justify-end mt-8 bottom-4 right-4'>
              <Pagination pageNum={pageNum} onPageChange={onPageChange} totalPages={totalPages} />
            </div>
          )}
        </>
      )}
    </div>
  )
}
export default CategoryList
