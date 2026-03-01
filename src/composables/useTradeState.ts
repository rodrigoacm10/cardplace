import { ref, computed, type Ref } from 'vue'
import { useQuery, useMutation, useQueryClient } from '@tanstack/vue-query'
import { CardsService } from '@/services/cards.service'
import { CollectionService } from '@/services/collection.service'
import { TradeService, type TradePayload } from '@/services/trade.service'
import { type Card } from '@/stores/auth'
import { toast } from 'vue-sonner'

export function useTradeState(receivingIdRef: Ref<string>) {
  const queryClient = useQueryClient()

  const { data: receivingCard, isLoading: isLoadingReceiving } = useQuery({
    queryKey: ['card', receivingIdRef],
    queryFn: () => CardsService.getCardById(receivingIdRef.value).then((res) => res.data),
    enabled: computed(() => !!receivingIdRef.value),
  })

  const { data: myCollection, isLoading: isLoadingCollection } = useQuery({
    queryKey: ['my-collection'],
    queryFn: () => CollectionService.getMyCollection().then((res) => res.data),
  })

  const myCards = computed(() => myCollection.value?.cards || [])
  const offeringCardIds = ref<string[]>([])

  const offeringCards = computed(() =>
    myCards.value.filter((c: Card) => offeringCardIds.value.includes(c.id)),
  )

  const isChoosingCard = ref(false)
  const isTrading = ref(false)

  const toggleCardSelection = (id: string) => {
    const index = offeringCardIds.value.indexOf(id)
    if (index > -1) {
      offeringCardIds.value.splice(index, 1)
    } else {
      offeringCardIds.value.push(id)
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
    receivingCard,
    isLoadingReceiving,
    isLoadingCollection,
    myCards,
    offeringCardIds,
    offeringCards,
    isChoosingCard,
    isTrading,
    toggleCardSelection,
    performTradeMutation,
  }
}
