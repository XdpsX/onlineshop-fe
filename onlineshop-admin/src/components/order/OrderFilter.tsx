import { ORDER_STATUS, PAYMENT_STATUS } from '~/utils/data'

interface OrderFilterProps {
  curOrderStatus: string
  curPaymentStatus: string
  onOrderStatusChange: (status: string) => void
  onPaymentStatusChange: (status: string) => void
}

function OrderFilter({
  curOrderStatus,
  curPaymentStatus,
  onOrderStatusChange,
  onPaymentStatusChange
}: OrderFilterProps) {
  return (
    <div className='flex flex-col md:flex-row gap-3 items-center mb-4'>
      <select
        value={curOrderStatus}
        onChange={(e) => onOrderStatusChange(e.target.value)}
        className=' ps-2 py-2 text-sm md:text-lg focus:border-indigo-500 outline-none bg-white border border-slate-700 rounded-md text-black'
      >
        <option value=''>Order Status</option>
        {ORDER_STATUS.map((option) => (
          <option key={option.id} value={option.value}>
            {option.title}
          </option>
        ))}
      </select>
      <select
        value={curPaymentStatus}
        onChange={(e) => onPaymentStatusChange(e.target.value)}
        className=' ps-2 py-2 text-sm md:text-lg focus:border-indigo-500 outline-none bg-white border border-slate-700 rounded-md text-black'
      >
        <option value=''>Payment Status</option>
        {PAYMENT_STATUS.map((option) => (
          <option key={option.id} value={option.value}>
            {option.title}
          </option>
        ))}
      </select>
    </div>
  )
}
export default OrderFilter
