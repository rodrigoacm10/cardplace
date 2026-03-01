<script setup lang="ts">
import { ref, computed } from 'vue'
import { useInfiniteQuery, useMutation, useQueryClient } from '@tanstack/vue-query'
import { TradeService, type Trade } from '@/services/trade.service'
import { ArrowRight, History, User, Calendar, Trash2, Loader2 } from 'lucide-vue-next'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { useIntersectionObserver } from '@vueuse/core'
import { toast } from 'vue-sonner'
import TradeDetailsDialog from '@/components/TradeDetailsDialog.vue'
import TradeDeleteDialog from '@/components/TradeDeleteDialog.vue'

const loadMoreRef = ref<HTMLElement | null>(null)

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
  } catch (e) {
    return dateString
  }
}

const queryClient = useQueryClient()
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
</script>

<template>
  <div class="min-h-screen p-6">
    <div class="max-w-6xl mx-auto">
      <header class="flex justify-between items-center mb-8">
        <div>
          <h1 class="text-[#128159] text-3xl font-bold">Histórico de Trocas</h1>
          <p class="text-zinc-500 font-medium">Acompanhe todas as negociações realizadas</p>
        </div>
      </header>

      <div v-if="isLoading && trades.length === 0" class="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div
          v-for="i in 4"
          :key="i"
          class="bg-white border border-zinc-200 rounded-3xl p-6 animate-pulse"
        >
          <div class="flex justify-between mb-8">
            <div class="h-6 w-48 bg-zinc-100 rounded-full"></div>
            <div class="h-6 w-8 bg-zinc-100 rounded-lg"></div>
          </div>
          <div class="flex items-center justify-center gap-10">
            <div class="w-24 h-36 bg-zinc-100 rounded-2xl"></div>
            <div class="w-8 h-0.5 bg-zinc-100 rounded-full"></div>
            <div class="w-24 h-36 bg-zinc-100 rounded-2xl"></div>
          </div>
        </div>
      </div>

      <div
        v-else-if="isError && trades.length === 0"
        class="bg-red-50/50 border border-red-100 p-12 rounded-4xl text-center flex flex-col items-center"
      >
        <div
          class="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4 text-red-600"
        >
          <History class="w-8 h-8" />
        </div>
        <p class="text-red-600 font-bold text-lg">Erro ao carregar trocas</p>
        <p class="text-red-500/70 text-sm mt-1">Não foi possível sincronizar seu histórico.</p>
        <button
          @click="() => queryClient.invalidateQueries({ queryKey: ['trades'] })"
          class="mt-6 px-6 py-2 bg-red-600 text-white rounded-full text-sm font-bold shadow-md hover:bg-red-700 transition-colors"
        >
          Tentar novamente
        </button>
      </div>

      <div
        v-else-if="trades.length === 0"
        class="bg-white border border-zinc-200 p-12 rounded-3xl text-center flex flex-col items-center"
      >
        <div
          class="w-20 h-20 bg-zinc-50 rounded-full flex items-center justify-center text-zinc-300 mb-4"
        >
          <ArrowRight class="w-10 h-10" />
        </div>
        <h3 class="text-lg font-bold text-zinc-900">Nenhuma troca encontrada</h3>
        <p class="text-zinc-500 max-w-xs mx-auto mt-2">
          Você ainda não realizou nenhuma troca de cards.
        </p>
      </div>

      <div v-else class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div
          v-for="trade in trades"
          :key="trade.id"
          @click="openDetails(trade)"
          class="bg-white border border-zinc-100 rounded-4xl p-8 hover:shadow-2xl hover:border-[#169366]/20 transition-all group cursor-pointer relative overflow-hidden active:scale-[0.98]"
        >
          <div
            class="flex flex-wrap justify-between items-start gap-4 mb-6 pb-4 border-b border-zinc-100"
          >
            <div class="flex items-start flex-col gap-4">
              <div class="flex items-center gap-2 text-zinc-400 text-xs font-medium">
                <Calendar class="w-3.5 h-3.5" />
                {{ formatDate(trade.createdAt) }}
              </div>
              <div
                class="flex items-center gap-2 text-zinc-600 bg-zinc-50 px-3 py-1.5 rounded-full text-xs font-bold"
              >
                <User class="w-3.5 h-3.5" />
                {{ trade.user.name }}
              </div>
            </div>

            <button
              @click="confirmDelete($event, trade.id)"
              class="w-8 h-8 flex items-center justify-center rounded-lg text-zinc-400 hover:bg-red-50 hover:text-red-500 transition-colors"
              title="Deletar Troca"
            >
              <Trash2 class="w-4 h-4" />
            </button>
          </div>

          <div class="flex items-center justify-center gap-8 lg:gap-4">
            <div class="flex flex-col items-start gap-4">
              <span class="text-[10px] font-black uppercase tracking-widest text-zinc-400"
                >Oferecido</span
              >
              <div class="relative w-22 h-32 sm:w-30 sm:h-44">
                <div
                  v-for="(tc, index) in getOfferingCards(trade).slice(0, 3)"
                  :key="tc.id"
                  class="absolute inset-0 transition-transform duration-300 group-hover:scale-105"
                  :style="{
                    transform: `translate(${(index as number) * 6}px, ${(index as number) * 6}px) rotate(${(index as number) * 1.5}deg)`,
                    zIndex: 10 - (index as number),
                  }"
                >
                  <div
                    class="w-full h-full border border-zinc-200 bg-white overflow-hidden shadow-sm"
                  >
                    <img :src="tc.card.imageUrl" class="w-full h-full object-cover" />
                  </div>
                </div>

                <div
                  v-if="getOfferingCards(trade).length > 3"
                  class="absolute -bottom-2 -right-2 bg-zinc-900 text-white text-[10px] font-bold px-2 py-0.5 rounded-full z-20"
                >
                  +{{ getOfferingCards(trade).length - 3 }}
                </div>
              </div>
            </div>

            <div
              class="flex items-center justify-center text-zinc-200 group-hover:text-[#169366] transition-colors"
            >
              <ArrowRight class="w-8 h-8 stroke-[3px]" />
            </div>

            <div class="flex flex-col items-start gap-4" v-if="getReceivingCard(trade)">
              <span class="text-[10px] font-black uppercase tracking-widest text-zinc-400"
                >Recebido</span
              >
              <div
                class="w-22 h-32 sm:w-30 sm:h-44 border border-zinc-200 bg-white overflow-hidden shadow-sm transition-transform duration-300 group-hover:scale-105"
              >
                <img
                  :src="getReceivingCard(trade)?.card?.imageUrl"
                  class="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div
        ref="loadMoreRef"
        class="flex flex-col items-center justify-center mt-20 py-10 transition-all h-32"
        :class="{ 'opacity-0': !hasNextPage && !isFetchingNextPage }"
      >
        <div v-if="isFetchingNextPage" class="flex flex-col items-center gap-4">
          <div class="relative">
            <div
              class="w-10 h-10 rounded-full border-4 border-zinc-100 border-t-[#169366] animate-spin"
            ></div>
          </div>
          <span class="text-xs font-bold text-zinc-400 uppercase tracking-widest"
            >Sincronizando Histórico</span
          >
        </div>

        <div v-else-if="!hasNextPage && trades.length > 0" class="flex flex-col items-center gap-2">
          <div class="w-8 h-0.5 bg-zinc-100 rounded-full mb-4"></div>
          <span class="text-[10px] font-black text-zinc-300 uppercase tracking-[0.3em]"
            >Histórico completo</span
          >
        </div>
      </div>
    </div>
  </div>

  <TradeDetailsDialog v-model:isOpen="isDetailsOpen" :trade="selectedTrade" />

  <TradeDeleteDialog
    v-model:isOpen="isDeleteDialogOpen"
    :tradeId="tradeToDelete"
    :isPending="deleteMutation.isPending.value"
    @delete="handleDelete"
  />
</template>
