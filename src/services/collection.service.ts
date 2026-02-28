import api from '@/lib/api'

export interface AddCardsData {
  cardIds: string[]
}

export const CollectionService = {
  async getMyCollection() {
    return api.get('/me')
  },

  async addCardsToCollection(data: AddCardsData) {
    return api.post('/me/cards', data)
  },
}
