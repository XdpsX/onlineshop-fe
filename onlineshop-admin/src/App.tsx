import { useEffect, useState } from 'react'
import { Loader, PageTitle } from './components/common'
import MainLayout from './layouts/MainLayout'
import { Route, Routes } from 'react-router-dom'
import { Brands, Categories, CreateProduct, EditProduct, LoginPage, Products } from './pages'
import ProtectedRoute from './components/layout/ProtectedRoute'

function App() {
  const [loading, setLoading] = useState<boolean>(true)

  useEffect(() => {
    setTimeout(() => setLoading(false), 1000)
  }, [])

  return loading ? (
    <Loader />
  ) : (
    <Routes>
      <Route
        path='/login'
        element={
          <>
            <PageTitle title='Đăng nhập | OnlineShop' />
            <LoginPage />
          </>
        }
      />
      <Route
        path='/'
        element={
          <ProtectedRoute>
            <MainLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<div>Hello World</div>} />
        <Route
          path='/categories'
          element={
            <>
              <PageTitle title='Danh mục | OnlineShop' />
              <Categories />
            </>
          }
        />
        <Route
          path='/brands'
          element={
            <>
              <PageTitle title='Thương hiệu | OnlineShop' />
              <Brands />
            </>
          }
        />
        <Route
          path='/products/list'
          element={
            <>
              <PageTitle title='Sản phẩm | OnlineShop' />
              <Products />
            </>
          }
        />
        <Route
          path='/products/new'
          element={
            <>
              <PageTitle title='Thêm sản phẩm | OnlineShop' />
              <CreateProduct />
            </>
          }
        />
        <Route
          path='/products/edit'
          element={
            <>
              <PageTitle title='Sửa sản phẩm | OnlineShop' />
              <EditProduct />
            </>
          }
        />
      </Route>
    </Routes>
  )
}

export default App
