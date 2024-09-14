import { Navigate } from 'react-router-dom'
import { useAppSelector } from '~/store'
import { selectAuth } from '~/store/features/authSlice'

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { accessToken } = useAppSelector(selectAuth)

  if (!accessToken) {
    return <Navigate to='/login' />
  }

  return children
}
export default ProtectedRoute
