import api from '@/lib/api'

export interface AddCardsData {
  cardIds: string[]
}

export interface CollectionResponse {
  list: any[]
  rpp: number
  page: number
  more: boolean
}

export const CollectionService = {
  async getMyCollection() {
    return api.get('/me')
  },

  async getMyCards() {
    return api.get<any[]>('/me/cards')
  },

  async addCardsToCollection(data: AddCardsData) {
    return api.post('/me/cards', data)
  },
}
