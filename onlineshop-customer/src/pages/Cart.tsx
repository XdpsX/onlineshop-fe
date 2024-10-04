import { Link, useNavigate } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '../app/hooks'
import Loading from '../components/ui/Loading'
import { selectCart } from '../features/cart/cartSlice'
import { useEffect } from 'react'
import { fetchCart } from '../features/cart/cartThunk'
import { CartItem } from '../models/cart/cartItem.type'
import Item from '../components/ui/CartItem'
import { formatPrice } from '../utils/helper'

function Cart() {
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const {
    cartItems,
    loading: { fetchCart: isLoading }
  } = useAppSelector(selectCart)

  useEffect(() => {
    dispatch(fetchCart())
  }, [dispatch])

  const redirect = (items: CartItem[], totalQuantity: number, totalAmount: number) => {
    navigate('/shipping', {
      state: { items, totalQuantity, totalAmount }
    })
  }

  if (isLoading) {
    return (
      <div className='text-center h-screen'>
        <Loading size='large' />
      </div>
    )
  }

  if (!cartItems) {
    return
  }

  const inStockCart: CartItem[] = []
  const outStockCart: CartItem[] = []

  cartItems.forEach((cart) => {
    if (cart.product.inStock) {
      inStockCart.push(cart)
    } else {
      outStockCart.push(cart)
    }
  })
  const totalQuantity = inStockCart.reduce((total, item) => total + item.quantity, 0)
  const totalAmount = inStockCart.reduce((total, item) => {
    if (item.product.discountPercent > 0) {
      return total + item.quantity * item.product.discountedPrice
    } else {
      return total + item.quantity * item.product.price
    }
  }, 0)
  return (
    <section className='bg-gray-100 '>
      <div className='w-[85%] lg:w-[90%] md:w-[90%] sm:w-[90%] mx-auto py-16 space-y-20'>
        {inStockCart.length > 0 ? (
          <div className='flex flex-wrap space-y-4 md:space-y-0'>
            <div className='md:w-[67%] w-full'>
              <div className='flex flex-col gap-3'>
                <div className='bg-white p-4'>
                  <h2 className='text-md  font-semibold'>
                    Bạn đang có <span className='text-green-500'>{totalQuantity} sản phẩm</span> trong giỏ hàng
                  </h2>
                </div>

                {inStockCart.map((item) => (
                  <Item item={item} key={item.product.id} />
                ))}
              </div>
            </div>

            <div className='md:w-[33%] w-full'>
              <div className='md:pl-3 pl-0'>
                {inStockCart.length > 0 && (
                  <div className='bg-white p-3 text-slate-600 flex flex-col gap-3'>
                    <h2 className='text-xl font-bold'>Thông tin đơn hàng</h2>
                    <div className='flex justify-between items-center'>
                      <span>{totalQuantity} Sản phẩm </span>
                      <span>{formatPrice(totalAmount)} </span>
                    </div>
                    <div className='flex justify-between items-center'>
                      <span>Phí ship</span>
                      <span>{formatPrice(0)} </span>
                    </div>

                    <div className='flex justify-between items-center'>
                      <span>Tổng</span>
                      <span className='text-lg font-bold text-green-500'>{formatPrice(totalAmount)} </span>
                    </div>
                    <button
                      onClick={redirect.bind(null, inStockCart, totalQuantity, totalAmount)}
                      className='px-5 py-[6px] rounded-sm hover:shadow-yellow-500/50 hover:shadow-lg bg-yellow-500 text-sm text-white uppercase '
                    >
                      Đặt hàng
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div>
            <Link className='px-4 py-1 bg-indigo-500 text-white' to='/'>
              Shop Now
            </Link>
          </div>
        )}
        {outStockCart.length > 0 && (
          <div className='md:w-[67%] w-full'>
            <div className='flex flex-col gap-3'>
              <div className='bg-white p-4'>
                <h2 className='text-md  font-semibold'>Sản phẩm hết hàng</h2>
              </div>

              {outStockCart.map((item) => (
                <Item item={item} key={item.product.id} />
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
export default Cart
