import { describe, it, expect, vi, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useAuthStore } from '@/stores/auth'
import api from '@/lib/api'

vi.mock('@/lib/api', () => ({
  default: {
    post: vi.fn(),
    get: vi.fn(),
    interceptors: {
      request: { use: vi.fn() },
      response: { use: vi.fn() },
    },
  },
}))

describe('Auth Store Integration', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    vi.clearAllMocks()
    localStorage.clear()
    sessionStorage.clear()
  })

  it('login sets token and user data on success', async () => {
    const authStore = useAuthStore()

    const mockResponse = {
      data: {
        token: 'fake-jwt',
        user: { id: '1', name: 'User 1', email: 'u1@test.com' },
      },
    }
    vi.mocked(api.post).mockResolvedValue(mockResponse)

    const result = await authStore.login({ email: 'u1@test.com', password: 'password' }, true)

    expect(api.post).toHaveBeenCalledWith('/login', { email: 'u1@test.com', password: 'password' })
    expect(result.success).toBe(true)
    expect(authStore.isAuthenticated).toBe(true)
    expect(authStore.token).toBe('fake-jwt')
    expect(authStore.user?.email).toBe('u1@test.com')
    expect(localStorage.getItem('token')).toBe('fake-jwt')
  })

  it('register calls API and returns success', async () => {
    const authStore = useAuthStore()

    vi.mocked(api.post).mockResolvedValue({ data: { userId: '2' } })

    const result = await authStore.register({
      name: 'Bob',
      email: 'bob@test.com',
      password: 'pass',
    })

    expect(api.post).toHaveBeenCalledWith('/register', {
      name: 'Bob',
      email: 'bob@test.com',
      password: 'pass',
    })
    expect(result.success).toBe(true)
  })

  it('logout clears state and storage', async () => {
    const authStore = useAuthStore()

    authStore.token = 'fake-jwt'
    authStore.user = { id: '1', name: 'User 1', email: 'u1@test.com' }
    localStorage.setItem('token', 'fake-jwt')

    authStore.logout()

    expect(authStore.isAuthenticated).toBe(false)
    expect(authStore.token).toBeNull()
    expect(authStore.user).toBeNull()
    expect(localStorage.getItem('token')).toBeNull()
    expect(sessionStorage.getItem('token')).toBeNull()
  })
})
