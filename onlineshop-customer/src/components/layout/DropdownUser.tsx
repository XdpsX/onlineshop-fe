import { useState } from 'react'
import ClickOutside from '../shared/ClickOutside'
import { useAppDispatch } from '../../app/hooks'
import { logout } from '../../features/auth/authSlice'
import { toast } from 'react-toastify'
import { FaAngleDown, FaSignOutAlt } from 'react-icons/fa'
import USER_AVATAR from '~/assets/images/default-user-icon.png'
import { UserProfile } from '../../models/user/profile.type'

const DropdownUser = ({ profile }: { profile: UserProfile }) => {
  const dispatch = useAppDispatch()
  const [dropdownOpen, setDropdownOpen] = useState(false)

  const handleLogout = () => {
    dispatch(logout())
    toast.success('Đăng xuất thành công')
  }

  return (
    <ClickOutside onClick={() => setDropdownOpen(false)} className='relative'>
      <button onClick={() => setDropdownOpen(!dropdownOpen)} className='flex items-center gap-2'>
        <span className='h-8 w-8'>
          <img src={profile.avatarUrl || USER_AVATAR} alt='User avatar' />
        </span>
        <span className='block font-medium text-black'>{profile.name}</span>
        <FaAngleDown />
      </button>

      {dropdownOpen && (
        <div className={`absolute right-0 mt-4 flex w-48 flex-col rounded-sm border border-stroke bg-white shadow-sm`}>
          <button
            onClick={handleLogout}
            className='flex items-center gap-3 px-6 py-4 text-md font-medium duration-300 ease-in-out hover:text-blue-600 lg:text-base'
          >
            <FaSignOutAlt />
            Đăng xuất
          </button>
        </div>
      )}
    </ClickOutside>
  )
}
export default DropdownUser
