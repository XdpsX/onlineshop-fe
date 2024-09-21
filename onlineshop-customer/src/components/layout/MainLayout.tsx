import { Outlet } from 'react-router-dom'
import Header from './Header'
import Footer from './Footer'

function MainLayout() {
  return (
    <>
      <Header />
      <main className='max-w-[1200px] mx-auto'>
        <Outlet />
      </main>
      <Footer />
    </>
  )
}
export default MainLayout
