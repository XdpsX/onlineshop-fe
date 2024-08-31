import { Link } from 'react-router-dom'
import { FaBars } from 'react-icons/fa'
import Logo from '~/assets/logo.png'
import DropdownUser from '../common/DropdownUser'

interface HeaderProps {
  sidebarOpen: string | boolean | undefined
  setSidebarOpen: (arg0: boolean) => void
}

const Header = ({ sidebarOpen, setSidebarOpen }: HeaderProps) => {
  return (
    <header className='sticky top-0 z-999 flex w-full bg-white drop-shadow-1 shadow-md'>
      <div className='flex flex-grow items-center justify-between px-4 py-4 shadow-2 md:px-6 2xl:px-11'>
        <div className='flex items-center gap-4 sm:gap-4 lg:hidden'>
          {/* <!-- Hamburger Toggle BTN --> */}
          <button
            aria-controls='sidebar'
            onClick={(e) => {
              e.stopPropagation()
              setSidebarOpen(!sidebarOpen)
            }}
            className='z-99999 block rounded-sm border border-stroke bg-white p-1.5 shadow-sm dark:border-strokedark dark:bg-boxdark lg:hidden'
          >
            <FaBars size={28} />
          </button>
          {/* <!-- Hamburger Toggle BTN --> */}

          <Link className='block flex-shrink-0 lg:hidden' to='/'>
            <img src={Logo} alt='Logo' className='h-12' />
          </Link>
        </div>

        <div className='ml-auto flex items-center gap-3 2xsm:gap-7'>
          {/* <!-- User Area --> */}
          <DropdownUser />
          {/* <!-- User Area --> */}
        </div>
      </div>
    </header>
  )
}
export default Header
