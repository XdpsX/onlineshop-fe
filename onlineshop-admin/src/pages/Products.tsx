import { Link } from 'react-router-dom'
import { ProductContainer, ProductFilter } from '~/components/product'
import { FaPlus } from 'react-icons/fa'

const Products = () => {
  return (
    <div className='px-2 lg:px-7 pt-5'>
      <div className='mb-4 flex'>
        <Link
          to='/products/new'
          className='px-5 py-3 flex items-center gap-3 text-white bg-green-500 transition-colors hover:bg-green-600 cursor-pointer rounded-md'
          type='button'
        >
          <FaPlus size={28} />
          <span className='text-xl'>Thêm</span>
        </Link>
      </div>
      <ProductFilter />
      <ProductContainer />
    </div>
  )
}
export default Products
