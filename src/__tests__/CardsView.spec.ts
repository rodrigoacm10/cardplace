import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import CardsView from '@/views/cards/CardsView.vue'
import { setupTestApp } from './test-utils'
import api from '@/lib/api'

vi.mock('@/lib/api', () => ({
  default: {
    get: vi.fn(),
    post: vi.fn(),
    interceptors: {
      request: { use: vi.fn() },
      response: { use: vi.fn() },
    },
  },
}))

describe('CardsView Integration', () => {
  beforeEach(() => {
    vi.clearAllMocks()

    class MockIntersectionObserver {
      observe() {}
      unobserve() {}
      disconnect() {}
    }
    window.IntersectionObserver = MockIntersectionObserver as any
  })

  it('fetches and displays cards on mount', async () => {
    const mockCards = {
      data: {
        list: [
          { id: '1', name: 'Card 1', description: 'Desc 1', imageUrl: 'url1' },
          { id: '2', name: 'Card 2', description: 'Desc 2', imageUrl: 'url2' },
        ],
        more: false,
      },
    }
    vi.mocked(api.get).mockResolvedValue(mockCards)

    const wrapper = mount(CardsView, {
      ...setupTestApp(),
      stubs: {
        CardContainer: true,
        transition: false,
        'transition-group': false,
        Library: true,
      },
    })

    expect(wrapper.find('.animate-pulse').exists()).toBe(true)

    await flushPromises()

    expect(api.get).toHaveBeenCalledWith('/cards', { params: expect.any(Object) })

    expect(wrapper.find('.animate-pulse').exists()).toBe(false)

    const cardContainers = wrapper.findAllComponents({ name: 'CardContainer' })
    expect(cardContainers.length).toBe(2)
  })
})
