import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import MainLayout from './components/layout/MainLayout'
import Home from './pages/Home'
import Login from './pages/auth/Login'
import Register from './pages/auth/Register'
import Error from './pages/Error'
import ProductsByCategory from './pages/ProductsByCategory'
import Cart from './pages/Cart'
import ProtectedRoute from './components/shared/ProtectedRoute'
import ProductDetailsPage from './pages/ProductDetailsPage'
import Shipping from './pages/Shipping'
import PaymentRedirect from './pages/PaymentRedirect'
import PaymentError from './pages/PaymentError'

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
      },
      {
        path: '/shipping',
        element: (
          <ProtectedRoute>
            <Shipping />
          </ProtectedRoute>
        )
      },

      {
        path: '/payments/error',
        element: (
          <ProtectedRoute>
            <PaymentError />
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
  },
  {
    path: '/payments/:orderId/redirect',
    element: (
      <ProtectedRoute>
        <PaymentRedirect />
      </ProtectedRoute>
    )
  }
])
function App() {
  return <RouterProvider router={router} />
}

export default App
