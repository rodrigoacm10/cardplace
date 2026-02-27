<script setup lang="ts">
import { onMounted } from 'vue'
import { useCardsStore } from '@/stores/cards'
import { Button } from '@/components/ui/button'
import CardContainer from '@/components/CardContainer.vue'

const cardsStore = useCardsStore()

onMounted(() => {
  cardsStore.fetchCards(true)
})
</script>

<template>
  <div class="min-h-screen text-black p-8">
    <div class="max-w-6xl mx-auto">
      <header class="flex justify-between items-center mb-8">
        <div>
          <h1 class="text-[#128159] text-3xl font-bold">Marketplace</h1>
          <p class="text-zinc-500 font-medium">
            Veja todos os cards disponíveis para troca e compra
          </p>
        </div>
      </header>

      <div>
        <div
          v-if="cardsStore.isLoading && cardsStore.list.length === 0"
          class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
        >
          <div
            v-for="i in 8"
            :key="i"
            class="aspect-[472/687] rounded-xl bg-zinc-200 animate-pulse"
          ></div>
        </div>

        <div v-else class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          <CardContainer v-for="card in cardsStore.list" :key="card.id" :card="card" />
        </div>

        <div v-if="cardsStore.hasMore" class="flex justify-center mt-12">
          <Button
            @click="cardsStore.fetchCards(false)"
            :disabled="cardsStore.isLoading"
            class="bg-[#169366] text-white hover:bg-[#128159] px-8"
          >
            {{ cardsStore.isLoading ? 'Carregando...' : 'Carregar mais' }}
          </Button>
        </div>

        <div
          v-if="!cardsStore.isLoading && cardsStore.list.length === 0"
          class="text-center py-12 text-zinc-500"
        >
          Nenhuma carta disponível no marketplace no momento.
        </div>
      </div>
    </div>
  </div>
</template>
