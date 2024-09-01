import { useEffect, useState } from 'react'
import { Loader, PageTitle } from './components/common'
import MainLayout from './layouts/MainLayout'
import { Route, Routes } from 'react-router-dom'
import { Categories } from './pages'

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
              <PageTitle title='Categories | OnlineShop' />
              <Categories />
            </>
          }
        />
      </Routes>
    </MainLayout>
  )
}

export default App
