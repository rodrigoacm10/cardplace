import api from '@/lib/api'

export interface LoginCredentials {
  email: string
  password: string
}

export interface RegisterData {
  name: string
  email: string
  password: string
}

export const AuthService = {
  async login(credentials: LoginCredentials) {
    return api.post('/login', credentials)
  },

  async register(data: RegisterData) {
    return api.post('/register', data)
  },
}
