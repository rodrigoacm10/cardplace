import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

api.interceptors.request.use((config) => {
  // Agora procura o token nos dois lugares
  let token = localStorage.getItem('token') || sessionStorage.getItem('token')

  if (token === 'null') {
    token = null
  }

  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

export default api
