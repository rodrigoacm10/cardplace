<script setup lang="ts">
import { ChevronLeft } from 'lucide-vue-next'
import { useRouter } from 'vue-router'

const router = useRouter()
</script>

<template>
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
</template>
