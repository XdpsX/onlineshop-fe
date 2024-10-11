import { Link } from 'react-router-dom'
import { FaCartShopping } from 'react-icons/fa6'
import DropdownUser from './DropdownUser'
import { useAppSelector } from '../../app/hooks'
import { selectUser } from '../../features/user/userSlice'
import { selectCart } from '../../features/cart/cartSlice'

const Header = () => {
  const { profile } = useAppSelector(selectUser)
  const { totalItems } = useAppSelector(selectCart)

  return (
    <div className='w-full bg-slate-200 sticky top-0 z-50'>
      <div className='max-w-[1200px] mx-auto px-6 py-2'>
        <div className=' flex items-center justify-between md:justify-normal'>
          {/* LOGO */}
          <div className='md:w-1/5 lg:w-1/5'>
            <Link to='/'>
              <img src='/logo.png' alt='Logo' className='w-12 md:w-16' />
            </Link>
          </div>
          <div className='md:w-4/5 lg:w-4/5 flex items-center gap-8'>
            {/* SEARCH */}
            <div className='hidden md:flex w-1/2 lg:w-2/3  border h-[42px] items-center'>
              <input
                className='w-3/5 bg-white text-slate-500 outline-0 px-3 h-full'
                type='text'
                name='search'
                placeholder='Tìm kiếm sản phẩm'
              />
              <button className='bg-yellow-500 px-2 lg:px-6 h-full font-semibold text-white'>Tìm kiếm</button>
            </div>

            <div className='flex justify-center gap-6 md:gap-8'>
              <Link
                to='/cart'
                className='relative flex justify-center items-center cursor-pointer w-[35px] h-[35px] rounded-full bg-[#e2e2e2]'
              >
                <span className='text-xl '>
                  <FaCartShopping />
                </span>
                {totalItems && totalItems > 0 ? (
                  <div className='w-[20px] h-[20px] absolute bg-red-500 rounded-full text-white flex justify-center items-center -top-[3px] -right-[5px] '>
                    {totalItems}
                  </div>
                ) : null}
              </Link>
              {profile ? (
                <DropdownUser profile={profile} />
              ) : (
                <div className='flex justify-center items-center gap-2 3xl:text-lg'>
                  <Link
                    className='cursor-pointer font-bold text-black transition-colors hover:text-gray-600'
                    to='/login'
                  >
                    Đăng nhập
                  </Link>
                  <span>|</span>
                  <Link
                    className='cursor-pointer font-bold text-black transition-colors hover:text-gray-600'
                    to='/register'
                  >
                    Đăng kí
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* SEARCH MOBILE*/}
        <div className='flex md:hidden mt-4 px-12 border h-[40px] items-center justify-center'>
          <input
            className='bg-white text-sm text-slate-500 outline-0 px-3 h-full w-full'
            type='text'
            name='search'
            placeholder='Tìm kiếm sản phẩm'
          />
          <button className='bg-yellow-500 px-4 h-full text-sm font-semibold uppercase text-white'>Search</button>
        </div>
      </div>
    </div>
  )
}

export default Header
