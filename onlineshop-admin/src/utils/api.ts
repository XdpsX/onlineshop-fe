import axios from 'axios'
import store from '~/store'
import { logout } from '~/store/features/authSlice'

const api = axios.create({
  baseURL: 'http://localhost:8080',
  headers: {
    'Accept-Language': 'vi'
  }
})

api.interceptors.request.use(
  async (config) => {
    const accessToken = localStorage.getItem('accessToken')
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

api.interceptors.response.use(
  (response) => {
    return response
  },
  (error) => {
    const { response } = error
    if (response && response.status === 401) {
      const accessToken = localStorage.getItem('accessToken')
      if (accessToken) {
        store.dispatch(logout())
      }
    }
    return Promise.reject(error)
  }
)

export default api
