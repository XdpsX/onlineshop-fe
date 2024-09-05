import { useAppSelector } from '~/store'
import { selectBrand } from '~/store/features/brandSlice'
import { Loader } from '../common'

import { FaEdit, FaTrash } from 'react-icons/fa'

const BrandList = () => {
  const { brandPage, isLoading } = useAppSelector(selectBrand)

  if (isLoading) {
    return <Loader isDark />
  }
  if (!brandPage) {
    return
  }

  const { items: brands, pageNum, pageSize } = brandPage

  console.log('render')
  return (
    <div className='w-full px-4 bg-violet-500 text-white rounded-md shadow-md py-12'>
      {brands?.length === 0 ? (
        <div className='text-center py-24 lg:py-36'>
          <h2 className='font-bold text-2xl'>Không tìm thấy Thương hiệu nào</h2>
        </div>
      ) : (
        <>
          <div className='relative overflow-x-auto'>
            <table className='w-full text-lg md:text-xl text-left '>
              <thead className='text-lg uppercase border-b border-slate-700 mb-2'>
                <tr>
                  <th scope='col' className='py-3 px-4'>
                    No
                  </th>
                  <th scope='col' className='py-3 px-4'>
                    Logo
                  </th>
                  <th scope='col' className='py-3 px-4'>
                    Name
                  </th>
                  <th scope='col' className='py-3  px-4'>
                    Categories
                  </th>
                  <th scope='col' className='py-3 px-4'>
                    Action
                  </th>
                </tr>
              </thead>

              <tbody>
                {brands.map((brand, i) => (
                  <tr key={brand.id}>
                    <td scope='row' className='py-1 px-4 font-medium whitespace-nowrap'>
                      {(pageNum - 1) * pageSize + i + 1}
                    </td>
                    <td scope='row' className='py-1 px-4 font-medium whitespace-nowrap'>
                      <img src={brand.logo} className='w-15' alt={`${brand.name} logo`} />
                    </td>
                    <td scope='row' className='py-1 px-4 font-medium whitespace-nowrap'>
                      {brand.name}
                    </td>
                    <td scope='row' className='py-1 px-4 font-medium'>
                      <div className='flex flex-wrap gap-x-4 gap-y-2'>
                        {brand.categories.map((cat) => (
                          <div key={cat.id} className='bg-slate-200 text-black px-2 rounded-md'>
                            {cat.name}
                          </div>
                        ))}
                      </div>
                    </td>
                    <td scope='row' className='py-1 px-4 font-medium whitespace-nowrap'>
                      <div className='flex justify-start items-center gap-4 text-white'>
                        <button
                          // onClick={() => onEditCategory(cat)}
                          title='Edit'
                          className='p-3 bg-yellow-500 rounded hover:shadow-lg hover:shadow-yellow-500/50'
                        >
                          <FaEdit />
                        </button>
                        <button
                          // onClick={() => onDeleteCategory(cat)}
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
export default BrandList
