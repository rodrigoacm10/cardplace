<script setup lang="ts">
import { ref, computed, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { Button } from '@/components/ui/button'
import { useQuery } from '@tanstack/vue-query'
import { CollectionService } from '@/services/collection.service'
import { Check, ArrowLeftRight } from 'lucide-vue-next'

interface Card {
  id: string
  name: string
  description: string
  imageUrl: string
  createdAt: string
}

const props = defineProps<{
  card: Card
}>()

const router = useRouter()

const { data: collectionData } = useQuery({
  queryKey: ['collection'],
  queryFn: () => CollectionService.getMyCollection().then((res) => res.data),
  staleTime: 1000 * 60 * 5,
})

const isInCollection = computed(() => {
  return collectionData.value?.cards?.some((c: Card) => c.id === props.card.id) || false
})

const navigateToDetails = () => {
  router.push(`/cards/${props.card.id}`)
}

const navigateToTrade = () => {
  router.push('/trade')
}

const handleImageError = (event: Event) => {
  const target = event.target as HTMLImageElement
  target.src = 'https://via.placeholder.com/472x687?text=Sem+Imagem'
}

const cardRef = ref<HTMLElement | null>(null)
const rotateX = ref(0)
const rotateY = ref(0)
const isHovered = ref(false)
const isClicked = ref(false)

const showTooltip = ref(false)
const tooltipPosition = ref<'left' | 'right'>('right')

let showTimeout: ReturnType<typeof setTimeout> | null = null
let hideTimeout: ReturnType<typeof setTimeout> | null = null

const calculatePosition = () => {
  if (cardRef.value) {
    const rect = cardRef.value.getBoundingClientRect()
    const screenWidth = window.innerWidth

    if (rect.right + 320 > screenWidth) {
      tooltipPosition.value = 'left'
    } else {
      tooltipPosition.value = 'right'
    }
  }
}

const handleMouseMove = (e: MouseEvent) => {
  if (!cardRef.value) return
  const rect = cardRef.value.getBoundingClientRect()
  const x = e.clientX - rect.left
  const y = e.clientY - rect.top
  const centerX = rect.width / 2
  const centerY = rect.height / 2
  const maxRotation = 15

  rotateX.value = ((centerY - y) / centerY) * maxRotation
  rotateY.value = ((x - centerX) / centerX) * maxRotation
}

const handleMouseEnter = () => {
  isHovered.value = true

  if (hideTimeout) clearTimeout(hideTimeout)

  showTimeout = setTimeout(() => {
    calculatePosition()
    showTooltip.value = true
  }, 400)
}

const handleMouseLeave = () => {
  isHovered.value = false
  rotateX.value = 0
  rotateY.value = 0

  if (showTimeout) clearTimeout(showTimeout)

  hideTimeout = setTimeout(() => {
    showTooltip.value = false
    isClicked.value = false
  }, 300)
}

const handleCardClick = () => {
  if (showTooltip.value) {
    showTooltip.value = false
    isClicked.value = false
  } else {
    isClicked.value = true
    calculatePosition()
    showTooltip.value = true
  }
}

const handleClose = () => {
  showTooltip.value = false
  isClicked.value = false
}

onUnmounted(() => {
  if (showTimeout) clearTimeout(showTimeout)
  if (hideTimeout) clearTimeout(hideTimeout)
})

const cardStyle = computed(() => {
  if (!isHovered.value) {
    return {
      transform: 'rotateX(0deg) rotateY(0deg)',
      transition: 'transform 0.5s ease-out',
    }
  }
  return {
    transform: `rotateX(${rotateX.value}deg) rotateY(${rotateY.value}deg)`,
    transition: 'none',
  }
})
</script>

<template>
  <div
    class="relative w-full h-full z-10 transition-all duration-300"
    :class="{ 'z-50': isHovered || showTooltip }"
    style="perspective: 1000px"
    @mouseenter="handleMouseEnter"
    @mouseleave="handleMouseLeave"
  >
    <div
      ref="cardRef"
      class="relative bg-zinc-900 overflow-hidde shadow-sm flex flex-col transform-style-3d will-change-transform cursor-pointer"
      :class="{ 'shadow-2xl': isHovered }"
      :style="cardStyle"
      @mousemove="handleMouseMove"
      @click="handleCardClick"
    >
      <img
        :src="card.imageUrl"
        :alt="card.name"
        class="object-cover w-full h-full aspect-[472/687]"
        @error="handleImageError"
      />

      <div
        v-if="isInCollection"
        class="absolute -top-3 -right-3 font-bold bg-[#169366] text-white px-2 py-1 rounded-md text-[10px] font-bold flex items-center gap-1 shadow-lg border border-[#ffffff] border-2 uppercase tracking-wider backdrop-blur-sm"
      >
        <Check class="w-3 h-3" />
        Já possui
      </div>
    </div>

    <div
      class="rounded-xl shadow-2xl p-5 border border-zinc-200 transition-all duration-300 flex flex-col z-20"
      @click="handleClose"
      :class="[
        showTooltip
          ? 'opacity-100 visible pointer-events-auto'
          : 'opacity-0 invisible pointer-events-none',

        'absolute inset-0 w-full h-full bg-zinc-900/60 backdrop-blur-md sm:bg-white sm:backdrop-blur-none sm:inset-auto sm:top-1/2 sm:-translate-y-1/2 sm:w-72',

        tooltipPosition === 'right' ? 'sm:left-full sm:ml-4' : 'sm:right-full sm:mr-4',

        showTooltip
          ? 'translate-x-0'
          : tooltipPosition === 'right'
            ? '-translate-x-4'
            : 'translate-x-4',
      ]"
    >
      <div
        class="hidden sm:block absolute top-1/2 -translate-y-1/2 w-4 h-4 bg-white border-zinc-200 transform rotate-45"
        :class="
          tooltipPosition === 'right' ? '-left-2 border-b border-l' : '-right-2 border-t border-r'
        "
      ></div>

      <div class="relative z-10 flex flex-col h-full">
        <h2 class="text-xl font-bold text-white sm:text-[#169366] truncate" :title="card.name">
          {{ card.name }}
        </h2>

        <p class="text-sm text-zinc-200 sm:text-zinc-600 mt-3 line-clamp-6 grow leading-relaxed">
          {{ card.description }}
        </p>

        <div class="mt-5 pt-4 border-t border-zinc-100 flex gap-3">
          <Button
            @click.stop="navigateToDetails"
            class="flex-1 bg-white text-[#169366] border border-[#169366] hover:bg-[#169366]/5 transition-colors shadow-sm cursor-pointer"
          >
            Detalhes
          </Button>

          <Button
            @click.stop="navigateToTrade"
            class="flex-1 bg-[#e25b39] text-white hover:bg-[#ce4d2c] transition-colors shadow-md cursor-pointer flex items-center justify-center gap-2"
            :disabled="isInCollection"
          >
            <ArrowLeftRight class="w-4 h-4" />
            Trocar
          </Button>
        </div>
      </div>
    </div>
  </div>
</template>
