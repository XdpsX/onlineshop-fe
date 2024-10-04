import { Navigate, useLocation } from 'react-router-dom'

function PaymentError() {
  const { state } = useLocation()
  if (!state) {
    return <Navigate to='/' replace />
  }
  return (
    <div className='h-screen flex items-center justify-center text-center'>
      <div>
        <h1 className='text-2xl font-bold text-red-500'>Error</h1>
        <p className='text-xl'>{state.message}</p>
      </div>
    </div>
  )
}
export default PaymentError
