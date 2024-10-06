import { useQuery } from '@tanstack/react-query'
import { useParams, json, Link, useNavigate } from 'react-router-dom'
import { OrderDetails } from '../models/order/orderDetails.type'
import { Error as ErrorDTO } from '../models/error.type'
import api from '../services/api'
import Loading from '../components/ui/Loading'
import { formatDateTime, formatPrice } from '../utils/helper'

export default function OrderDetailsPage() {
  const navigate = useNavigate()
  const { code } = useParams()

  const {
    isLoading,
    isError,
    error,
    data: order
  } = useQuery({
    queryKey: ['fetchOrderDetails', code],
    queryFn: async (): Promise<OrderDetails> => {
      const res = await api.get(`/orders/code/${code}`)
      return res.data
    },
    retry: 2
  })

  if (isLoading) {
    return (
      <div className='h-screen'>
        <Loading size='large' />
      </div>
    )
  }
  if (isError || !order) {
    const err = error as unknown as ErrorDTO
    throw json(err.message, { status: err.status })
  }

  console.log(order)

  return (
    <div className='lg:w-[65%] md:w-[80%] w-[90%] min-h-[240px] mx-auto py-16'>
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
                    <Link to={`/products/details/${item.product.slug}`}>{item.product.name}</Link>
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
