<script setup lang="ts">
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { ArrowDown } from 'lucide-vue-next'
import { useRouter } from 'vue-router'
import type { Trade } from '@/services/trade.service'

defineProps<{
  isOpen: boolean
  trade: Trade | null
}>()

const emit = defineEmits(['update:isOpen'])
const router = useRouter()

const navigateToCard = (cardId: string) => {
  emit('update:isOpen', false)
  router.push(`/cards/${cardId}`)
}

const getOfferingCards = (trade: Trade) => {
  return trade.tradeCards.filter((tc) => tc.type === 'OFFERING')
}

const getReceivingCard = (trade: Trade) => {
  return trade.tradeCards.find((tc) => tc.type === 'RECEIVING')
}
</script>

<template>
  <Dialog :open="isOpen" @update:open="emit('update:isOpen', $event)">
    <DialogContent
      class="sm:max-w-[450px] md:max-w-2xl lg:max-w-4xl max-h-[90vh] overflow-hidden flex flex-col p-0 bg-white border-zinc-100 rounded-3xl gap-0 shadow-2xl"
    >
      <DialogHeader class="p-6 border-b border-zinc-100 shrink-0">
        <DialogTitle class="text-xl font-bold text-app-green">Detalhes da Troca</DialogTitle>
      </DialogHeader>

      <div class="grow overflow-y-auto p-8 flex flex-col items-center gap-10">
        <div class="w-full flex flex-col gap-6">
          <div class="flex items-center justify-between px-2">
            <span class="text-xs font-black uppercase tracking-[0.2em] text-zinc-400"
              >Cards Oferecidos</span
            >
            <span class="text-[10px] font-bold bg-zinc-100 text-zinc-500 px-2 py-0.5 rounded-full">
              {{ trade ? getOfferingCards(trade).length : 0 }} cards
            </span>
          </div>

          <div class="flex flex-wrap justify-center gap-4">
            <div
              v-for="tc in trade ? getOfferingCards(trade) : []"
              :key="tc.id"
              class="flex flex-col gap-2 w-24 sm:w-32"
            >
              <div
                @click="navigateToCard(tc.card.id)"
                class="aspect-472/687 overflow-hidden border border-zinc-100 shadow-sm transition-transform hover:scale-105 active:scale-95 cursor-pointer"
              >
                <img :src="tc.card.imageUrl" class="w-full h-full object-cover" />
              </div>
              <span class="text-[10px] font-bold text-zinc-500 truncate px-1 text-center">{{
                tc.card.name
              }}</span>
            </div>
          </div>
        </div>

        <div
          class="flex items-center justify-center w-12 h-12 rounded-full bg-app-green/5 text-app-green border border-app-green/10"
        >
          <ArrowDown class="w-6 h-6 stroke-[3px]" />
        </div>

        <div
          class="w-full flex flex-col items-center gap-6"
          v-if="trade && getReceivingCard(trade)"
        >
          <div class="w-full flex justify-center">
            <span class="text-xs font-black uppercase tracking-[0.2em] text-zinc-400"
              >Card Recebido</span
            >
          </div>

          <div class="flex flex-col items-center gap-4 w-44 sm:w-56">
            <div
              @click="navigateToCard(getReceivingCard(trade)!.card.id)"
              class="aspect-472/687 overflow-hidden shadow-2xl transition-transform hover:scale-105 cursor-pointer"
            >
              <img
                :src="getReceivingCard(trade)?.card?.imageUrl"
                class="w-full h-full object-cover"
              />
            </div>
            <div
              class="text-center px-4 py-2 bg-app-green/5 rounded-xl border border-app-green/10 w-full"
            >
              <span class="text-sm font-black text-zinc-900">{{
                getReceivingCard(trade)?.card?.name
              }}</span>
            </div>
          </div>
        </div>
      </div>
    </DialogContent>
  </Dialog>
</template>
