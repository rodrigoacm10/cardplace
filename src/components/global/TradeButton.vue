<script setup lang="ts">
import { useRouter } from 'vue-router'
import { Button } from '../ui/button'
import { ArrowLeftRight } from 'lucide-vue-next'

interface Props {
  isCardOwned?: boolean
  cardId?: string
  small?: boolean
}

const props = defineProps<Props>()

const router = useRouter()
</script>

<template>
  <Button
    @click="
      router.push(
        props.cardId ? { path: '/trade', query: { receivingId: props.cardId } } : '/trade',
      )
    "
    :class="
      props.small
        ? 'max-w-[200px] w-full h-10 bg-app-orange hover:bg-app-orange-dark text-white shadow-orange-100 group transition-all hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:active:scale-100 disabled:hover:bg-app-orange'
        : 'w-full h-12 px-10 bg-app-orange hover:bg-app-orange-dark text-white text-lg font-bold shadow-orange-100 group transition-all hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:active:scale-100 disabled:hover:bg-app-orange'
    "
    :disabled="props.isCardOwned"
  >
    <ArrowLeftRight
      v-if="!isCardOwned"
      class="w-6 h-6 mr-3 group-hover:rotate-180 transition-transform duration-500"
    />
    {{ isCardOwned ? 'Já na Coleção' : 'Trocar' }}
  </Button>
</template>
