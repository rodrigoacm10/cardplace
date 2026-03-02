<script setup lang="ts">
import { useQuery } from '@tanstack/vue-query'
import { CollectionService } from '@/services/collection.service'
import CardContainer from '@/components/cards/CardContainer.vue'
import { Library } from 'lucide-vue-next'

import { useStaggerAnimation } from '@/composables/core/useStaggerAnimation'

const MAX_STAGGER_ITEMS = 12
const STAGGER_DELAY = 0.1

const {
  data: cards,
  isLoading,
  isError,
} = useQuery({
  queryKey: ['my-collection-cards'],
  queryFn: () => CollectionService.getMyCards().then((res) => res.data),
})

const { onBeforeEnter, onEnter } = useStaggerAnimation(MAX_STAGGER_ITEMS, STAGGER_DELAY)
</script>

<template>
  <div class="min-h-screen text-black p-8">
    <div class="max-w-6xl mx-auto">
      <header class="flex justify-between items-center mb-12">
        <div>
          <h1 class="text-app-green-dark text-4xl font-black tracking-tight mb-2">Minha Coleção</h1>
          <p class="text-zinc-500 font-medium">Sua biblioteca pessoal de cards colecionados</p>
        </div>
      </header>

      <div>
        <div
          v-if="isLoading"
          class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8"
        >
          <div
            v-for="i in 8"
            :key="i"
            class="aspect-472/687 rounded-3xl bg-zinc-100 animate-pulse border border-zinc-200"
          ></div>
        </div>

        <div v-else-if="isError" class="text-center py-20">
          <p class="text-red-500 font-bold">Erro ao carregar sua coleção.</p>
        </div>

        <div v-else-if="cards && cards.length > 0" class="w-full flex items-center justify-center">
          <transition-group
            appear
            tag="div"
            class="grid w-full grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8"
            @before-enter="onBeforeEnter"
            @enter="onEnter"
            :css="false"
          >
            <CardContainer
              v-for="(card, index) in cards"
              :key="card.id"
              :card="card"
              hide-trade
              :data-index="index"
            />
          </transition-group>
        </div>

        <div v-else class="text-center py-32 flex flex-col items-center">
          <div
            class="w-20 h-20 bg-zinc-50 rounded-full flex items-center justify-center mb-6 text-zinc-200 border border-zinc-100"
          >
            <Library class="w-10 h-10" />
          </div>
          <h2 class="text-xl font-bold text-zinc-900">Coleção Vazia</h2>
          <p class="text-zinc-500 mt-2">Você ainda não possui cards em sua coleção.</p>
          <router-link
            to="/cards"
            class="mt-8 px-8 py-3 bg-app-green text-white rounded-2xl text-sm font-bold shadow-lg hover:bg-app-green-dark transition-all hover:scale-105 active:scale-95"
          >
            Começar Coleção
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>
