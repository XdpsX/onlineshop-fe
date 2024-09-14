import { useState } from 'react'
import { Link } from 'react-router-dom'
import ClickOutside from './ClickOutside'

import { FaAngleDown, FaSignOutAlt } from 'react-icons/fa'
import UserIcon from '~/assets/default-user-icon.png'
import { useAppDispatch } from '~/store'
import { logout } from '~/store/features/authSlice'
import { toast } from 'react-toastify'

const DropdownUser = () => {
  const dispatch = useAppDispatch()
  const [dropdownOpen, setDropdownOpen] = useState(false)

  const logoutHandler = () => {
    dispatch(logout())
    toast.success('Đăng xuất thành công')
  }
  return (
    <ClickOutside onClick={() => setDropdownOpen(false)} className='relative'>
      <Link onClick={() => setDropdownOpen(!dropdownOpen)} className='flex items-center gap-4' to='#'>
        <span className='hidden text-right lg:block'>
          <span className='block text-lg font-medium text-black dark:text-white'>Thomas Anree</span>
          <span className='block text-md'>Admin</span>
        </span>

        <span className='h-12 w-12 rounded-full'>
          <img src={UserIcon} alt='User' />
        </span>

        <FaAngleDown />
      </Link>

      {/* <!-- Dropdown Start --> */}
      {dropdownOpen && (
        <div className={`absolute right-0 mt-4 flex w-48 flex-col rounded-sm border border-stroke bg-white shadow-sm`}>
          <button
            onClick={logoutHandler}
            className='flex items-center gap-3 px-6 py-4 text-md font-medium duration-300 ease-in-out hover:text-blue-600 lg:text-base'
          >
            <FaSignOutAlt />
            Log Out
          </button>
        </div>
      )}
      {/* <!-- Dropdown End --> */}
    </ClickOutside>
  )
}
export default DropdownUser
