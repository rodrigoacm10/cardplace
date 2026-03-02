<script setup lang="ts">
import { ref, watch, computed } from 'vue'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command'
import { Button } from '@/components/ui/button'
import { Plus, Check, Loader2 } from 'lucide-vue-next'
import { useQuery, useMutation, useQueryClient } from '@tanstack/vue-query'
import { CardsService } from '@/services/cards.service'
import { CollectionService } from '@/services/collection.service'

const queryClient = useQueryClient()
const isDialogOpen = ref(false)
const selectedCardIds = ref<string[]>([])

const { data: collectionData } = useQuery({
  queryKey: ['collection'],
  queryFn: () => CollectionService.getMyCollection().then((res) => res.data),
  enabled: isDialogOpen,
  staleTime: 1000 * 60 * 5,
})

const ownedCardIds = computed(() => {
  return collectionData.value?.cards?.map((c: any) => c.id) || []
})

const { data: cardsResponse, isLoading: isFetchingCards } = useQuery({
  queryKey: ['cards-bank'],
  queryFn: () => CardsService.getCards({ page: 1, rpp: 100000 }).then((res) => res.data),
  enabled: isDialogOpen,
  staleTime: 1000 * 60 * 5,
})

const allCards = computed(() => cardsResponse.value?.list || [])

const addCardsMutation = useMutation({
  mutationFn: (cardIds: string[]) => CollectionService.addCardsToCollection({ cardIds }),
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ['collection'] })
    isDialogOpen.value = false
    selectedCardIds.value = []
  },
  onError: (error) => {
    console.error('Erro ao adicionar cartas:', error)
  },
})

watch(isDialogOpen, (isOpen) => {
  if (!isOpen) {
    selectedCardIds.value = []
  }
})

const toggleCard = (id: string) => {
  const index = selectedCardIds.value.indexOf(id)
  if (index === -1) {
    selectedCardIds.value.push(id)
  } else {
    selectedCardIds.value.splice(index, 1)
  }
}

const handleAddCards = () => {
  if (selectedCardIds.value.length === 0) return
  addCardsMutation.mutate(selectedCardIds.value)
}
</script>

<template>
  <Dialog v-model:open="isDialogOpen">
    <DialogTrigger as-child>
      <Button
        class="mt-6 w-full max-w-[200px] bg-app-orange hover:bg-app-orange-dark text-white flex items-center gap-2"
      >
        <Plus class="w-4 h-4" />
        Adicionar Cartas
      </Button>
    </DialogTrigger>

    <DialogContent class="sm:max-w-[450px]">
      <DialogHeader>
        <DialogTitle class="text-app-green">Adicionar à Coleção</DialogTitle>
        <DialogDescription>
          Busque e selecione as cartas que deseja vincular ao seu perfil.
        </DialogDescription>
      </DialogHeader>

      <div class="py-4">
        <Command class="rounded-lg border border-zinc-200 shadow-sm overflow-hidden">
          <CommandInput placeholder="Buscar carta pelo nome..." class="border-none focus:ring-0" />

          <CommandList class="max-h-[250px] overflow-y-auto custom-scrollbar">
            <div
              v-if="isFetchingCards"
              class="py-6 text-center text-sm text-zinc-500 flex flex-col items-center gap-2"
            >
              <Loader2 class="w-5 h-5 animate-spin text-app-green" />
              Carregando banco de cartas...
            </div>

            <CommandEmpty v-else-if="!isFetchingCards">Nenhuma carta encontrada.</CommandEmpty>

            <CommandGroup v-if="!isFetchingCards" heading="Cartas Disponíveis">
              <CommandItem
                v-for="card in allCards"
                :key="card.id"
                :value="card.name"
                @select="ownedCardIds.includes(card.id) ? null : toggleCard(card.id)"
                :disabled="ownedCardIds.includes(card.id)"
                class="cursor-pointer aria-selected:bg-app-green/10 aria-selected:text-app-green"
                :class="{
                  'opacity-50 cursor-not-allowed': ownedCardIds.includes(card.id),
                }"
              >
                <div class="flex items-center gap-3 w-full">
                  <div
                    class="flex h-4 w-4 items-center justify-center rounded-[4px] border transition-colors"
                    :class="[
                      selectedCardIds.includes(card.id)
                        ? 'bg-app-green border-app-green text-white'
                        : 'border-zinc-300',
                      ownedCardIds.includes(card.id) ? 'bg-zinc-200 border-zinc-300' : '',
                    ]"
                  >
                    <Check
                      v-if="selectedCardIds.includes(card.id) || ownedCardIds.includes(card.id)"
                      class="h-3 w-3"
                    />
                  </div>

                  <img
                    :src="card.imageUrl"
                    class="w-6 h-8 object-cover rounded border"
                    alt=""
                    @error="'https://via.placeholder.com/30x40'"
                  />

                  <span
                    class="font-medium"
                    :class="{ 'text-zinc-400': ownedCardIds.includes(card.id) }"
                  >
                    {{ card.name }}
                    <span
                      v-if="ownedCardIds.includes(card.id)"
                      class="text-xs text-zinc-400 ml-2 font-normal"
                      >(Já possui)</span
                    >
                  </span>
                </div>
              </CommandItem>
            </CommandGroup>
          </CommandList>
        </Command>

        <div v-if="selectedCardIds.length > 0" class="mt-4">
          <p class="text-xs text-zinc-500 font-medium mb-2">
            {{ selectedCardIds.length }} carta(s) selecionada(s):
          </p>
        </div>
      </div>

      <DialogFooter>
        <Button
          variant="outline"
          @click="isDialogOpen = false"
          :disabled="addCardsMutation.isPending.value"
        >
          Cancelar
        </Button>
        <Button
          class="bg-app-green text-white hover:bg-app-green-dark min-w-[100px]"
          @click="handleAddCards"
          :disabled="addCardsMutation.isPending.value || selectedCardIds.length === 0"
        >
          <Loader2 v-if="addCardsMutation.isPending.value" class="w-4 h-4 mr-2 animate-spin" />
          {{ addCardsMutation.isPending.value ? 'Salvando...' : 'Concluir' }}
        </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
</template>
