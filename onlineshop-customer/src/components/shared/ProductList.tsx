import { Link } from 'react-router-dom'
import { Product } from '../../models/product/product.type'
import { formatPrice } from '../../utils/helper'
import { FaCartPlus } from 'react-icons/fa'

function ProductList({ products }: { products: Product[] | undefined }) {
  if (products?.length === 0) {
    return <div className='min-h-[360px] text-center text-xl text-gray-900 font-bold'>Không tìm thấy sản phẩm</div>
  }
  return (
    <div className='w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 md:grid-cols-3 gap-6 md:gap-8'>
      {products?.map((prod) => (
        <div
          key={prod.id}
          className='border space-y-4 group transition-all duration-500 shadow-sm hover:shadow-md hover:-translate-y-4'
        >
          <div className='relative overflow-hidden'>
            {prod.discountPercent > 0 && (
              <div className='flex justify-center items-center absolute text-white w-10 h-10 rounded-full bg-red-500 font-semibold text-xs left-2 top-2'>
                {prod.discountPercent}%
              </div>
            )}

            <div className='overflow-hidden max-h-40 md:max-h-60'>
              <Link to={`/products/details/${prod.slug}`}>
                <img className='w-full' src={prod.mainImage} alt={prod.name} />
              </Link>
            </div>
          </div>

          <div className='pb-3 text-slate-600 px-3 space-y-6'>
            <Link to={`/products/details/${prod.slug}`} className='flex justify-between gap-4'>
              <h2 className='text-gray-800'>
                {prod.name.length > 30 ? `${prod.name.substring(0, 30)}...` : prod.name}
              </h2>
              <h4 className='text-sm text-white bg-blue-600 self-start p-1 rounded-sm'>{prod.brand.name}</h4>
            </Link>
            <div className='flex justify-between gap-4'>
              {prod.discountPercent > 0 ? (
                <div className='flex flex-col'>
                  <span className='text-red-600 font-semibold'>{formatPrice(prod.discountedPrice)}</span>
                  <span className='text-sm line-through text-gray-400'>{formatPrice(prod.price)}</span>
                </div>
              ) : (
                <span className='text-md font-semibold'>{formatPrice(prod.price)}</span>
              )}
              <div className='w-10 h-10 cursor-pointer flex justify-center items-center rounded-full shadow-md border bg-yellow-500 text-white hover:bg-transparent hover:text-yellow-500 hover:border-yellow-500 transition-all'>
                <FaCartPlus />
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
export default ProductList
