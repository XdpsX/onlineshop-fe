import { useNavigate, useParams, useSearchParams } from 'react-router-dom'
import api from '../services/api'
import { useEffect } from 'react'

function PaymentRedirect() {
  const navigate = useNavigate()
  const { orderId } = useParams()
  const [searchParams] = useSearchParams()
  const code = searchParams.get('vnp_ResponseCode')
  console.log(code)

  useEffect(() => {
    if (code === '24') {
      navigate('/cart', { replace: true })
    } else if (code === '51') {
      const message = 'Tài khoản của quý khách không đủ số dư để thực hiện giao dịch'
      navigate('/payments/error', { replace: true, state: { message } })
    } else if (code === '00') {
      api
        .get(`payments/vnpay_ipn?${searchParams.toString()}`)
        .then(() => navigate('/orders', { replace: true }))
        .catch(() => navigate('/payments/error', { replace: true, state: { message: 'An unexpected error occurred' } }))
    }
  }, [code, navigate, searchParams])
  return <div>PaymentRedirect</div>
}
export default PaymentRedirect
