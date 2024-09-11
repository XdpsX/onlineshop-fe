import { PageResponse } from '~/types/page'
import { Product } from '~/types/product'
import { FaEdit, FaTrash, FaFileAlt } from 'react-icons/fa'
import { formatPrice } from '~/utils/helper'
import { FaCheckCircle, FaTimesCircle } from 'react-icons/fa'
import { useAppDispatch } from '~/store'
import { publishProduct, setDeleteId, setDetailId, setEditId } from '~/store/features/productSlice'
import { useNavigate } from 'react-router-dom'

const ProductTable = ({ productPage }: { productPage: PageResponse<Product> | null }) => {
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  if (!productPage) return null

  const { items: products, pageNum, pageSize } = productPage

  const onPublish = (product: Product) => {
    dispatch(publishProduct({ id: product.id, status: !product.published }))
  }

  const onEdit = (productId: number) => {
    dispatch(setEditId(productId))
    navigate('/products/edit')
  }

  if (products.length === 0) {
    return (
      <div className='text-center py-24 lg:py-36'>
        <h2 className='font-bold text-2xl'>Không tìm thấy Sản phẩm nào</h2>
      </div>
    )
  }

  return (
    <div className='relative overflow-x-auto'>
      <table className='w-full text-center'>
        <thead className='uppercase border-b border-slate-700 mb-2'>
          <tr>
            <th scope='col' className='py-3 px-2'>
              No
            </th>
            <th scope='col' className='py-3'>
              Image
            </th>
            <th scope='col' className='py-3 px-4'>
              Name
            </th>
            <th scope='col' className='py-3  px-4'>
              Price
            </th>
            <th scope='col' className='py-3  px-4'>
              Category
            </th>
            <th scope='col' className='py-3  px-4'>
              Brand
            </th>
            <th scope='col' className='py-3  px-4'>
              Public
            </th>
            <th scope='col' className='py-3 px-4'>
              Action
            </th>
          </tr>
        </thead>

        <tbody className=''>
          {products.map((product, i) => (
            <tr key={product.id} className='space-under'>
              <td scope='row' className='py-1 px-2 font-medium whitespace-nowrap'>
                {(pageNum - 1) * pageSize + i + 1}
              </td>
              <td scope='row' className='py-1 whitespace-nowrap'>
                <img src={product.mainImage} className='w-15 mx-auto' alt={`${product.name} logo`} />
              </td>
              <td scope='row' className='py-1 px-4 font-medium whitespace-nowrap'>
                {product.name}
              </td>
              <td scope='row' className='py-1 px-4 font-medium whitespace-nowrap'>
                {formatPrice(product.price)}
              </td>
              <td scope='row' className='py-1 px-4 font-medium whitespace-nowrap'>
                <span className='bg-slate-200 text-black px-2 rounded-md'>{product.category.name}</span>
              </td>
              <td scope='row' className='py-1 px-4 font-medium whitespace-nowrap'>
                <span className='bg-slate-200 text-black px-2 rounded-md'>{product.brand.name}</span>
              </td>
              <td scope='row' className='py-1 px-4 font-medium whitespace-nowrap'>
                <button
                  onClick={() => onPublish(product)}
                  className='text-2xl transition-colors text-white hover:text-slate-200'
                  title={product.published ? 'Unpublish' : 'Publish'}
                >
                  {product.published ? <FaCheckCircle /> : <FaTimesCircle />}
                </button>
              </td>
              <td scope='row' className='py-1 px-4 whitespace-nowrap'>
                <div className='flex items-center justify-center gap-2 text-white'>
                  <button
                    onClick={() => dispatch(setDetailId(product.id))}
                    title='Chi tiết'
                    className='p-2.5 bg-blue-500 rounded hover:shadow-lg hover:shadow-blue-500/50'
                  >
                    <FaFileAlt />
                  </button>
                  <button
                    onClick={() => onEdit(product.id)}
                    title='Sửa'
                    className='p-2.5 bg-yellow-500 rounded hover:shadow-lg hover:shadow-yellow-500/50'
                  >
                    <FaEdit />
                  </button>
                  <button
                    onClick={() => dispatch(setDeleteId(product.id))}
                    title='Xoá'
                    className='p-2.5 bg-red-500 rounded hover:shadow-lg hover:shadow-red-500/50'
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
  )
}
export default ProductTable
