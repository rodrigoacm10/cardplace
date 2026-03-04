import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import TradesView from '@/views/trades/TradesView.vue'
import { setupTestApp } from './test-utils'
import api from '@/lib/api'
import { setActivePinia, createPinia } from 'pinia'
import { useAuthStore } from '@/stores/auth'

vi.mock('@/lib/api', () => ({
  default: {
    get: vi.fn(),
    delete: vi.fn(),
    interceptors: {
      request: { use: vi.fn() },
      response: { use: vi.fn() },
    },
  },
}))

vi.mock('vue-router', async () => {
  const actual = await vi.importActual('vue-router')
  return {
    ...actual,
    useRouter: () => ({
      push: vi.fn(),
    }),
  }
})

describe('TradesView Integration (Critical Flow)', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    vi.clearAllMocks()

    const mockIntersectionObserver = vi.fn()
    class MockIntersectionObserver {
      observe() {}
      unobserve() {}
      disconnect() {}
    }
    window.IntersectionObserver = MockIntersectionObserver as any
  })

  it('fetches and renders a list of trades', async () => {
    const pinia = createPinia()
    setActivePinia(pinia)

    const authStore = useAuthStore()
    authStore.user = { id: 'user-1', name: 'Test User', email: 'test@test.com' }
    authStore.token = 'fake-jwt'

    const mockTrades = {
      data: {
        list: [
          {
            id: 'trade-1',
            userId: 'user-1',
            createdAt: '2024-02-15T17:15:08.807Z',
            user: { name: 'Test User' },
            tradeCards: [
              { type: 'OFFERING', card: { imageUrl: 'url1' } },
              { type: 'RECEIVING', card: { imageUrl: 'url2' } },
            ],
          },
        ],
        more: false,
      },
    }
    vi.mocked(api.get).mockResolvedValue(mockTrades)

    const wrapper = mount(TradesView, {
      ...setupTestApp(pinia),
      stubs: {
        TradeButton: true,
        TradeDetailsDialog: true,
        TradeDeleteDialog: true,
        ArrowRight: true,
        History: true,
        User: true,
        Calendar: true,
        Trash2: true,
        ArrowLeftRight: true,
      },
    })

    expect(wrapper.find('.animate-pulse').exists()).toBe(true)

    await flushPromises()

    expect(api.get).toHaveBeenCalledWith('/trades', { params: expect.any(Object) })

    const deleteButtons = wrapper.findAll('button[title="Deletar Troca"]')
    expect(deleteButtons.length).toBe(1)
  })
})
