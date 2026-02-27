<script setup lang="ts">
import { Button } from '@/components/ui/button'

interface Card {
  id: string
  name: string
  description: string
  imageUrl: string
  createdAt: string
}

defineProps<{
  card: Card
}>()

const handleImageError = (event: Event) => {
  const target = event.target as HTMLImageElement
  target.src = 'https://via.placeholder.com/472x687?text=Sem+Imagem'
}
</script>

<template>
  <div
    class="rounded-xl bg-white border border-zinc-200 overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 flex flex-col h-full"
  >
    <div
      class="w-full aspect-[472/687] bg-zinc-100 flex items-center justify-center overflow-hidden p-2"
    >
      <img
        :src="card.imageUrl"
        :alt="card.name"
        class="object-contain w-full h-full drop-shadow-md"
        @error="handleImageError"
      />
    </div>

    <div class="p-4 flex flex-col flex-grow">
      <h2 class="text-lg font-bold text-[#169366] truncate" :title="card.name">
        {{ card.name }}
      </h2>

      <p class="text-sm text-zinc-500 mt-2 line-clamp-2 flex-grow">
        {{ card.description }}
      </p>

      <div class="mt-4 pt-4 border-t flex justify-end">
        <Button
          variant="outline"
          class="w-full text-[#169366] border-[#169366] hover:bg-[#169366] hover:text-white transition-colors"
        >
          Ver Detalhes
        </Button>
      </div>
    </div>
  </div>
</template>
