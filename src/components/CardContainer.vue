<script setup lang="ts">
import { ref, computed } from 'vue'
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

const { data: collectionData } = useQuery({
  queryKey: ['collection'],
  queryFn: () => CollectionService.getMyCollection().then((res) => res.data),
  staleTime: 1000 * 60 * 5,
})

const isInCollection = computed(() => {
  return collectionData.value?.cards?.some((c: Card) => c.id === props.card.id) || false
})

const handleImageError = (event: Event) => {
  const target = event.target as HTMLImageElement
  target.src = 'https://via.placeholder.com/472x687?text=Sem+Imagem'
}

const cardRef = ref<HTMLElement | null>(null)
const rotateX = ref(0)
const rotateY = ref(0)
const isHovered = ref(false)

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
  }, 300)
}

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
      class="relative bg-zinc-900 rounded-xl overflow-hidden shadow-sm flex flex-col transform-style-3d will-change-transform cursor-pointer"
      :class="{ 'shadow-2xl': isHovered }"
      :style="cardStyle"
      @mousemove="handleMouseMove"
    >
      <img
        :src="card.imageUrl"
        :alt="card.name"
        class="object-cover w-full h-full aspect-[472/687]"
        @error="handleImageError"
      />

      <div
        v-if="isInCollection"
        class="absolute top-3 right-3 font-bold bg-[#ffffff] text-[#169366] px-2 py-1 rounded-md text-[10px] font-bold flex items-center gap-1 shadow-lg border border-[#169366] border-2 uppercase tracking-wider backdrop-blur-sm"
      >
        <Check class="w-3 h-3" />
        Já possui
      </div>
    </div>

    <div
      class="absolute top-1/2 -translate-y-1/2 w-72 bg-white rounded-xl shadow-2xl p-5 border border-zinc-200 transition-all duration-300 flex flex-col"
      :class="[
        showTooltip
          ? 'opacity-100 visible pointer-events-auto'
          : 'opacity-0 invisible pointer-events-none',

        tooltipPosition === 'right' ? 'left-full ml-4' : 'right-full mr-4',

        showTooltip
          ? 'translate-x-0'
          : tooltipPosition === 'right'
            ? '-translate-x-4'
            : 'translate-x-4',
      ]"
    >
      <div
        class="absolute top-1/2 -translate-y-1/2 w-4 h-4 bg-white border-zinc-200 transform rotate-45"
        :class="
          tooltipPosition === 'right' ? '-left-2 border-b border-l' : '-right-2 border-t border-r'
        "
      ></div>

      <div class="relative z-10 flex flex-col h-full">
        <h2 class="text-xl font-bold text-[#169366] truncate" :title="card.name">
          {{ card.name }}
        </h2>

        <p class="text-sm text-zinc-600 mt-3 line-clamp-6 flex-grow leading-relaxed">
          {{ card.description }}
        </p>

        <div class="mt-5 pt-4 border-t border-zinc-100 flex gap-3">
          <Button
            class="flex-1 bg-white text-[#169366] border border-[#169366] hover:bg-[#169366]/5 transition-colors shadow-sm cursor-pointer"
          >
            Detalhes
          </Button>

          <Button
            class="flex-1 bg-[#e25b39] text-white hover:bg-[#ce4d2c] transition-colors shadow-md cursor-pointer flex items-center justify-center gap-2"
          >
            <ArrowLeftRight class="w-4 h-4" />
            Trocar
          </Button>
        </div>
      </div>
    </div>
  </div>
</template>
