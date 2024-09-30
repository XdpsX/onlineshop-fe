import { Navigate } from 'react-router-dom'
import { useAppSelector } from '../../app/hooks'
import { selectAuth } from '../../features/auth/authSlice'

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { accessToken } = useAppSelector(selectAuth)
  if (!accessToken) {
    return <Navigate to='/login' replace={true} />
  }
  return children
}
export default ProtectedRoute
