import { useEffect, useState } from 'react'
import { Loader } from './components/common'
import MainLayout from './layouts/MainLayout'

function App() {
  const [loading, setLoading] = useState<boolean>(true)

  useEffect(() => {
    setTimeout(() => setLoading(false), 1000)
  }, [])

  return loading ? (
    <Loader />
  ) : (
    <MainLayout>
      <h1>Hello World</h1>
    </MainLayout>
  )
}

export default App
