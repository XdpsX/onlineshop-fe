import { Link, useNavigate } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '../../app/hooks'
import { selectAuth } from '../../features/auth/authSlice'
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import { useForm } from 'react-hook-form'
import { LoginRequest } from '../../models/auth/login.type'
import { loginThunk } from '../../features/auth/authThunk'
import { toast } from 'react-toastify'
import GOOGLE_ICON from '../../assets/icons/google.svg'
import FACEBOOK_ICON from '../../assets/icons/facebook.svg'
import Loading from '../../components/ui/Loading'

const schema = yup.object().shape({
  email: yup
    .string()
    .email('Nhập đúng định dạng email')
    .required('Vui lòng nhập email')
    .max(64, 'Mật khẩu không quá 64 kí tự'),
  password: yup.string().required('Vui lòng nhập mật khẩu').max(255, 'Mật khẩu không quá 255 kí tự')
})

function Login() {
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const {
    loading: { login: isLoading }
  } = useAppSelector(selectAuth)

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<LoginRequest>({
    resolver: yupResolver(schema),
    defaultValues: {
      email: 'admina@email.com',
      password: '12345678'
    }
  })

  const onSubmit = async (data: LoginRequest) => {
    await dispatch(loginThunk(data)).unwrap()
    navigate('/')
    toast.success('Đăng nhập thành công')
  }

  return (
    <div className='flex h-screen flex-1 flex-col py-12 sm:px-6 lg:px-8 bg-slate-100'>
      <div className='sm:mx-auto sm:w-full sm:max-w-md'>
        <img alt='Logo' src='./logo.png' className='mx-auto h-12 w-auto' />
        <h2 className='mt-2 text-center text-2xl font-bold leading-9 tracking-tight text-gray-800'>
          Đăng nhập tài khoản
        </h2>
      </div>

      <div className='mt-6 sm:mx-auto sm:w-full sm:max-w-[440px]'>
        <div className='bg-white px-6 py-12 shadow-md sm:rounded-lg sm:px-12 '>
          <form onSubmit={handleSubmit(onSubmit)} className='space-y-4'>
            <div>
              <label htmlFor='email' className='block text-sm font-semibold leading-6 text-gray-900'>
                Địa chỉ email
              </label>
              <div className='mt-2'>
                <input
                  id='email'
                  type='email'
                  {...register('email')}
                  autoComplete='email'
                  className='block w-full rounded-md border border-black p-1.5 text-gray-900 shadow-sm  placeholder:text-gray-400 sm:text-sm sm:leading-6'
                />
                {errors.email && <p className='text-red-500 text-sm'>{errors.email.message}</p>}
              </div>
            </div>

            <div>
              <label htmlFor='password' className='block text-sm font-semibold leading-6 text-gray-900'>
                Mật khẩu
              </label>
              <div className='mt-2'>
                <input
                  id='password'
                  type='password'
                  {...register('password')}
                  autoComplete='current-password'
                  className='block w-full rounded-md border border-black p-1.5 text-gray-900 shadow-sm  placeholder:text-gray-400 sm:text-sm sm:leading-6'
                />
                {errors.password && <p className='text-red-500 text-sm'>{errors.password.message}</p>}
              </div>
            </div>

            <div className='text-right'>
              <div className='text-sm leading-6'>
                <a href='#' className='font-semibold text-blue-600 hover:text-blue-500'>
                  Quên mật khẩu?
                </a>
              </div>
            </div>

            <div>
              {isLoading ? (
                <button
                  disabled
                  className='flex gap-2 w-full items-center justify-center rounded-md bg-gray-500 text-slate-100 text-sm px-3 py-1.5 font-semibold leading-6 shadow-sm'
                >
                  <Loading className='border-gray-300' />
                  Loading...
                </button>
              ) : (
                <button
                  type='submit'
                  className='flex w-full justify-center rounded-md bg-blue-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600'
                >
                  Đăng nhập
                </button>
              )}
            </div>
          </form>

          <div className='mt-6 text-center'>
            <p>
              <span>Chưa có tài khoản? </span>
              <span>
                <Link to='/register' className='text-yellow-500 font-semibold cursor-pointer hover:text-yellow-400'>
                  Đăng kí
                </Link>
              </span>
            </p>
          </div>

          <div>
            <div className='relative mt-6'>
              <div aria-hidden='true' className='absolute inset-0 flex items-center'>
                <div className='w-full border-t border-gray-200' />
              </div>
              <div className='relative flex justify-center text-sm font-medium leading-6'>
                <span className='bg-white px-6 text-gray-900'>Hoặc đăng nhập bằng</span>
              </div>
            </div>

            <div className='mt-4 grid grid-cols-2 gap-4'>
              <Link
                to='#'
                className='flex w-full items-center justify-center gap-3 rounded-md border border-slate-500 bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm hover:bg-gray-50'
              >
                <img src={GOOGLE_ICON} alt='' className='h-6' />
                <span className='text-sm font-semibold leading-6'>Google</span>
              </Link>

              <Link
                to='#'
                className='flex w-full items-center justify-center gap-3 rounded-md border border-slate-500 bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm  hover:bg-gray-50'
              >
                <img src={FACEBOOK_ICON} alt='' className='h-6' />
                <span className='text-sm font-semibold leading-6'>Facebook</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
export default Login
