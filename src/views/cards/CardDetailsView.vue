<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useQuery } from '@tanstack/vue-query'
import { CardsService } from '@/services/cards.service'
import { CollectionService } from '@/services/collection.service'
import { Calendar, Info, Loader2 } from 'lucide-vue-next'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { Button } from '@/components/ui/button'
import CardImage3D from '@/components/global/CardImage3D.vue'

import { useCardDetailsAnimation } from '@/composables/cards/useCardDetailsAnimation'
import BackPageButton from '@/components/global/BackPageButton.vue'
import TradeButton from '@/components/global/TradeButton.vue'

const route = useRoute()
const router = useRouter()
const cardId = route.params.id as string

const cardImageRef = ref<HTMLElement | null>(null)
const cardInfoRef = ref<HTMLElement | null>(null)

const {
  data: card,
  isLoading,
  isError,
} = useQuery({
  queryKey: ['card', cardId],
  queryFn: () => CardsService.getCardById(cardId).then((res) => res.data),
})

const formatDate = (dateString: string) => {
  try {
    return format(new Date(dateString), "d 'de' MMMM, yyyy", { locale: ptBR })
  } catch {
    return dateString
  }
}

const { data: myCollection } = useQuery({
  queryKey: ['collection'],
  queryFn: () => CollectionService.getMyCollection().then((res) => res.data),
})

const isCardOwned = computed(() => {
  return myCollection.value?.cards?.some((c: any) => c.id === cardId) || false
})

useCardDetailsAnimation(cardImageRef, cardInfoRef)
</script>

<template>
  <div class="min-h-screen p-6 lg:p-12">
    <div class="max-w-6xl mx-auto">
      <BackPageButton />

      <div v-if="isError" class="flex flex-col items-center justify-center py-20 text-center">
        <div
          class="w-20 h-20 bg-red-50 text-red-500 rounded-full flex items-center justify-center mb-6"
        >
          <Info class="w-10 h-10" />
        </div>
        <h2 class="text-2xl font-bold text-zinc-900">Card não encontrado</h2>
        <p class="text-zinc-500 mt-2 max-w-sm">
          Não conseguimos localizar as informações deste card. Verifique o ID ou tente novamente.
        </p>
        <Button class="mt-8 bg-app-green hover:bg-app-green-dark" @click="router.push('/cards')">
          Ir para o Marketplace
        </Button>
      </div>

      <div v-else-if="isLoading" class="flex flex-col items-center justify-center py-40">
        <Loader2 class="w-12 h-12 text-app-green animate-spin" />
        <p class="text-zinc-400 mt-4 font-medium">Carregando detalhes do card...</p>
      </div>

      <div
        v-else-if="card"
        class="px-6 sm:px-20 lg:p-0 grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center"
      >
        <div ref="cardImageRef" class="relative group aspect-472/687">
          <CardImage3D :image-url="card.imageUrl" :alt="card.name" />
        </div>

        <div ref="cardInfoRef" class="space-y-8">
          <div>
            <h1 class="text-3xl font-black text-zinc-900 leading-tight mb-4 tracking-tight">
              {{ card.name }}
            </h1>
            <div class="flex items-center gap-4 text-zinc-500">
              <div class="flex items-center gap-2">
                <Calendar class="w-4 h-4" />
                <span class="text-sm font-medium"
                  >Registrado em {{ formatDate(card.createdAt) }}</span
                >
              </div>
            </div>
          </div>

          <div
            class="p-8 bg-white rounded-4xl border border-zinc-100 shadow-sm relative overflow-hidden"
          >
            <div class="absolute top-0 right-0 p-4 opacity-5">
              <Info class="w-24 h-24" />
            </div>
            <h3 class="text-xs font-black uppercase tracking-[0.2em] text-app-green mb-4">
              Descrição da Habilidade
            </h3>
            <p class="text-zinc-600 md:text-l leading-relaxed font-medium">
              {{ card.description }}
            </p>
          </div>

          <div class="flex flex-col sm:flex-row gap-4 pt-4">
            <TradeButton :is-card-owned="isCardOwned" :card-id="card.id" />
          </div>

          <p class="text-xs text-zinc-400 font-medium px-2 italic">
            * Inicie uma troca oferecendo seus cards em troca deste card.
          </p>
        </div>
      </div>
    </div>
  </div>
</template>
