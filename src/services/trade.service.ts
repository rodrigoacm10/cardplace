import api from '@/lib/api'

export interface TradeCard {
  id: string
  cardId: string
  tradeId: string
  type: 'OFFERING' | 'RECEIVING'
  card: {
    id: string
    name: string
    description: string
    imageUrl: string
    createdAt: string
  }
}

export interface Trade {
  id: string
  userId: string
  createdAt: string
  user: {
    name: string
  }
  tradeCards: TradeCard[]
}

export interface TradeResponse {
  list: Trade[]
  rpp: number
  page: number
  more: boolean
}

export interface GetTradesParams {
  rpp?: number
  page?: number
}

export interface TradePayload {
  cards: { cardId: string; type: 'OFFERING' | 'RECEIVING' }[]
}

export const TradeService = {
  async createTrade(data: TradePayload) {
    return api.post<Trade>('/trades', data)
  },
  async getTrades(params: GetTradesParams = { rpp: 10, page: 1 }) {
    return api.get<TradeResponse>('/trades', { params })
  },
  async deleteTrade(id: string) {
    return api.delete(`/trades/${id}`)
  },
}
