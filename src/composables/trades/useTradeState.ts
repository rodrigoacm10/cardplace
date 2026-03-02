import { ref, computed, type Ref } from 'vue'
import { useQuery, useMutation, useQueryClient } from '@tanstack/vue-query'
import { CardsService } from '@/services/cards.service'
import { CollectionService } from '@/services/collection.service'
import { TradeService, type TradePayload } from '@/services/trade.service'
import { type Card } from '@/stores/auth'
import { toast } from 'vue-sonner'

export function useTradeState(initialReceivingId?: string) {
  const queryClient = useQueryClient()

  const receivingId = ref<string | undefined>(initialReceivingId)

  const { data: receivingCard, isLoading: isLoadingReceiving } = useQuery({
    queryKey: ['card', receivingId],
    queryFn: () => CardsService.getCardById(receivingId.value as string).then((res) => res.data),
    enabled: computed(() => !!receivingId.value),
  })

  const { data: myCollection, isLoading: isLoadingCollection } = useQuery({
    queryKey: ['my-collection'],
    queryFn: () => CollectionService.getMyCollection().then((res) => res.data),
  })

  const { data: cardsResponse, isLoading: isLoadingAllCards } = useQuery({
    queryKey: ['cards-bank'],
    queryFn: () => CardsService.getCards({ page: 1, rpp: 100000 }).then((res) => res.data),
  })

  const myCards = computed(() => myCollection.value?.cards || [])
  const allCards = computed(() => cardsResponse.value?.list || [])

  const availableReceivingCards = computed(() => {
    const ownedIds = new Set(myCards.value.map((c: Card) => c.id))
    return allCards.value.filter((c: Card) => !ownedIds.has(c.id))
  })

  const offeringCardIds = ref<string[]>([])

  const offeringCards = computed(() =>
    myCards.value.filter((c: Card) => offeringCardIds.value.includes(c.id)),
  )

  const isChoosingCard = ref(false)
  const isOfferingCard = ref(false)
  const isTrading = ref(false)

  const openOfferingCard = () => {
    isChoosingCard.value = true
    isOfferingCard.value = true
  }

  const openReceivingCard = () => {
    isChoosingCard.value = true
    isOfferingCard.value = false
  }

  const toggleCardSelection = (id: string) => {
    if (isOfferingCard.value) {
      const index = offeringCardIds.value.indexOf(id)
      if (index > -1) {
        offeringCardIds.value.splice(index, 1)
      } else {
        offeringCardIds.value.push(id)
      }
    } else {
      receivingId.value = id
      isChoosingCard.value = false
    }
  }

  const performTradeMutation = (onSuccessAnim: () => Promise<void>) => {
    return useMutation({
      mutationFn: (data: TradePayload) => TradeService.createTrade(data),
      onSuccess: async () => {
        isTrading.value = true
        toast.success('Troca realizada com sucesso!')
        queryClient.invalidateQueries({ queryKey: ['collection'] })

        await onSuccessAnim()
      },
      onError: () => {
        toast.error('Ocorreu um erro ao realizar a troca.')
      },
    })
  }

  return {
    receivingId,
    receivingCard,
    isLoadingReceiving,
    isLoadingCollection,
    isLoadingAllCards,
    myCards,
    allCards,
    availableReceivingCards,
    offeringCardIds,
    offeringCards,
    isChoosingCard,
    isTrading,
    isOfferingCard,
    toggleCardSelection,
    performTradeMutation,
    openOfferingCard,
    openReceivingCard,
  }
}
