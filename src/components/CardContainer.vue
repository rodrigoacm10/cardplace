<script setup lang="ts">
import { ref, computed } from 'vue'
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

        <div class="mt-5 pt-4 border-t border-zinc-100 flex justify-end">
          <Button
            class="w-full bg-[#169366] text-white hover:bg-[#128159] transition-colors shadow-md cursor-pointer"
          >
            Ver Detalhes
          </Button>
        </div>
      </div>
    </div>
  </div>
</template>
