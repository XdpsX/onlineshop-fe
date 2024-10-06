import { useQuery } from '@tanstack/react-query'
import { Page } from '../models/page.type'
import { Order } from '../models/order/order.type'
import api from '../services/api'
import Loading from '../components/ui/Loading'
import { Link } from 'react-router-dom'
import { formatDateTime } from '../utils/helper'
import { useState } from 'react'
import Pagination from '../components/shared/Pagination'

function Orders() {
  const [pageNum, setPageNum] = useState(1)
  const {
    isLoading,
    isError,
    error,
    data: orderPage
  } = useQuery({
    queryKey: ['fetchMyOrders', pageNum],
    queryFn: async (): Promise<Page<Order>> => {
      const res = await api.get(`/orders/me?page=${pageNum}`)
      return res.data
    },
    retry: 2
  })

  const onPageChange = (pageNum: number) => {
    setPageNum(pageNum)
  }

  if (isLoading) {
    return (
      <div className='h-screen'>
        <Loading size='large' />
      </div>
    )
  }
  if (isError || !orderPage) {
    console.error(error)
    return null
  }

  if (orderPage.items.length === 0) {
    return (
      <section className='lg:w-[65%] md:w-[80%] w-[90%] min-h-[240px] mx-auto py-16 text-center'>
        <p className='text-2xl font-medium text-gray-600 mb-6'>Không có Đơn hàng nào</p>
        <Link
          to='/'
          className='bg-blue-600 uppercase text-white text-lg p-4 rounded-md shadow-sm transition-colors hover:bg-blue-700'
        >
          Shop now
        </Link>
      </section>
    )
  }

  const { items: orders, totalPages } = orderPage

  return (
    <section className='lg:w-[65%] md:w-[80%] w-[90%] h-full mx-auto py-16'>
      <div className='px-4 sm:px-6 lg:px-8'>
        <div className='mt-8 flow-root'>
          <div className='-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8'>
            <h2 className='text-center text-2xl font-semibold mb-4 text-blue-600'>Đơn hàng của bạn</h2>
            <div className='inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8'>
              <table className='min-w-full divide-y divide-gray-300'>
                <thead>
                  <tr>
                    <th scope='col' className='py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-0'>
                      Mã đơn
                    </th>
                    <th scope='col' className='px-3 py-3.5 text-left text-sm font-semibold text-gray-900'>
                      Tình trạng
                    </th>
                    <th scope='col' className='px-3 py-3.5 text-left text-sm font-semibold text-gray-900'>
                      Tổng tiền
                    </th>
                    <th scope='col' className='px-3 py-3.5 text-left text-sm font-semibold text-gray-900'>
                      Trạng thái thanh toán
                    </th>
                    <th scope='col' className='px-3 py-3.5 text-left text-sm font-semibold text-gray-900'>
                      Ngày tạo
                    </th>
                    <th scope='col' className='relative py-3.5 pl-3 pr-4 sm:pr-0'>
                      <span className='sr-only'>Edit</span>
                    </th>
                  </tr>
                </thead>
                <tbody className='divide-y divide-gray-200'>
                  {orders.map((order) => (
                    <tr key={order.id}>
                      <td className='whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-0'>
                        {order.trackingNumber}
                      </td>
                      <td className='whitespace-nowrap px-3 py-4 text-sm text-gray-500'>{order.status}</td>
                      <td className='whitespace-nowrap px-3 py-4 text-sm text-gray-500'>{order.total}</td>
                      <td className='whitespace-nowrap px-3 py-4 text-sm text-gray-500'>{order.paymentStatus}</td>
                      <td className='whitespace-nowrap px-3 py-4 text-sm text-gray-500'>
                        {formatDateTime(order.createdAt)}
                      </td>
                      <td className='relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-0'>
                        <Link
                          to={`/orders/details/${order.trackingNumber}`}
                          className='text-indigo-600 hover:text-indigo-900'
                        >
                          Xem
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          {totalPages > 1 && <Pagination totalPages={totalPages} pageNum={pageNum} onPageChange={onPageChange} />}
        </div>
      </div>
    </section>
  )
}
export default Orders
