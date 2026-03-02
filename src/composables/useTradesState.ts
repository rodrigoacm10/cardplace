import { ref, computed, type Ref } from 'vue'
import { useInfiniteQuery, useMutation, useQueryClient } from '@tanstack/vue-query'
import { TradeService, type Trade } from '@/services/trade.service'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { useIntersectionObserver } from '@vueuse/core'
import { toast } from 'vue-sonner'

export function useTradesState(loadMoreRef: Ref<HTMLElement | null>) {
  const queryClient = useQueryClient()

  const {
    data: tradesData,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
  } = useInfiniteQuery({
    queryKey: ['trades'],
    queryFn: ({ pageParam = 1 }) =>
      TradeService.getTrades({ page: pageParam as number, rpp: 10 }).then((res) => res.data),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => (lastPage.more ? lastPage.page + 1 : undefined),
  })

  const trades = computed(() => tradesData.value?.pages.flatMap((page) => page.list) || [])

  useIntersectionObserver(
    loadMoreRef,
    (entries) => {
      const isIntersecting = entries[0]?.isIntersecting
      if (isIntersecting && hasNextPage.value && !isFetchingNextPage.value) {
        fetchNextPage()
      }
    },
    { threshold: 0.1 },
  )

  const getOfferingCards = (trade: Trade) => {
    return trade.tradeCards.filter((tc) => tc.type === 'OFFERING')
  }

  const getReceivingCard = (trade: Trade) => {
    return trade.tradeCards.find((tc) => tc.type === 'RECEIVING')
  }

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), "d 'de' MMMM, yyyy", { locale: ptBR })
    } catch {
      return dateString
    }
  }

  const isDetailsOpen = ref(false)
  const selectedTrade = ref<Trade | null>(null)

  const openDetails = (trade: Trade) => {
    selectedTrade.value = trade
    isDetailsOpen.value = true
  }

  const isDeleteDialogOpen = ref(false)
  const tradeToDelete = ref<string | null>(null)

  const confirmDelete = (e: Event, tradeId: string) => {
    e.stopPropagation()
    tradeToDelete.value = tradeId
    isDeleteDialogOpen.value = true
  }

  const deleteMutation = useMutation({
    mutationFn: (id: string) => TradeService.deleteTrade(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['trades'] })
      toast.success('Troca removida com sucesso!')
      isDeleteDialogOpen.value = false
      tradeToDelete.value = null
    },
    onError: () => {
      toast.error('Erro ao remover troca.')
    },
  })

  const handleDelete = () => {
    if (tradeToDelete.value) {
      deleteMutation.mutate(tradeToDelete.value)
    }
  }

  const retryFetch = () => {
    queryClient.invalidateQueries({ queryKey: ['trades'] })
  }

  return {
    trades,
    isLoading,
    isError,
    hasNextPage,
    isFetchingNextPage,
    getOfferingCards,
    getReceivingCard,
    formatDate,
    isDetailsOpen,
    selectedTrade,
    openDetails,
    isDeleteDialogOpen,
    tradeToDelete,
    confirmDelete,
    deleteMutation,
    handleDelete,
    retryFetch,
  }
}
