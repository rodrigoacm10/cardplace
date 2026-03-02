import api from '@/lib/api'
import type { Card, User } from '@/stores/auth'

export interface AddCardsData {
  cardIds: string[]
}

export interface UserWithCards extends User {
  cards: Card[]
}

export interface CollectionResponse {
  list: Card[]
  rpp: number
  page: number
  more: boolean
}

export const CollectionService = {
  async getMyCollection() {
    return api.get<UserWithCards>('/me')
  },

  async getMyCards() {
    return api.get<Card[]>('/me/cards')
  },

  async addCardsToCollection(data: AddCardsData) {
    return api.post('/me/cards', data)
  },
}
