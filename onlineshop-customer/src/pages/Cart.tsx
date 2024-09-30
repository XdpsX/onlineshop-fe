import { Link } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '../app/hooks'
import Loading from '../components/ui/Loading'
import { selectCart } from '../features/cart/cartSlice'
import { useEffect } from 'react'
import { fetchCart } from '../features/cart/cartThunk'
import { CartItem } from '../models/cart/cartItem.type'
import Item from '../components/ui/CartItem'

function Cart() {
  const dispatch = useAppDispatch()
  const {
    cartItems,
    loading: { fetchCart: isLoading }
  } = useAppSelector(selectCart)

  useEffect(() => {
    dispatch(fetchCart())
  }, [dispatch])

  if (isLoading) {
    return (
      <div className='text-center h-screen'>
        <Loading size='large' />
      </div>
    )
  }

  if (!cartItems) {
    console.error('Something wrong with cartItems')
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
  console.log(inStockCart)
  return (
    <section className='bg-gray-100 '>
      <div className='w-[85%] lg:w-[90%] md:w-[90%] sm:w-[90%] mx-auto py-16 space-y-20'>
        {inStockCart.length > 0 ? (
          <div className='flex flex-wrap space-y-4'>
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
                    <h2 className='text-xl font-bold'>Order Summary</h2>
                    <div className='flex justify-between items-center'>
                      <span>{totalQuantity} Items </span>
                      <span>$1000000 </span>
                    </div>
                    <div className='flex justify-between items-center'>
                      <span>Shipping Fee </span>
                      <span>$20 </span>
                    </div>
                    <div className='flex gap-2'>
                      <input
                        className='w-full px-3 py-2 border border-slate-200 outline-0 focus:border-green-500 rounded-sm'
                        type='text'
                        placeholder='Input Vauchar Coupon'
                      />
                      <button className='px-5 py-[1px] bg-[#059473] text-white rounded-sm uppercase text-sm'>
                        Apply
                      </button>
                    </div>

                    <div className='flex justify-between items-center'>
                      <span>Total</span>
                      <span className='text-lg text-[#059473]'>$4343 </span>
                    </div>
                    <button
                      // onClick={redirect}
                      className='px-5 py-[6px] rounded-sm hover:shadow-red-500/50 hover:shadow-lg bg-red-500 text-sm text-white uppercase '
                    >
                      Process to Checkout
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
