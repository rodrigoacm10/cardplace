<script setup lang="ts">
import { ref, computed } from 'vue'

const props = defineProps<{
  imageUrl?: string
  alt?: string
  disable3d?: boolean
}>()

const cardRef = ref<HTMLElement | null>(null)
const rotateX = ref(0)
const rotateY = ref(0)
const isHovered = ref(false)

const handleMouseMove = (e: MouseEvent) => {
  if (!cardRef.value || props.disable3d) return
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
  if (props.disable3d) return
  isHovered.value = true
}

const handleMouseLeave = () => {
  isHovered.value = false
  rotateX.value = 0
  rotateY.value = 0
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

const handleImageError = (event: Event) => {
  const target = event.target as HTMLImageElement
  target.src = 'https://via.placeholder.com/472x687?text=Sem+Imagem'
}
</script>

<template>
  <div
    class="relative w-full h-full transition-all duration-300"
    style="perspective: 1000px"
    @mouseenter="handleMouseEnter"
    @mouseleave="handleMouseLeave"
  >
    <div
      ref="cardRef"
      class="w-full h-full relative flex flex-col transform-style-3d will-change-transform bg-zinc-900"
      :style="cardStyle"
      @mousemove="handleMouseMove"
    >
      <img
        :src="imageUrl || 'https://via.placeholder.com/472x687?text=Sem+Imagem'"
        :alt="alt || 'Card'"
        class="object-cover w-full h-full aspect-472/687"
        @error="handleImageError"
      />
      <slot></slot>
    </div>
  </div>
</template>
