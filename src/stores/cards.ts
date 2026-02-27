import { defineStore } from 'pinia'
import { ref } from 'vue'
import api from '@/lib/api'
import type { Card } from './auth'

export const useCardsStore = defineStore('cards', () => {
  const list = ref<Card[]>([])
  const isLoading = ref(false)
  const page = ref(1)
  const rpp = ref(10)
  const hasMore = ref(false)

  async function fetchCards(reset = false) {
    if (reset) {
      page.value = 1
      list.value = []
    }

    isLoading.value = true
    try {
      const response = await api.get('/cards', {
        params: {
          page: page.value,
          rpp: rpp.value,
        },
      })

      if (reset) {
        list.value = response.data.list
      } else {
        list.value = [...list.value, ...response.data.list]
      }

      hasMore.value = response.data.more

      if (hasMore.value) {
        page.value++
      }
    } catch (error) {
      console.error('Erro ao buscar cartas do marketplace:', error)
    } finally {
      isLoading.value = false
    }
  }

  return {
    list,
    isLoading,
    hasMore,
    fetchCards,
  }
})
