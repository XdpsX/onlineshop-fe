import { useRef, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import api from '../../services/api'
import { FaList, FaChevronDown, FaChevronUp } from 'react-icons/fa'
import { Link } from 'react-router-dom'
import { Category } from '../../models/category/category.type'
import { toast } from 'react-toastify'

function CategoryDropdown() {
  const {
    isLoading,
    isError,
    data: categories
  } = useQuery({
    queryKey: ['fetchCategories'],
    queryFn: async (): Promise<Category[]> => {
      const res = await api.get('/categories/get-all')
      return res.data
    }
  })

  const [showCategories, setShowCategories] = useState(true)
  const dropdownRef = useRef<HTMLDivElement | null>(null)

  if (isLoading) {
    return (
      <div
        onClick={() => setShowCategories(!showCategories)}
        className='bg-blue-500 text-white flex justify-center md:px-2 py-2 md:py-4 items-center gap-3 font-bold'
      >
        <div className='flex justify-center items-center gap-2'>
          <FaList />
          <span>Danh mục</span>
        </div>
      </div>
    )
  }

  if (isError) {
    toast.error('Không thể lấy danh sách danh mục. Vui lòng thử lại sau')
    return (
      <div
        onClick={() => setShowCategories(!showCategories)}
        className='bg-blue-500 text-white flex justify-center md:px-2 py-2 md:py-4 items-center gap-3 font-bold'
      >
        <div className='flex justify-center items-center gap-2'>
          <FaList />
          <span>Danh mục</span>
        </div>
      </div>
    )
  }

  return (
    <>
      <div
        onClick={() => setShowCategories(!showCategories)}
        className='bg-blue-500 text-white flex items-center justify-center md:px-2 py-2 md:py-4 gap-3 font-bold cursor-pointer'
      >
        <div className='flex justify-center items-center gap-2'>
          <FaList />
          <span>Danh mục</span>
        </div>
        {showCategories ? <FaChevronUp /> : <FaChevronDown />}
      </div>

      <div
        ref={dropdownRef}
        style={{ height: showCategories ? `${dropdownRef.current && dropdownRef.current.scrollHeight}px` : '0px' }}
        className={`overflow-hidden transition-all duration-500  bg-blue-200 w-full `}
      >
        <ul className='text-slate-600 font-medium'>
          {categories?.map((cat) => {
            return (
              <li key={cat.id} className=''>
                <Link
                  to={`categories/${cat.slug}`}
                  className='px-5 py-2.5 text-sm block text-gray-700 font-semibold hover:bg-yellow-500 hover:text-white'
                >
                  {cat.name}
                </Link>
              </li>
            )
          })}
        </ul>
      </div>
    </>
  )
}
export default CategoryDropdown
