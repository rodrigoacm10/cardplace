// src/stores/collection.ts
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import api from '@/lib/api'
import { useAuthStore } from './auth'
import type { Card } from './auth'

export const useCollectionStore = defineStore('collection', () => {
  const myCards = ref<Card[]>([])
  const isLoading = ref(false)

  const myCardsCount = computed(() => myCards.value.length)

  async function fetchMyCollection() {
    isLoading.value = true
    try {
      const response = await api.get('/me')

      const authStore = useAuthStore()
      authStore.user = {
        id: response.data.id,
        name: response.data.name,
        email: response.data.email,
        avatarUrl: response.data.avatarUrl,
      }

      myCards.value = response.data.cards || []
    } catch (error: any) {
      console.error('Erro ao buscar a coleção do usuário:', error)

      // Desloga APENAS se o erro for 401 (Não autorizado/Token inválido)
      if (error.response && error.response.status === 401) {
        const authStore = useAuthStore()
        authStore.logout()
      }
    } finally {
      isLoading.value = false
    }
  }

  return {
    myCards,
    isLoading,
    myCardsCount,
    fetchMyCollection,
  }
})
