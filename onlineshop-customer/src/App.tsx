import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import MainLayout from './components/layout/MainLayout'
import Home from './pages/Home'
import Login from './pages/auth/Login'
import Register from './pages/auth/Register'
import Error from './pages/Error'
import { useAppDispatch, useAppSelector } from './app/hooks'
import { selectAuth } from './features/auth/authSlice'
import { useEffect } from 'react'
import { fetchUserProfile } from './features/user/userThunk'
import { removeProfile, selectUser } from './features/user/userSlice'
import Loading from './components/ui/Loading'
import ProductsByCategory from './pages/ProductsByCategory'
import { fetchNumberCartItems } from './features/cart/cartThunk'
import { removeTotalItems, selectCart } from './features/cart/cartSlice'
import Cart from './pages/Cart'
import ProtectedRoute from './components/shared/ProtectedRoute'
import ProductDetailsPage from './pages/ProductDetailsPage'

const router = createBrowserRouter([
  {
    path: '/',
    element: <MainLayout />,
    errorElement: <Error />,
    children: [
      {
        index: true,
        element: <Home />
      },
      {
        path: '/categories/:slug',
        element: <ProductsByCategory />
      },
      {
        path: '/products/details/:slug',
        element: <ProductDetailsPage />
      },
      {
        path: '/cart',
        element: (
          <ProtectedRoute>
            <Cart />
          </ProtectedRoute>
        )
      }
    ]
  },
  {
    path: '/login',
    element: <Login />
  },
  {
    path: '/register',
    element: <Register />
  }
])
function App() {
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
  return <RouterProvider router={router} />
}

export default App
