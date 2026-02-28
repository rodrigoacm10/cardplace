<script setup lang="ts">
import { ref, computed } from 'vue'
import { useQuery } from '@tanstack/vue-query'
import { TradeService, type Trade } from '@/services/trade.service'
import { ArrowRight, History, User, Calendar } from 'lucide-vue-next'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import TradeDetailsDialog from '@/components/TradeDetailsDialog.vue'

const {
  data: tradesData,
  isLoading,
  isError,
} = useQuery({
  queryKey: ['trades'],
  queryFn: () => TradeService.getTrades().then((res) => res.data),
})

const trades = computed(() => tradesData.value?.list || [])

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

const isDetailsOpen = ref(false)
const selectedTrade = ref<Trade | null>(null)

const openDetails = (trade: Trade) => {
  selectedTrade.value = trade
  isDetailsOpen.value = true
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

      <div v-if="isLoading" class="grid gap-6">
        <div
          v-for="i in 3"
          :key="i"
          class="bg-white border border-zinc-200 rounded-3xl p-6 animate-pulse"
        >
          <div class="h-6 w-48 bg-zinc-100 rounded mb-4"></div>
          <div class="flex items-center gap-8">
            <div class="w-32 h-44 bg-zinc-100 rounded-xl"></div>
            <div class="w-8 h-8 bg-zinc-100 rounded-full"></div>
            <div class="w-32 h-44 bg-zinc-100 rounded-xl"></div>
          </div>
        </div>
      </div>

      <div v-else-if="isError" class="bg-red-50 border border-red-100 p-8 rounded-3xl text-center">
        <p class="text-red-600 font-medium">Ocorreu um erro ao carregar as trocas.</p>
        <button @click="() => {}" class="mt-4 text-sm font-bold text-red-700 underline">
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
          class="bg-white border border-zinc-200 rounded-3xl p-6 hover:shadow-xl hover:border-[#169366]/30 transition-all group cursor-pointer"
        >
          <div
            class="flex flex-wrap justify-between items-center gap-4 mb-6 pb-4 border-b border-zinc-100"
          >
            <div class="flex items-center gap-4">
              <div
                class="flex items-center gap-2 text-zinc-600 bg-zinc-50 px-3 py-1.5 rounded-full text-xs font-bold"
              >
                <User class="w-3.5 h-3.5" />
                {{ trade.user.name }}
              </div>
              <div class="flex items-center gap-2 text-zinc-400 text-xs font-medium">
                <Calendar class="w-3.5 h-3.5" />
                {{ formatDate(trade.createdAt) }}
              </div>
            </div>
            <div
              class="text-[#169366] text-xs font-black uppercase tracking-widest bg-[#169366]/5 px-3 py-1 rounded-full"
            >
              Troca Concluída
            </div>
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
    </div>

    <TradeDetailsDialog v-model:isOpen="isDetailsOpen" :trade="selectedTrade" />
  </div>
</template>
