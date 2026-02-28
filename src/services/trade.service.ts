import api from '@/lib/api'

export interface TradeCard {
  cardId: string
  type: 'OFFERING' | 'RECEIVING'
}

export interface CreateTradeData {
  cards: TradeCard[]
}

export const TradeService = {
  async createTrade(data: CreateTradeData) {
    return api.post('/trades', data)
  },
}
