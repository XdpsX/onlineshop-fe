import { useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { Loader, Pagination } from '~/components/common'
import OrderFilter from '~/components/order/OrderFilter'
import OrderTable from '~/components/order/OrderTable'
import { useAppDispatch, useAppSelector } from '~/store'
import { getPageOrders, selectOrder } from '~/store/features/orderSlice'

function Orders() {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const { orderPage, isLoading } = useAppSelector(selectOrder)

  const { pageNum, orderStatus, paymentStatus } = {
    pageNum: Number(searchParams.get('pageNum')) || 1,
    orderStatus: searchParams.get('orderStatus') || '',
    paymentStatus: searchParams.get('paymentStatus') || ''
  }

  useEffect(() => {
    dispatch(getPageOrders({ pageNum, orderStatus, paymentStatus }))
  }, [dispatch, orderStatus, pageNum, paymentStatus])

  const onPageChange = (newPage: number) => {
    const params = new URLSearchParams({ pageNum: newPage.toString() })
    if (orderStatus) params.append('orderStatus', orderStatus)
    if (paymentStatus) params.append('paymentStatus', paymentStatus)
    navigate(`?${params.toString()}`)
  }

  const onOrderStatusChange = (newStatus: string) => {
    const params = new URLSearchParams({ pageNum: pageNum.toString() })
    if (newStatus) params.append('orderStatus', newStatus)
    if (paymentStatus) params.append('paymentStatus', paymentStatus)
    navigate(`?${params.toString()}`)
  }

  const onPaymentStatusChange = (newStatus: string) => {
    const params = new URLSearchParams({ pageNum: pageNum.toString() })
    if (orderStatus) params.append('orderStatus', orderStatus)
    if (newStatus) params.append('paymentStatus', newStatus)
    navigate(`?${params.toString()}`)
  }

  if (isLoading) {
    return <Loader />
  }
  return (
    <div className='px-2 lg:px-7 pt-5'>
      <OrderFilter
        curOrderStatus={orderStatus}
        curPaymentStatus={paymentStatus}
        onOrderStatusChange={onOrderStatusChange}
        onPaymentStatusChange={onPaymentStatusChange}
      />
      <OrderTable orders={orderPage?.items || []} pageNum={pageNum} pageSize={orderPage?.pageSize || 10} />
      {orderPage?.totalPages && orderPage.totalPages > 1 && (
        <Pagination pageNum={pageNum} onPageChange={onPageChange} totalPages={orderPage.totalPages} />
      )}
    </div>
  )
}
export default Orders
