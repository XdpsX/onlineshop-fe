import { FaFileAlt } from 'react-icons/fa'
import { Link } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '~/store'
import { selectOrder, updateOrderStatus } from '~/store/features/orderSlice'
import { Order } from '~/types/order'
import { ORDER_STATUS } from '~/utils/data'
import { formatDateTime } from '~/utils/helper'

function OrderTable({ orders, pageNum, pageSize }: { orders: Order[]; pageNum: number; pageSize: number }) {
  const dispatch = useAppDispatch()
  const { isUpdating } = useAppSelector(selectOrder)
  const handleUpdateStatus = (id: number, status: string) => {
    dispatch(updateOrderStatus({ id, status }))
  }

  return (
    <div className='w-full p-4 bg-violet-500 text-white rounded-md shadow-md py-12'>
      {orders.length === 0 ? (
        <div className='text-center py-24 lg:py-36'>
          <h2 className='font-bold text-2xl'>Không tìm thấy Đơn hàng nào</h2>
        </div>
      ) : (
        <>
          <div className='relative overflow-x-auto'>
            <table className='w-full text-lg text-left'>
              <thead className='text-lg uppercase border-b border-slate-700 mb-2'>
                <tr>
                  <th scope='col' className='py-3 px-4'>
                    No
                  </th>
                  <th scope='col' className='py-3 px-4'>
                    Tracking Number
                  </th>
                  <th scope='col' className='py-3 px-4'>
                    Order Status
                  </th>
                  <th scope='col' className='py-3 px-4'>
                    Payment Status
                  </th>
                  <th scope='col' className='py-3 px-4'>
                    Order Date
                  </th>
                  <th scope='col' className='py-3 px-4'>
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody>
                {orders.map((order, i) => (
                  <tr key={order.id} className='space-under'>
                    <td scope='row' className='py-1 px-4  whitespace-nowrap'>
                      {(pageNum - 1) * pageSize + i + 1}
                    </td>
                    <td scope='row' className='py-1 px-4  whitespace-nowrap'>
                      {order.trackingNumber}
                    </td>
                    <td scope='row' className='py-1 px-4  whitespace-nowrap'>
                      <select
                        disabled={isUpdating}
                        value={order.status}
                        onChange={(e) => handleUpdateStatus(order.id, e.target.value)}
                        className=' ps-2 py-2 text-sm md:text-lg focus:border-indigo-500 outline-none bg-white border border-slate-700 rounded-md text-black'
                      >
                        {ORDER_STATUS.map((option) => (
                          <option key={option.id} value={option.value}>
                            {option.title}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td scope='row' className='py-1 px-4  whitespace-nowrap'>
                      {order.paymentStatus}
                    </td>
                    <td scope='row' className='py-1 px-4 whitespace-nowrap'>
                      {formatDateTime(order.createdAt)}
                    </td>
                    <td scope='row' className='py-1 px-4 whitespace-nowrap'>
                      <div className='flex items-center justify-center gap-2 text-white'>
                        <Link
                          to={`/orders/${order.id}`}
                          title='Chi tiết'
                          className='p-2.5 bg-blue-500 rounded hover:shadow-lg hover:shadow-blue-500/50'
                        >
                          <FaFileAlt />
                        </Link>
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
export default OrderTable
