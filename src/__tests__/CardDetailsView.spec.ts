import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import CardDetailsView from '@/views/cards/CardDetailsView.vue'
import { setupTestApp } from './test-utils'
import api from '@/lib/api'
import { setActivePinia, createPinia } from 'pinia'

vi.mock('@/lib/api', () => ({
  default: {
    get: vi.fn(),
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
    useRoute: () => ({
      params: { id: 'card-1' },
    }),
  }
})

describe('CardDetailsView Integration', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    vi.clearAllMocks()

    class MockIntersectionObserver {
      observe() {}
      unobserve() {}
      disconnect() {}
    }
    window.IntersectionObserver = MockIntersectionObserver as any
  })

  it('fetches and displays card details', async () => {
    const mockCard = {
      data: {
        id: 'card-1',
        name: 'Tornado Dragon',
        description: '2 Level 4 monsters. Once per turn...',
        imageUrl: 'https://images.ygoprodeck.com/images/cards/6983839.jpg',
        createdAt: '2025-07-10T19:21:16.853Z',
      },
    }

    const mockCollection = {
      data: {
        cards: [{ id: 'card-2', name: 'Other Card' }],
      },
    }

    vi.mocked(api.get).mockImplementation((url) => {
      if (url === '/cards/card-1') return Promise.resolve(mockCard)
      if (url === '/me') return Promise.resolve(mockCollection)
      return Promise.resolve({ data: {} })
    })

    const wrapper = mount(CardDetailsView, {
      ...setupTestApp(),
      stubs: {
        CardImage3D: true,
        BackPageButton: true,
        TradeButton: true,
        Calendar: true,
        Info: true,
        Loader2: true,
      },
    })

    expect(wrapper.find('.animate-spin').exists()).toBe(true)

    await flushPromises()

    expect(wrapper.find('.animate-spin').exists()).toBe(false)

    expect(wrapper.text()).toContain('Tornado Dragon')
    expect(wrapper.text()).toContain('2 Level 4 monsters')

    expect(api.get).toHaveBeenCalledWith('/cards/card-1')
    expect(api.get).toHaveBeenCalledWith('/me')
  })
})
