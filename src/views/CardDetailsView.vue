<script setup lang="ts">
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useQuery } from '@tanstack/vue-query'
import { CardsService } from '@/services/cards.service'
import { ChevronLeft, Calendar, Info, Loader2, ArrowLeftRight } from 'lucide-vue-next'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { Button } from '@/components/ui/button'
import CardImage3D from '@/components/global/CardImage3D.vue'

import { useCardDetailsAnimation } from '@/composables/useCardDetailsAnimation'

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

useCardDetailsAnimation(cardImageRef, cardInfoRef)
</script>

<template>
  <div class="min-h-screen bg-[#fafafa] p-6 lg:p-12">
    <div class="max-w-6xl mx-auto">
      <button
        @click="router.back()"
        class="flex items-center gap-2 text-zinc-500 hover:text-zinc-900 transition-colors mb-8 group"
      >
        <div
          class="w-8 h-8 rounded-full bg-white shadow-sm flex items-center justify-center group-hover:scale-110 transition-transform border border-zinc-100"
        >
          <ChevronLeft class="w-5 h-5" />
        </div>
        <span class="text-sm font-bold">Voltar</span>
      </button>

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
        <Button class="mt-8 bg-[#169366] hover:bg-[#128159]" @click="router.push('/cards')">
          Ir para o Marketplace
        </Button>
      </div>

      <div v-else-if="isLoading" class="flex flex-col items-center justify-center py-40">
        <Loader2 class="w-12 h-12 text-[#169366] animate-spin" />
        <p class="text-zinc-400 mt-4 font-medium">Carregando detalhes do card...</p>
      </div>

      <div
        v-else-if="card"
        class="px-6 sm:px-20 lg:p-0 grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center"
      >
        <div ref="cardImageRef" class="relative group aspect-472/687">
          <CardImage3D
            :image-url="card.imageUrl"
            :alt="card.name"
            class="shadow-[0_40px_80px_-15px_rgba(0,0,0,0.3)] rounded-3xl"
          />
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
            <h3 class="text-xs font-black uppercase tracking-[0.2em] text-[#169366] mb-4">
              Descrição da Habilidade
            </h3>
            <p class="text-zinc-600 md:text-l leading-relaxed font-medium">
              {{ card.description }}
            </p>
          </div>

          <div class="flex flex-col sm:flex-row gap-4 pt-4">
            <Button
              class="w-full h-12 px-10 bg-[#e25b39] hover:bg-[#ce4d2c] text-white rounded-2xl text-lg font-bold shadow-xl shadow-orange-100 group transition-all hover:scale-105 active:scale-95"
              @click="router.push({ path: '/trade', query: { receivingId: card.id } })"
            >
              <ArrowLeftRight
                class="w-6 h-6 mr-3 group-hover:rotate-180 transition-transform duration-500"
              />
              Trocar
            </Button>
          </div>

          <p class="text-xs text-zinc-400 font-medium px-2 italic">
            * Inicie uma troca oferecendo seus cards em troca deste card.
          </p>
        </div>
      </div>
    </div>
  </div>
</template>
