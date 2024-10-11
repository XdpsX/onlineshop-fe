import { useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useAppDispatch } from '../app/hooks'
import { setToken } from '../features/auth/authSlice'

function OAuth2RedirectHandler() {
  const navigate = useNavigate()
  const location = useLocation()
  const dispatch = useAppDispatch()

  useEffect(() => {
    const params = new URLSearchParams(location.search)
    const token = params.get('token')
    console.log('OAuth2RedirectHandler: Params:', params.toString())
    console.log('OAuth2RedirectHandler: Token:', token)

    if (token) {
      try {
        dispatch(setToken(token))
        // Delay navigation to ensure local storage operations complete
        setTimeout(() => {
          navigate('/')
        }, 100) // 100ms delay
      } catch (error) {
        console.error('Token decoding failed:', error)
        navigate('/login')
      }
    } else {
      console.log('Token not found in URL, redirecting to login')
      navigate('/login')
    }
  }, [location, navigate, dispatch])

  return <div>OAuth2RedirectHandler</div>
}
export default OAuth2RedirectHandler
