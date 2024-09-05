import { useEffect, useRef, useState } from 'react'
import { NavLink, useLocation } from 'react-router-dom'

import { FaArrowLeft, FaListUl, FaHandHolding } from 'react-icons/fa'
import Logo from '~/assets/logo.png'

interface SidebarProps {
  sidebarOpen: boolean
  setSidebarOpen: (arg: boolean) => void
}

const Sidebar = ({ sidebarOpen, setSidebarOpen }: SidebarProps) => {
  const location = useLocation()
  const { pathname } = location

  const sidebar = useRef<HTMLElement>(null)
  const trigger = useRef<HTMLButtonElement>(null)

  const storedSidebarExpanded = localStorage.getItem('sidebar-expanded')
  const [sidebarExpanded] = useState(storedSidebarExpanded === null ? false : storedSidebarExpanded === 'true')

  // close on click outside
  useEffect(() => {
    const clickHandler = (event: MouseEvent) => {
      const target = event.target as Node
      if (!sidebar.current || !trigger.current) return
      if (!sidebarOpen || sidebar.current.contains(target) || trigger.current.contains(target)) return
      setSidebarOpen(false)
    }

    document.addEventListener('click', clickHandler)
    return () => document.removeEventListener('click', clickHandler)
  })

  // close if the esc key is pressed
  useEffect(() => {
    const keyHandler = ({ keyCode }: KeyboardEvent) => {
      if (!sidebarOpen || keyCode !== 27) return
      setSidebarOpen(false)
    }
    document.addEventListener('keydown', keyHandler)
    return () => document.removeEventListener('keydown', keyHandler)
  })

  useEffect(() => {
    localStorage.setItem('sidebar-expanded', sidebarExpanded.toString())
    if (sidebarExpanded) {
      document.querySelector('body')?.classList.add('sidebar-expanded')
    } else {
      document.querySelector('body')?.classList.remove('sidebar-expanded')
    }
  }, [sidebarExpanded])

  return (
    <aside
      ref={sidebar}
      className={`absolute left-0 top-0 z-9999 flex h-screen w-72 flex-col overflow-y-hidden bg-blue-600 text-white duration-300 ease-linear lg:static lg:translate-x-0 ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      }`}
    >
      {/* <!-- SIDEBAR HEADER --> */}
      <div className='flex items-center justify-between gap-2 px-6 py-5 lg:py-6'>
        <NavLink to='/' className='flex items-center justify-between gap-2'>
          <img src={Logo} alt='Logo' />
          <span className='text-4xl font-semibold'>Shop</span>
        </NavLink>

        <button
          ref={trigger}
          onClick={() => setSidebarOpen(!sidebarOpen)}
          aria-controls='sidebar'
          aria-expanded={sidebarOpen}
          className='block lg:hidden cursor-pointer'
        >
          <FaArrowLeft className='text-white' size={24} />
        </button>
      </div>
      {/* <!-- SIDEBAR HEADER --> */}

      <div className='scrollbar flex flex-col overflow-y-auto duration-300 ease-linear'>
        {/* <!-- Sidebar Menu --> */}
        <nav className='mt-5 py-4 px-4 lg:mt-9 lg:px-6 text-xl'>
          <ul className='mb-6 flex flex-col gap-1'>
            {/* <!-- Menu Item Category --> */}
            <li>
              <NavLink
                to='/categories'
                className={`group relative flex items-center gap-2 rounded-sm py-2 px-4 font-medium duration-300 ease-in-out hover:bg-yellow-500 ${
                  pathname.includes('categories') && 'bg-yellow-500'
                }`}
              >
                <FaListUl />
                Danh mục
              </NavLink>
            </li>
            {/* <!-- Menu Item Category --> */}
            {/* <!-- Menu Item Brand --> */}
            <li>
              <NavLink
                to='/brands'
                className={`group relative flex items-center gap-2 rounded-sm py-2 px-4 font-medium duration-300 ease-in-out hover:bg-yellow-500 ${
                  pathname.includes('brands') && 'bg-yellow-500'
                }`}
              >
                <FaHandHolding />
                Thương hiệu
              </NavLink>
            </li>
            {/* <!-- Menu Item Brand --> */}
          </ul>
        </nav>
      </div>
    </aside>
  )
}
export default Sidebar
