import { useEffect } from 'react'
import { Navigate } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '~/store'
import { selectAuth } from '~/store/features/authSlice'
import { getProfileThunk, selectUser } from '~/store/features/userSlice'
import { Loader } from '../common'

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const dispatch = useAppDispatch()
  const { accessToken } = useAppSelector(selectAuth)
  const {
    loading: { getProfileThunk: isLoadingProfile }
  } = useAppSelector(selectUser)

  useEffect(() => {
    dispatch(getProfileThunk())
  }, [dispatch])

  if (!accessToken) {
    return <Navigate to='/login' />
  }

  if (isLoadingProfile) {
    return <Loader />
  }

  return children
}
export default ProtectedRoute
