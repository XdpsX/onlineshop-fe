import axios from 'axios'

const api = axios.create({
  baseURL: 'http://localhost:8080',
  timeout: 10000,
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
        // LOGOUT
      }
    }
    return Promise.reject(error)
  }
)

export default api
