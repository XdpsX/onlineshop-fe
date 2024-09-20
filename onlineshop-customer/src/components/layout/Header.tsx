import { Link } from 'react-router-dom'
import { FaCartShopping } from 'react-icons/fa6'
import DropdownUser from './DropdownUser'

const Header = () => {
  const user = true
  const wishlist_count = 3

  return (
    <div className='w-full bg-slate-200'>
      <div className='w-[85%] lg:w-[60%] mx-auto py-2'>
        <div className='flex w-full justify-between items-center gap-6'>
          {/* LOGO */}
          <Link to='/'>
            <img src='./logo.png' alt='Logo' className='w-12 md:w-16' />
          </Link>
          {/* SEARCH */}
          <div className='hidden md:flex w-6/12 border h-[42px] items-center'>
            <input
              className='w-full bg-white text-slate-500 outline-0 px-3 h-full'
              type='text'
              name='search'
              placeholder='Tìm kiếm sản phẩm'
            />
            <button className='bg-yellow-500 px-8 h-full font-semibold uppercase text-white'>Search</button>
          </div>

          <div className='flex justify-center gap-6 md:gap-8'>
            <div className='relative flex justify-center items-center cursor-pointer w-[35px] h-[35px] rounded-full bg-[#e2e2e2]'>
              <span className='text-xl '>
                <FaCartShopping />
              </span>
              <div className='w-[20px] h-[20px] absolute bg-red-500 rounded-full text-white flex justify-center items-center -top-[3px] -right-[5px] '>
                {wishlist_count}
              </div>
            </div>
            {user ? (
              <DropdownUser />
            ) : (
              <div className='flex justify-center items-center gap-2 text-sm md:text-lg'>
                <Link className='cursor-pointer font-bold text-black transition-colors hover:text-gray-600' to='/login'>
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

        {/* SEARCH MOBILE*/}
        <div className='flex md:hidden  mt-2 border h-[32px] items-center justify-center'>
          <input
            className='bg-white text-sm text-slate-500 outline-0 px-3 h-full'
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
