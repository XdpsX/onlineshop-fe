import { Outlet } from 'react-router-dom'
import Header from './Header'
import Footer from './Footer'
import { useAppDispatch, useAppSelector } from '../../app/hooks'
import { selectAuth } from '../../features/auth/authSlice'
import { removeProfile, selectUser } from '../../features/user/userSlice'
import { removeTotalItems, selectCart } from '../../features/cart/cartSlice'
import { useEffect } from 'react'
import { fetchUserProfile } from '../../features/user/userThunk'
import { fetchNumberCartItems } from '../../features/cart/cartThunk'
import Loading from '../ui/Loading'

function MainLayout() {
  const dispatch = useAppDispatch()
  const { accessToken } = useAppSelector(selectAuth)
  const {
    loading: { fetchUserProfile: isLoadingProfile }
  } = useAppSelector(selectUser)
  const {
    loading: { fetchNumberCartItems: isLoadingCart }
  } = useAppSelector(selectCart)

  useEffect(() => {
    if (accessToken) {
      Promise.all([dispatch(fetchUserProfile()), dispatch(fetchNumberCartItems())])
    } else {
      dispatch(removeProfile())
      dispatch(removeTotalItems())
    }
  }, [dispatch, accessToken])

  if (isLoadingProfile || isLoadingCart) {
    return (
      <div className='h-screen'>
        <Loading size='large' />
      </div>
    )
  }

  return (
    <>
      <Header />
      <main>
        <Outlet />
      </main>
      <Footer />
    </>
  )
}
export default MainLayout
