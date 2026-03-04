import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import CollectionView from '@/views/cards/CollectionView.vue'
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

describe('CollectionView Integration', () => {
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

  it('fetches and displays user collection', async () => {
    const mockCollection = {
      data: [{ id: 'card-owner', name: 'My Own Card', description: 'desc', imageUrl: 'url' }],
    }

    vi.mocked(api.get).mockResolvedValue(mockCollection)

    const wrapper = mount(CollectionView, {
      ...setupTestApp(),
      stubs: {
        CardContainer: true,
        transition: false,
        'transition-group': false,
        Library: true,
        'router-link': true,
      },
    })

    expect(wrapper.find('.animate-pulse').exists()).toBe(true)

    await flushPromises()

    expect(api.get).toHaveBeenCalledWith('/me/cards')

    expect(wrapper.find('.animate-pulse').exists()).toBe(false)

    const cardContainers = wrapper.findAllComponents({ name: 'CardContainer' })
    expect(cardContainers.length).toBe(1)
  })

  it('displays empty state when collection is empty', async () => {
    const mockCollection = { data: [] }
    vi.mocked(api.get).mockResolvedValue(mockCollection)

    const wrapper = mount(CollectionView, {
      ...setupTestApp(),
      stubs: {
        CardContainer: true,
        transition: false,
        'transition-group': false,
        Library: true,
        'router-link': true,
      },
    })

    await flushPromises()

    expect(wrapper.text()).toContain('Coleção Vazia')
    expect(wrapper.text()).toContain('Você ainda não possui cards em sua coleção.')
  })
})
