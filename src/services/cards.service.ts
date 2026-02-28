import api from '@/lib/api'

export interface GetCardsParams {
  page?: number
  rpp?: number
  name?: string
}

export const CardsService = {
  async getCards(params: GetCardsParams) {
    return api.get('/cards', { params })
  },
  async getCardById(id: string) {
    return api.get(`/cards/${id}`)
  },
}
