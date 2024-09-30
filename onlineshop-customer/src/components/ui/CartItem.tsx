import { Link } from 'react-router-dom'
import { CartItem as CartItemType } from '../../models/cart/cartItem.type'
import { formatPrice } from '../../utils/helper'
import { useAppDispatch, useAppSelector } from '../../app/hooks'
import { removeCartItem, updateCartItem } from '../../features/cart/cartThunk'
import { selectCart } from '../../features/cart/cartSlice'

function CartItem({ item }: { item: CartItemType }) {
  const dispatch = useAppDispatch()
  const {
    loading: { removeCartItem: isDeleting, updateCartItem: isUpdating }
  } = useAppSelector(selectCart)

  const removeItem = (productId: number) => {
    dispatch(removeCartItem(productId))
  }

  const decrease = (curQuantity: number, productId: number) => {
    if (curQuantity > 1) {
      dispatch(updateCartItem({ productId, quantity: curQuantity - 1 }))
    } else {
      removeItem(productId)
    }
    console.log('Decrease')
  }

  const increase = (curQuantity: number, productId: number) => {
    dispatch(updateCartItem({ productId, quantity: curQuantity + 1 }))
    console.log('Increase')
  }

  if (!item.product.inStock) {
    return (
      <div className='bg-white py-2 px-6 gap-2 w-full flex items-center justify-between flex-wrap'>
        <div className='w-full md:w-1/2'>
          <Link to={`/products/details/${item.product.slug}`} className='inline-flex gap-2 items-center'>
            <img className='w-20 h-20' src={item.product.mainImage} alt='Product image' />
            <h2 className='text-lg font-semibold'>{item.product.name}</h2>
          </Link>
        </div>
        <div className='w-full md:w-5/12 flex flex-wrap justify-between items-center'>
          <p className='text-orange-500 font-bold'>Hết hàng</p>
          <div className='flex gap-2 flex-col'>
            <button
              disabled={isDeleting}
              onClick={() => removeItem(item.product.id)}
              className='px-5 py-1 bg-red-500 text-white'
            >
              Xoá
            </button>
          </div>
        </div>
      </div>
    )
  }
  return (
    <div className='bg-white py-2 px-2 md:px-6 gap-2 w-full flex items-center justify-between flex-wrap'>
      <div className='w-full md:w-1/2 mb-4 md:mb-0'>
        <Link to={`/products/details/${item.product.slug}`} className='inline-flex gap-2 items-center'>
          <img className='w-20 h-20' src={item.product.mainImage} alt='Product image' />
          <div className='pr-4 text-slate-600'>
            <h2 className='text-lg font-semibold'>
              {item.product.name}
              <span className='ms-2 text-red-500 text-sm align-top'>
                {item.product.discountPercent > 0 && `(-${item.product.discountPercent}%)`}
              </span>
            </h2>
            {item.product.discountPercent > 0 ? (
              <div className='space-x-2 md:space-x-4'>
                <span>{formatPrice(item.product.discountedPrice)} x1</span>
                <span className='text-sm line-through'>{formatPrice(item.product.price)}</span>
              </div>
            ) : (
              <span>{formatPrice(item.product.price)} x1</span>
            )}
          </div>
        </Link>
      </div>
      <div className='w-full md:w-5/12 flex flex-wrap justify-between items-center'>
        <p className='text-lg font-bold text-orange-500'>
          {item.product.discountPercent > 0
            ? formatPrice(item.product.discountedPrice * item.quantity)
            : formatPrice(item.product.price * item.quantity)}
        </p>
        <div className='flex gap-2 flex-col'>
          <div className='flex bg-slate-200 h-[30px] justify-center items-center text-xl'>
            <button
              disabled={isUpdating}
              onClick={() => decrease(item.quantity, item.product.id)}
              className='px-3 cursor-pointer'
            >
              -
            </button>
            <div className='px-3'>{item.quantity}</div>
            <button
              disabled={isUpdating}
              onClick={() => increase(item.quantity, item.product.id)}
              className='px-3 cursor-pointer'
            >
              +
            </button>
          </div>
          <button
            disabled={isDeleting}
            onClick={() => removeItem(item.product.id)}
            className='px-5 py-[3px] bg-red-500 text-white'
          >
            Xoá
          </button>
        </div>
      </div>
    </div>
  )
}
export default CartItem
