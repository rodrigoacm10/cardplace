import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { useStorage } from '@vueuse/core'
import axios from 'axios'
import { AuthService, type LoginCredentials, type RegisterData } from '@/services/auth.service'

export interface Card {
  id: string
  name: string
  description: string
  imageUrl: string
  createdAt: string
}

export interface User {
  id: string
  name: string
  email: string
  avatarUrl?: string
}

export type AuthResponse = { success: true } | { success: false; message: string }

export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(null)

  const token = useStorage<string | null>('token', null)

  const isAuthenticated = computed(() => !!token.value && token.value !== 'null')

  const userInitials = computed(() => {
    if (!user.value?.name) return ''

    return user.value.name.substring(0, 2).toUpperCase()
  })

  async function login(
    credentials: LoginCredentials,
    rememberMe: boolean = false,
  ): Promise<AuthResponse> {
    try {
      const response = await AuthService.login(credentials)

      token.value = response.data.token
      user.value = response.data.user

      if (!rememberMe) {
        sessionStorage.setItem('token', response.data.token)
      }

      return { success: true }
    } catch (error: unknown) {
      let message = 'Erro ao realizar login'
      if (axios.isAxiosError(error) && error.response?.data?.message) {
        message = error.response.data.message
      }
      return {
        success: false,
        message,
      }
    }
  }

  async function register(data: RegisterData): Promise<AuthResponse> {
    try {
      await AuthService.register(data)
      return { success: true }
    } catch (error: unknown) {
      let message = 'Erro ao realizar cadastro'
      if (axios.isAxiosError(error) && error.response?.data?.message) {
        message = error.response.data.message
      }
      return {
        success: false,
        message,
      }
    }
  }

  function logout() {
    token.value = null
    user.value = null
    localStorage.removeItem('token')
    sessionStorage.removeItem('token')
  }

  return {
    user,
    token,
    isAuthenticated,
    userInitials,
    login,
    register,
    logout,
  }
})
