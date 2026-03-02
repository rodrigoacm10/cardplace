<script setup lang="ts">
import { Plus } from 'lucide-vue-next'

interface Props {
  type: 'OFFERING' | 'RECEIVING'
}

const props = defineProps<Props>()
</script>

<template>
  <div
    class="w-full h-full rounded-2xl border-2 border-dashed border-zinc-800 bg-zinc-900/50 flex flex-col items-center justify-center hover:border-app-green hover:bg-zinc-900 transition-all"
  >
    <div
      class="w-12 h-12 rounded-full bg-zinc-800 flex items-center justify-center group-hover:bg-app-green/20 text-white group-hover:text-app-green transition-colors"
    >
      <Plus class="w-6 h-6" />
    </div>
    <span class="font-medium text-white">{{
      type === 'OFFERING' ? 'Escolha os cards' : 'Escolha o card'
    }}</span>
  </div>
</template>
