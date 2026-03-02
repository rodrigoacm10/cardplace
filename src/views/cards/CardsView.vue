<script setup lang="ts">
import { ref } from 'vue'
import CardContainer from '@/components/cards/CardContainer.vue'
import { Library } from 'lucide-vue-next'

import { useCardsState } from '@/composables/cards/useCardsState'
import { useStaggerAnimation } from '@/composables/core/useStaggerAnimation'

const MAX_STAGGER_ITEMS = 12
const STAGGER_DELAY = 0.1

const loadMoreRef = ref<HTMLElement | null>(null)

const { allCards, isLoading, hasNextPage, isFetchingNextPage } = useCardsState(
  loadMoreRef,
  MAX_STAGGER_ITEMS,
)

const { onBeforeEnter, onEnter } = useStaggerAnimation(MAX_STAGGER_ITEMS, STAGGER_DELAY)
</script>

<template>
  <div class="min-h-screen text-black p-8">
    <div class="max-w-6xl mx-auto">
      <header class="flex justify-between items-center mb-12">
        <div>
          <h1 class="text-app-green-dark text-4xl font-black tracking-tight mb-2">
            Todas as cartas
          </h1>
          <p class="text-zinc-500 font-medium">
            Explore e colecione os cards mais raros e poderosos
          </p>
          <p class="text-zinc-500 text-xs">
            Clique ou passe o mouse sobre um card para ver mais detalhes
          </p>
        </div>
      </header>

      <div>
        <div
          v-if="isLoading && allCards.length === 0"
          class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8"
        >
          <div
            v-for="i in 8"
            :key="i"
            class="aspect-[472/687] rounded-3xl bg-zinc-100 animate-pulse border border-zinc-200"
          ></div>
        </div>

        <div v-else class="w-full flex items-center justify-center">
          <transition-group
            appear
            tag="div"
            class="grid w-full grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8"
            @before-enter="onBeforeEnter"
            @enter="onEnter"
            :css="false"
          >
            <CardContainer
              v-for="(card, index) in allCards"
              :key="card.id"
              :card="card"
              :data-index="index"
            />
          </transition-group>
        </div>

        <div
          ref="loadMoreRef"
          class="flex flex-col items-center justify-center mt-20 py-10 transition-all"
          :class="{ 'opacity-0 h-0': !hasNextPage && !isFetchingNextPage }"
        >
          <div v-if="isFetchingNextPage" class="flex flex-col items-center gap-4">
            <div class="relative">
              <div
                class="w-12 h-12 rounded-full border-4 border-zinc-100 border-t-app-green animate-spin"
              ></div>
              <div class="absolute inset-0 flex items-center justify-center">
                <div class="w-2 h-2 bg-app-green rounded-full animate-ping"></div>
              </div>
            </div>
            <span class="text-sm font-bold text-zinc-400 uppercase tracking-widest"
              >Buscando mais cards</span
            >
          </div>

          <div
            v-else-if="!hasNextPage && allCards.length > 0"
            class="flex flex-col items-center gap-2"
          >
            <div class="w-12 h-0.5 bg-zinc-100 rounded-full mb-4"></div>
            <span class="text-xs font-black text-zinc-300 uppercase tracking-[0.3em]"
              >Você chegou ao fim</span
            >
          </div>
        </div>

        <div
          v-if="!isLoading && allCards.length === 0"
          class="text-center py-32 flex flex-col items-center"
        >
          <div
            class="w-20 h-20 bg-zinc-50 rounded-full flex items-center justify-center mb-6 text-zinc-200 border border-zinc-100"
          >
            <Library class="w-10 h-10" />
          </div>
          <h2 class="text-xl font-bold text-zinc-900">Nenhum card encontrado</h2>
          <p class="text-zinc-500 mt-2">Parece que ainda não temos cards no marketplace.</p>
        </div>
      </div>
    </div>
  </div>
</template>
