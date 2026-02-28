<script setup lang="ts">
import { ref, computed } from 'vue'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Check, Search, X } from 'lucide-vue-next'

interface Card {
  id: string
  name: string
  imageUrl: string
}

const props = defineProps<{
  isOpen: boolean
  cards: Card[]
  selectedIds: string[]
}>()

const emit = defineEmits(['update:isOpen', 'toggleSelection'])

const searchQuery = ref('')

const filteredCards = computed(() => {
  if (!searchQuery.value) return props.cards
  const query = searchQuery.value.toLowerCase()
  return props.cards.filter((card) => card.name.toLowerCase().includes(query))
})

const toggleSelection = (id: string) => {
  emit('toggleSelection', id)
}
</script>

<template>
  <Dialog :open="isOpen" @update:open="emit('update:isOpen', $event)">
    <DialogContent
      class="w-[92vw] max-w-4xl max-h-[85vh] flex flex-col p-0 overflow-hidden bg-white border-[#eaeaea] rounded-3xl gap-0 shadow-2xl"
    >
      <DialogHeader class="p-6 border-b border-[#eaeaea] shrink-0 space-y-4">
        <div class="flex justify-between items-center">
          <DialogTitle class="text-xl font-bold text-[#169366]">Sua Coleção</DialogTitle>
        </div>

        <div class="relative">
          <Search class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
          <Input
            v-model="searchQuery"
            placeholder="Pesquisar cartas..."
            class="pl-10 h-10 bg-zinc-50 border-[#eaeaea] focus-visible:ring-[#169366]/20 transition-all rounded-xl"
          />
          <button
            v-if="searchQuery"
            @click="searchQuery = ''"
            class="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 transition-colors"
          >
            <X class="w-4 h-4" />
          </button>
        </div>
      </DialogHeader>

      <div
        class="grow overflow-y-auto p-6 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6"
      >
        <div
          v-for="card in filteredCards"
          :key="card.id"
          @click="toggleSelection(card.id)"
          class="flex flex-col gap-2 group cursor-pointer"
        >
          <div
            class="relative aspect-472/687 overflow-hidden group-hover:ring-2 group-hover:ring-[#169366] transition-all"
          >
            <img :src="card.imageUrl" class="w-full h-full object-cover" />
            <div
              v-if="selectedIds.includes(card.id)"
              class="absolute top-2 right-2 bg-[#169366] rounded-full p-1 border-2 border-white shadow-xl z-20"
            >
              <Check class="w-4 h-4 text-white" />
            </div>

            <div
              class="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
            >
              <span class="text-white text-xs font-bold">
                {{ selectedIds.includes(card.id) ? 'Remover' : 'Selecionar' }}
              </span>
            </div>
          </div>
          <span
            class="text-xs font-bold text-zinc-600 truncate group-hover:text-[#169366] transition-colors px-1"
          >
            {{ card.name }}
          </span>
        </div>

        <div
          v-if="filteredCards.length === 0"
          class="col-span-full py-12 flex flex-col items-center justify-center text-zinc-400 gap-3"
        >
          <Search class="w-12 h-12 opacity-20" />
          <p class="font-medium animate-pulse">Nenhum card encontrado para "{{ searchQuery }}"</p>
        </div>
      </div>
    </DialogContent>
  </Dialog>
</template>
