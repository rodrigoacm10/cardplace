<script setup lang="ts">
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Trash2, Loader2 } from 'lucide-vue-next'

interface Props {
  isOpen: boolean
  tradeId: string | null
  isPending: boolean
}

const props = defineProps<Props>()

const emit = defineEmits(['update:isOpen', 'delete'])

const handleDelete = () => {
  if (props.tradeId) {
    emit('delete', props.tradeId)
  }
}
</script>

<template>
  <Dialog :open="isOpen" @update:open="emit('update:isOpen', $event)">
    <DialogContent
      class="sm:max-w-[400px] p-0 bg-white border-zinc-100 rounded-3xl overflow-hidden shadow-2xl"
    >
      <div class="p-8 flex flex-col items-center text-center gap-6">
        <div class="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center text-red-500">
          <Trash2 class="w-8 h-8" />
        </div>
        <div class="space-y-2">
          <DialogTitle class="text-xl font-bold text-zinc-900">Tem certeza?</DialogTitle>
          <p class="text-zinc-500 text-sm">
            Esta ação não pode ser desfeita. A troca será permanentemente removida do seu histórico.
          </p>
        </div>
      </div>
      <div class="p-6 bg-zinc-50 flex gap-3 justify-center border-t border-zinc-100">
        <Button
          variant="outline"
          @click="emit('update:isOpen', false)"
          class="flex-1 rounded-xl h-12 font-bold text-zinc-600 border-zinc-200 hover:bg-white transition-all"
          :disabled="isPending"
        >
          Cancelar
        </Button>
        <Button
          @click="handleDelete"
          class="flex-1 bg-red-600 hover:bg-red-700 text-white rounded-xl h-12 font-bold shadow-lg shadow-red-200 transition-all flex items-center justify-center gap-2"
          :disabled="isPending"
        >
          <Loader2 v-if="isPending" class="w-4 h-4 animate-spin" />
          {{ isPending ? 'Removendo...' : 'Sim, deletar' }}
        </Button>
      </div>
    </DialogContent>
  </Dialog>
</template>
