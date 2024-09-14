import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import { useForm } from 'react-hook-form'
import { useAppDispatch, useAppSelector } from '~/store'
import { loginAdminThunk, selectAuth } from '~/store/features/authSlice'
import { LoginRequest } from '~/types/auth'
import Logo from '~/assets/logo.png'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'

const schema = yup.object().shape({
  email: yup.string().email('Nhập đúng định dạng email').required('Vui lòng nhập email'),
  password: yup.string().required('Vui lòng nhập mật khẩu').max(255, 'Mật khẩu không quá 255 kí tự')
})

function LoginPage() {
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const {
    loading: { loginThunk: isLoading }
  } = useAppSelector(selectAuth)

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<LoginRequest>({
    resolver: yupResolver(schema),
    defaultValues: {
      email: 'admin@email.com',
      password: 'admin12345'
    }
  })

  const onSubmit = async (data: LoginRequest) => {
    await dispatch(loginAdminThunk(data)).unwrap()
    navigate('/')
    toast.success('Đăng nhập thành công')
  }

  return (
    <div className='flex min-h-full flex-1 flex-col justify-center py-12 sm:px-6 lg:px-8'>
      <div className='mt-5 sm:mx-auto sm:w-full sm:max-w-[440px]'>
        <div className='bg-white px-6 pt-6 pb-12 shadow sm:rounded-lg sm:px-12'>
          <div className='mb-6'>
            <div className='flex items-center justify-center'>
              <img src={Logo} alt='Logo' />
            </div>
            <h2 className='mt-2 text-center text-xl font-bold leading-9 tracking-tight text-gray-900'>
              Đăng nhập <span className='text-purple-500'>OnlineShop</span> - Admin
            </h2>
          </div>
          <form onSubmit={handleSubmit(onSubmit)} className='space-y-5'>
            <div>
              <label htmlFor='email' className='block text-sm font-medium leading-6 text-gray-900'>
                Email
              </label>
              <div className='mt-2'>
                <input
                  id='email'
                  type='email'
                  {...register('email')}
                  className='block w-full rounded-md border-0 px-2 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6'
                />
                {errors.email && <p className='text-red-500 text-sm'>{errors.email.message}</p>}
              </div>
            </div>

            <div>
              <label htmlFor='password' className='block text-sm font-medium leading-6 text-gray-900'>
                Mật khẩu
              </label>
              <div className='mt-2'>
                <input
                  id='password'
                  type='password'
                  {...register('password')}
                  className='block w-full rounded-md border-0 px-2 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6'
                />
                {errors.password && <p className='text-red-500 text-sm'>{errors.password.message}</p>}
              </div>
            </div>

            <div>
              {isLoading ? (
                <button
                  disabled
                  className='button-height flex w-full items-center justify-center rounded-md bg-gray-600 px-3 py-1.5 font-semibold leading-6 shadow-sm'
                >
                  Loading...
                </button>
              ) : (
                <button
                  type='submit'
                  className='button-height flex w-full items-center justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600'
                >
                  Đăng nhập
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
export default LoginPage
