import axios from 'axios'

const api = axios.create({
  baseURL: 'http://localhost:8080',
  headers: {
    'Accept-Language': 'vi'
  }
})

export default api
