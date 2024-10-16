import axios from 'axios'
import { StoreType } from '../app/store'
import { ActionCreatorWithoutPayload } from '@reduxjs/toolkit'
import { API_BASE_URL } from '../constants'

let store: StoreType
let logout: ActionCreatorWithoutPayload<'auth/logout'>

export const injectStore = (_store: StoreType, _logout: ActionCreatorWithoutPayload<'auth/logout'>) => {
  store = _store
  logout = _logout
}

const api = axios.create({
  baseURL: API_BASE_URL,
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
        store.dispatch(logout())
      }
    }
    return Promise.reject(error)
  }
)

export default api
