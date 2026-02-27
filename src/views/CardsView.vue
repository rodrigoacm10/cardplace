<script setup lang="ts">
import { onMounted } from 'vue'
import { useCardsStore } from '@/stores/cards'
import { Button } from '@/components/ui/button'
import CardContainer from '@/components/CardContainer.vue'
import gsap from 'gsap'

const cardsStore = useCardsStore()

onMounted(() => {
  cardsStore.fetchCards(true)
})

const onBeforeEnter = (el: Element) => {
  gsap.set(el, {
    opacity: 0,
    y: 120,
  })
}

const onEnter = (el: Element, done: () => void) => {
  const htmlElement = el as HTMLElement

  const index = htmlElement.dataset.index !== undefined ? Number(htmlElement.dataset.index) : 0

  gsap.to(el, {
    opacity: 1,
    y: 0,
    duration: 0.5,
    delay: index * 0.2,
    ease: 'power2.out',
    onComplete: done,
  })
}
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

        <transition-group
          v-else
          appear
          tag="div"
          class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
          @before-enter="onBeforeEnter"
          @enter="onEnter"
          :css="false"
        >
          <CardContainer
            v-for="(card, index) in cardsStore.list"
            :key="card.id"
            :card="card"
            :data-index="index % 10"
          />
        </transition-group>

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
