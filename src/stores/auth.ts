import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import api from '@/lib/api'

interface User {
  id: string
  name: string
  email: string
}

export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(null)
  const token = ref<string | null>(localStorage.getItem('token') || sessionStorage.getItem('token'))
  const isAuthenticated = computed(() => !!token.value)

  async function login(
    credentials: { email: string; password: string },
    rememberMe: boolean = false,
  ) {
    try {
      const response = await api.post('/login', credentials)
      token.value = response.data.token
      user.value = response.data.user

      const storage = rememberMe ? localStorage : sessionStorage
      storage.setItem('token', response.data.token)

      return { success: true }
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.message || 'Erro ao realizar login',
      }
    }
  }

  function logout() {
    token.value = null
    user.value = null
    localStorage.removeItem('token')
    sessionStorage.removeItem('token')
  }

  async function fetchMe() {
    if (!token.value) return
    try {
      const response = await api.get('/me')
      user.value = response.data
    } catch (error) {
      logout()
    }
  }

  async function register(data: { name: string; email: string; password: string }) {
    try {
      await api.post('/register', data)
      return { success: true }
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.message || 'Erro ao realizar registro',
      }
    }
  }

  return {
    user,
    token,
    isAuthenticated,
    login,
    register,
    logout,
    fetchMe,
  }
})
