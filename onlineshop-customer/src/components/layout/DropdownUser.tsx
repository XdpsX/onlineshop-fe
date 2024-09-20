import { useState } from 'react'
import ClickOutside from '../shared/ClickOutside'
import { FaAngleDown, FaSignOutAlt } from 'react-icons/fa'
import USER_AVATAR from '~/assets/images/default-user-icon.png'

const DropdownUser = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false)

  return (
    <ClickOutside onClick={() => setDropdownOpen(false)} className='relative'>
      <button onClick={() => setDropdownOpen(!dropdownOpen)} className='flex items-center gap-2'>
        <span className='h-8 w-8'>
          <img src={USER_AVATAR} alt='User avatar' />
        </span>
        <span className='block font-medium text-black'>Nguyễn Nam</span>
        <FaAngleDown />
      </button>

      {dropdownOpen && (
        <div className={`absolute right-0 mt-4 flex w-48 flex-col rounded-sm border border-stroke bg-white shadow-sm`}>
          <button className='flex items-center gap-3 px-6 py-4 text-md font-medium duration-300 ease-in-out hover:text-blue-600 lg:text-base'>
            <FaSignOutAlt />
            Đăng xuất
          </button>
        </div>
      )}
    </ClickOutside>
  )
}
export default DropdownUser
