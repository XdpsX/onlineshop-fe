import { Navigate, useLocation } from 'react-router-dom'
import { formatPrice } from '../utils/helper'
import { useForm, Controller } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import api from '../services/api'
import { toast } from 'react-toastify'
import { AxiosError } from 'axios'

type OrderCreate = {
  mobileNumber: string
  address: string
  description?: string
}

const schema = yup.object().shape({
  mobileNumber: yup.string().required('Số điện thoại là bắt buộc').max(20, 'Số điện thoại không được quá 20 ký tự'),
  address: yup.string().required('Địa chỉ là bắt buộc').max(255, 'Địa chỉ không được quá 255 ký tự'),
  description: yup.string().max(500, 'Ghi chú không được quá 500 ký tự')
})

function Shipping() {
  const {
    state: { items, totalQuantity, totalAmount }
  } = useLocation()

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm<OrderCreate>({
    resolver: yupResolver(schema)
  })

  if (!items || !totalQuantity || !totalAmount) {
    return <Navigate to='/' replace />
  }

  const onSubmit = async (order: OrderCreate) => {
    try {
      const { data } = await api.post('/orders/create', order)
      window.location.replace(data.payment.vnpUrl)
    } catch (error) {
      if (error instanceof AxiosError && error.response && error.response.data) {
        toast.error(error.response.data.message)
      } else {
        toast.error('An unexpected error occurred')
      }
    }
  }

  return (
    <section className='bg-gray-100 '>
      <div className='w-[85%] lg:w-[90%] md:w-[90%] sm:w-[90%] mx-auto py-16 space-y-20'>
        <div className='flex flex-wrap space-y-4 md:space-y-0'>
          <div className='md:w-[67%] w-full'>
            <div className='flex flex-col gap-3'>
              <div className='bg-white p-6 shadow-sm rounded-md'>
                <h2 className='text-slate-600 font-bold pb-3'>Thông tin giao hàng</h2>

                <form className='space-y-5' onSubmit={handleSubmit(onSubmit)}>
                  <div className='flex md:flex-row flex-col gap-2 w-full text-slate-600'>
                    <div className='flex flex-col gap-1 w-full'>
                      <label htmlFor='mobileNumber'>Số điện thoại:</label>
                      <Controller
                        name='mobileNumber'
                        control={control}
                        render={({ field }) => (
                          <input
                            type='text'
                            className={`px-3 py-2 border ${errors.mobileNumber ? 'border-red-500' : 'border-slate-300'} outline-none focus:border-green-500 rounded-md`}
                            id='mobileNumber'
                            placeholder='Số điện thoại'
                            {...field}
                          />
                        )}
                      />
                      {errors.mobileNumber && <p className='text-red-500'>{errors.mobileNumber.message}</p>}
                    </div>

                    <div className='flex flex-col gap-1 w-full'>
                      <label htmlFor='address'>Địa chỉ:</label>
                      <Controller
                        name='address'
                        control={control}
                        render={({ field }) => (
                          <input
                            type='text'
                            className={`px-3 py-2 border ${errors.address ? 'border-red-500' : 'border-slate-300'} outline-none focus:border-green-500 rounded-md`}
                            id='address'
                            placeholder='Địa chỉ'
                            {...field}
                          />
                        )}
                      />
                      {errors.address && <p className='text-red-500'>{errors.address.message}</p>}
                    </div>
                  </div>
                  <div>
                    <label htmlFor='description'>Ghi chú:</label>
                    <Controller
                      name='description'
                      control={control}
                      render={({ field }) => (
                        <textarea
                          className='w-full px-3 min-h-40 py-2 border border-slate-300 outline-none focus:border-green-500 rounded-md'
                          id='description'
                          placeholder='Ghi chú'
                          {...field}
                        ></textarea>
                      )}
                    />
                    {errors.description && <p className='text-red-500'>{errors.description.message}</p>}
                  </div>
                  <button
                    type='submit'
                    disabled={isSubmitting}
                    className='px-5 py-[6px] rounded-sm hover:shadow-yellow-500/50 hover:shadow-lg bg-yellow-500 text-sm text-white uppercase'
                  >
                    Thanh toán
                  </button>
                </form>
              </div>
            </div>
          </div>

          <div className='md:w-[33%] w-full'>
            <div className='md:pl-3 pl-0'>
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
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Shipping
