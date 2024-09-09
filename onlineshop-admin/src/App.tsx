import { useEffect, useState } from 'react'
import { Loader, PageTitle } from './components/common'
import MainLayout from './layouts/MainLayout'
import { Route, Routes } from 'react-router-dom'
import { Brands, Categories, Products } from './pages'

function App() {
  const [loading, setLoading] = useState<boolean>(true)

  useEffect(() => {
    setTimeout(() => setLoading(false), 1000)
  }, [])

  return loading ? (
    <Loader />
  ) : (
    <MainLayout>
      <Routes>
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
      </Routes>
    </MainLayout>
  )
}

export default App
