import { useEffect, useRef, useState } from 'react'
import { NavLink, useLocation } from 'react-router-dom'

import { FaArrowLeft, FaListUl, FaHandHolding, FaProductHunt, FaAngleUp, FaAngleDown } from 'react-icons/fa'
import Logo from '~/assets/logo.png'
import SidebarLinkGroup from './SidebarLinkGroup'

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
  const [sidebarExpanded, setSidebarExpanded] = useState(
    storedSidebarExpanded === null ? false : storedSidebarExpanded === 'true'
  )

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
      <div className='flex items-center justify-between gap-3 px-6 py-5 lg:py-6'>
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
          <ul className='mb-6 flex flex-col gap-2.5'>
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
            {/* <!-- Menu Item Forms --> */}
            <SidebarLinkGroup activeCondition={pathname === '/products' || pathname.includes('products')}>
              {(handleClick, open) => {
                return (
                  <>
                    <NavLink
                      to='#'
                      className={`group relative flex items-center gap-2.5 rounded-sm py-2 px-4 font-medium duration-300 ease-in-out hover:bg-yellow-500 ${
                        (pathname === '/products' || pathname.includes('products')) && 'bg-yellow-500'
                      }`}
                      onClick={(e) => {
                        e.preventDefault()
                        sidebarExpanded ? handleClick() : setSidebarExpanded(true)
                      }}
                    >
                      <FaProductHunt />
                      Sản phẩm
                      {open ? <FaAngleUp className='ms-auto' /> : <FaAngleDown className='ms-auto' />}
                    </NavLink>
                    {/* <!-- Dropdown Menu Start --> */}
                    <div className={`translate transform overflow-hidden ${!open && 'hidden'}`}>
                      <ul className='mt-4 mb-5.5 flex flex-col gap-2.5 pl-6'>
                        <li>
                          <NavLink
                            to='/products/list'
                            className={({ isActive }) =>
                              'group relative flex items-center gap-2.5 rounded-md px-4 font-medium text-slate-300 duration-300 ease-in-out hover:text-white ' +
                              (isActive && '!text-yellow-400 cursor-default')
                            }
                          >
                            Danh sách
                          </NavLink>
                        </li>
                        <li>
                          <NavLink
                            to='/products/new'
                            className={({ isActive }) =>
                              'group relative flex items-center gap-2.5 rounded-md px-4 font-medium text-slate-300 duration-300 ease-in-out hover:text-white ' +
                              (isActive && '!text-yellow-400 cursor-default')
                            }
                          >
                            Tạo Sản Phẩm
                          </NavLink>
                        </li>
                      </ul>
                    </div>
                    {/* <!-- Dropdown Menu End --> */}
                  </>
                )
              }}
            </SidebarLinkGroup>
            {/* <!-- Menu Item Forms --> */}
          </ul>
        </nav>
      </div>
    </aside>
  )
}
export default Sidebar
