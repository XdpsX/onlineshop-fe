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

const router = createBrowserRouter([
  {
    path: '/',
    element: <MainLayout />,
    errorElement: <Error />,
    children: [
      {
        index: true,
        element: <Home />
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

  useEffect(() => {
    if (accessToken) {
      dispatch(fetchUserProfile())
    } else {
      dispatch(removeProfile())
    }
  }, [dispatch, accessToken])

  if (isLoadingProfile) {
    return (
      <div className='h-screen'>
        <Loading size='large' />
      </div>
    )
  }
  return <RouterProvider router={router} />
}

export default App
