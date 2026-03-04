import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import TradeView from '@/views/trades/TradeView.vue'
import { setupTestApp } from './test-utils'
import api from '@/lib/api'
import { setActivePinia, createPinia } from 'pinia'
import { useAuthStore } from '@/stores/auth'

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

vi.mock('vue-router', async () => {
  const actual = await vi.importActual('vue-router')
  return {
    ...actual,
    useRouter: () => ({
      push: vi.fn(),
    }),
    useRoute: () => ({
      query: { receivingId: 'receive-1' },
    }),
  }
})

describe('TradeView Integration', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    vi.clearAllMocks()

    class MockIntersectionObserver {
      observe() {}
      unobserve() {}
      disconnect() {}
    }
    window.IntersectionObserver = MockIntersectionObserver as any

    const authStore = useAuthStore()
    authStore.user = { id: 'u1', name: 'Tester', email: 't@t.com' }
    authStore.token = 'tk'
  })

  it('renders creation flow and executes trade mutation', async () => {
    const mockReceivingCard = {
      data: { id: 'receive-1', name: 'To Receive', imageUrl: 'url-rec' },
    }

    const mockMyCards = {
      data: [{ id: 'offer-1', name: 'My Offering', imageUrl: 'url-off' }],
    }

    const mockAllCards = {
      data: { list: [mockReceivingCard.data], more: false },
    }

    const mockTradeCreation = {
      data: { tradeId: 't-123' },
    }

    vi.mocked(api.get).mockImplementation((url) => {
      if (url === '/cards/receive-1') return Promise.resolve(mockReceivingCard)
      if (url === '/me/cards') return Promise.resolve(mockMyCards)
      if (url === '/cards') return Promise.resolve(mockAllCards)
      return Promise.resolve({ data: {} })
    })
    vi.mocked(api.post).mockResolvedValue(mockTradeCreation)

    const wrapper = mount(TradeView, {
      ...setupTestApp(),
      stubs: {
        CardSelectionDialog: true,
        CardImage3D: true,
        BackPageButton: true,
        EmptyCard: true,
        ArrowLeftRight: true,
        Plus: true,
      },
    })

    await flushPromises()

    expect(wrapper.text()).toContain('Realizar Troca')

    const tradeButton = wrapper.find('button[class*="rotate-45"]')
    expect(tradeButton.attributes('disabled')).toBe('')

    const offeringCardContainer = wrapper.find('.group.cursor-pointer')
    if (offeringCardContainer.exists()) {
      await offeringCardContainer.trigger('click')
    }

    const dialogStub = wrapper.findComponent({ name: 'CardSelectionDialog' })
    if (dialogStub.exists()) {
      dialogStub.vm.$emit('toggleSelection', 'offer-1', 'OFFERING')
    }

    await flushPromises()

    expect(tradeButton.attributes('disabled')).toBeUndefined()

    await tradeButton.trigger('click')

    await flushPromises()

    expect(api.post).toHaveBeenCalledWith('/trades', {
      cards: [
        { cardId: 'offer-1', type: 'OFFERING' },
        { cardId: 'receive-1', type: 'RECEIVING' },
      ],
    })
  })
})
