import { useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Loader } from '~/components/common'
import { useAppDispatch, useAppSelector } from '~/store'
import { getOrderDetails, selectOrder } from '~/store/features/orderSlice'
import { formatDateTime, formatPrice } from '~/utils/helper'

function OrderDetailsPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const { orderDetails: order, isLoading } = useAppSelector(selectOrder)

  useEffect(() => {
    dispatch(getOrderDetails(Number(id)))
  }, [dispatch, id])

  if (isLoading) {
    return <Loader />
  }
  if (!order) return null
  return (
    <div className=' mx-auto p-16 bg-white'>
      <div className='grid md:grid-cols-2 gap-3'>
        <div className='flex flex-col gap-2'>
          <p>
            <span className='bg-blue-100 text-blue-800 text-xs font-medium mr-2 px-2 py-2 rounded'>Mã đơn hàng</span>
            <span className='text-slate-600 text-sm'>#{order.trackingNumber}</span>
          </p>
          <p>
            <span className='bg-blue-100 text-blue-800 text-xs font-medium mr-2 px-2 py-2 rounded'>Người nhận</span>
            <span className='text-slate-600 text-sm'>{order.username}</span>
          </p>
          <p>
            <span className='bg-blue-100 text-blue-800 text-xs font-medium mr-2 px-2 py-2 rounded'>Ngày tạo</span>
            <span className='text-slate-600 text-sm'>{formatDateTime(order.createdAt)}</span>
          </p>
          <p>
            <span className='bg-blue-100 text-blue-800 text-xs font-medium mr-2 px-2 py-2 rounded'>Thông tin</span>
            <span className='text-slate-600 text-sm'>
              {order.mobileNumber} - {order.address}
            </span>
          </p>
        </div>

        <div className='text-slate-600'>
          <h2 className='font-mono'>Tổng : {formatPrice(order.total)}</h2>
          <p className='font-mono'>
            Tình trạng thanh toán:
            <span
              className={`py-[1px] text-xs px-3 ${order.paymentStatus === 'PAID' ? 'bg-green-300 text-green-800' : 'bg-red-300 text-red-800'} rounded-md`}
            >
              {order.paymentStatus}
            </span>
          </p>

          <p className='font-mono'>
            Tình trạng đơn hàng:
            <span className={`py-[1px] text-xs px-3  rounded-md`}>{order.status}</span>
          </p>
        </div>
      </div>

      <div className='my-4'>
        <h2 className='text-slate-600 text-lg pb-2 font-sans font-bold'>Order Products </h2>
        <div className='flex gap-5 flex-col'>
          {order.items.map((item) => (
            <div key={item.id}>
              <div className='flex gap-5 justify-start items-center text-slate-600'>
                <div className='flex gap-2'>
                  <img className='w-[55px] h-[55px]' src={item.product.mainImage} alt='Product Image' />
                  <div className='flex text-sm flex-col justify-start items-start'>
                    <h3>{item.product.name}</h3>
                    <p>
                      <span>Thương hiệu: {item.product.brand.name}</span>{' '}
                    </p>
                    <p>
                      <span>Số lượng : {item.quantity}</span>
                    </p>
                  </div>
                </div>

                <div className='pl-4 flex flex-col'>
                  {item.product.discountPercent > 0 ? (
                    <>
                      <h2 className='text-md text-green-800'>{formatPrice(item.product.discountedPrice)}</h2>
                      <p className='line-through'>{item.product.price}</p>
                      <p>-{item.product.discountPercent}%</p>
                    </>
                  ) : (
                    <h2 className='text-md text-green-800'>{formatPrice(item.product.price)}</h2>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <button className='px-6 py-2 bg-gray-300 text-gray-800 font-semibold rounded-sm' onClick={() => navigate(-1)}>
        Trở lại
      </button>
    </div>
  )
}
export default OrderDetailsPage
