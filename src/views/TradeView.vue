<script setup lang="ts">
import { ref, computed, nextTick } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ArrowLeftRight, Plus } from 'lucide-vue-next'
import CardSelectionDialog from '@/components/CardSelectionDialog.vue'
import CardImage3D from '@/components/global/CardImage3D.vue'

import { useTradeAnimation } from '@/composables/useTradeAnimation'
import { useTradeState } from '@/composables/useTradeState'
import BackPageButton from '@/components/global/BackPageButton.vue'

const route = useRoute()
const router = useRouter()

const shockwaveRef = ref<HTMLElement | null>(null)
const offeringRef = ref<HTMLElement | null>(null)
const receivingRef = ref<HTMLElement | null>(null)
const centralButtonRef = ref<HTMLElement | null>(null)

const receivingId = computed(() => route.query.receivingId as string)

const {
  receivingCard,
  isLoadingReceiving,
  myCards,
  offeringCardIds,
  offeringCards,
  isChoosingCard,
  isTrading,
  toggleCardSelection,
  performTradeMutation,
} = useTradeState(receivingId)

const { playTradeAnimation } = useTradeAnimation()

const tradeMutation = performTradeMutation(async () => {
  await nextTick()
  await playTradeAnimation({
    centralButton: centralButtonRef.value,
    shockwave: shockwaveRef.value,
    offering: offeringRef.value,
    receiving: receivingRef.value,
  })
  router.push('/cards')
})

const handleTrade = () => {
  if (offeringCardIds.value.length === 0 || !receivingId.value) return

  const offeringEntries = offeringCardIds.value.map((id) => ({
    cardId: id,
    type: 'OFFERING' as const,
  }))

  tradeMutation.mutate({
    cards: [...offeringEntries, { cardId: receivingId.value, type: 'RECEIVING' }],
  })
}
</script>

<template>
  <div class="min-h-screen bg-zinc-9 p-6 flex flex-col items-center">
    <div class="w-full max-w-6xl mb-12">
      <BackPageButton />

      <h1 class="text-2xl font-bold text-[#169366] uppercase tracking-widest text-center">
        Realizar Troca
      </h1>
    </div>

    <div
      class="w-full max-w-5xl grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] items-center gap-8 md:gap-16"
    >
      <div ref="offeringRef" class="flex flex-col items-center gap-6">
        <span class="text-zinc-500 font-bold uppercase tracking-wider text-sm">Você Oferece</span>

        <div
          @click="isChoosingCard = true"
          class="relative w-full aspect-472/687 max-w-[300px] flex items-center justify-center cursor-pointer group"
        >
          <template v-if="offeringCards.length > 0">
            <div class="relative w-full h-full">
              <div
                v-for="(card, index) in offeringCards.slice(0, 3)"
                :key="card.id"
                class="absolute inset-0 transition-transform duration-300"
                :style="{
                  transform: `translate(${(index as number) * 8}px, ${(index as number) * 8}px) rotate(${(index as number) * 2}deg)`,
                  zIndex: 3 - (index as number),
                  opacity: 1 - (index as number) * 0.1,
                }"
              >
                <CardImage3D
                  :image-url="card.imageUrl"
                  :alt="card.name"
                  :disable3d="true"
                  class="rounded-[inherit]"
                />
              </div>

              <div
                v-if="offeringCards.length > 3"
                class="absolute bottom-4 right-4 bg-zinc-900 border border-[#169366] text-[#169366] px-3 py-1 rounded-full text-sm font-bold shadow-xl z-10"
              >
                +{{ offeringCards.length - 3 }}
              </div>
            </div>

            <div
              class="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-2xl z-20"
            >
              <span class="text-white font-bold">Gerenciar Troca</span>
            </div>
          </template>
          <template v-else>
            <div
              class="w-full h-full rounded-2xl border-2 border-dashed border-zinc-800 bg-zinc-900/50 flex flex-col items-center justify-center hover:border-[#169366] hover:bg-zinc-900 transition-all"
            >
              <div
                class="w-12 h-12 rounded-full bg-zinc-800 flex items-center justify-center group-hover:bg-[#169366]/20 text-white group-hover:text-[#169366] transition-colors"
              >
                <Plus class="w-6 h-6" />
              </div>
              <span class="font-medium text-white">Escolha os cards</span>
            </div>
          </template>
        </div>
      </div>

      <div ref="centralButtonRef" class="flex flex-col items-center justify-center py-4 relative">
        <div
          v-show="isTrading"
          ref="shockwaveRef"
          class="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 rotate-45 border-[#169366] bg-[#169366]/10 z-100 pointer-events-none opacity-0"
        ></div>

        <button
          @click="handleTrade"
          :disabled="offeringCardIds.length === 0 || tradeMutation.isPending.value"
          class="relative w-24 h-24 md:w-32 md:h-32 rotate-45 border-4 border-[#169366] bg-[#4e4e4d] flex items-center justify-center transition-all enabled:hover:scale-110 enabled:hover:shadow-[0_0_30px_rgba(22,147,102,0.4)] disabled:opacity-50 disabled:border-zinc-700 group overflow-hidden shadow-2xl"
        >
          <div
            class="absolute inset-0 bg-[#169366] -translate-x-full group-hover:translate-x-0 transition-transform duration-500"
          ></div>
          <div class="relative -rotate-45 flex flex-col items-center text-white">
            <ArrowLeftRight class="w-6 h-6 md:w-8 md:h-8 mb-1" />
            <span class="text-[10px] md:text-xs font-black uppercase tracking-tighter">Trade</span>
          </div>
        </button>
      </div>

      <div ref="receivingRef" class="flex flex-col items-center gap-6">
        <span class="text-zinc-500 font-bold uppercase tracking-wider text-sm">Você Recebe</span>

        <div
          class="w-full aspect-472/687 max-w-[300px] flex items-center justify-center overflow-visible"
        >
          <template v-if="isLoadingReceiving">
            <div class="w-full h-full animate-pulse bg-zinc-800 rounded-2xl"></div>
          </template>
          <template v-else-if="receivingCard">
            <CardImage3D
              :image-url="receivingCard.imageUrl"
              :alt="receivingCard.name"
              class="rounded-2xl"
            />
          </template>
          <template v-else>
            <span class="text-zinc-500">Card não encontrado</span>
          </template>
        </div>
      </div>
    </div>

    <CardSelectionDialog
      v-model:isOpen="isChoosingCard"
      :cards="myCards"
      :selectedIds="offeringCardIds"
      @toggleSelection="toggleCardSelection"
    />
  </div>
</template>
