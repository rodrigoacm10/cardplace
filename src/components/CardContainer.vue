<script setup lang="ts">
import { ref, computed, onUnmounted, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { Button } from '@/components/ui/button'
import { useQuery } from '@tanstack/vue-query'
import { CollectionService } from '@/services/collection.service'
import { Check, ArrowLeftRight } from 'lucide-vue-next'
import { useWindowSize } from '@vueuse/core'
import CardImage3D from '@/components/global/CardImage3D.vue'

interface Card {
  id: string
  name: string
  description: string
  imageUrl: string
  createdAt: string
}

const props = defineProps<{
  card: Card
  hideTrade?: boolean
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
  router.push({
    path: '/trade',
    query: { receivingId: props.card.id },
  })
}

const handleImageError = (event: Event) => {
  const target = event.target as HTMLImageElement
  target.src = 'https://via.placeholder.com/472x687?text=Sem+Imagem'
}

const cardRef = ref<HTMLElement | null>(null)
const isHovered = ref(false)

const showTooltip = ref(false)
const isTooltipHovered = ref(false)
const tooltipPosition = ref<'left' | 'right'>('right')

let showTimeout: ReturnType<typeof setTimeout> | null = null
let hideTimeout: ReturnType<typeof setTimeout> | null = null

const { width: windowWidth } = useWindowSize()
const tooltipCoords = ref({ top: 0, left: 0 })

const calculatePosition = () => {
  if (cardRef.value) {
    const rect = cardRef.value.getBoundingClientRect()
    const screenWidth = window.innerWidth

    if (rect.right + 320 > screenWidth) {
      tooltipPosition.value = 'left'
    } else {
      tooltipPosition.value = 'right'
    }

    if (window.innerWidth >= 640) {
      tooltipCoords.value = {
        top: rect.top + rect.height / 2,
        left: tooltipPosition.value === 'right' ? rect.right + 16 : rect.left - 16,
      }
    } else {
      tooltipCoords.value = { top: 0, left: 0 }
    }
  }
}

const handleScroll = () => {
  if (showTooltip.value) {
    calculatePosition()
  }
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll, true)
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll, true)
  if (showTimeout) clearTimeout(showTimeout)
  if (hideTimeout) clearTimeout(hideTimeout)
})

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

  if (showTimeout) clearTimeout(showTimeout)

  hideTimeout = setTimeout(() => {
    if (!isHovered.value && !isTooltipHovered.value) {
      showTooltip.value = false
    }
  }, 300)
}

const handleTooltipMouseEnter = () => {
  isTooltipHovered.value = true
  if (hideTimeout) clearTimeout(hideTimeout)
}

const handleTooltipMouseLeave = () => {
  isTooltipHovered.value = false
  if (hideTimeout) clearTimeout(hideTimeout)

  hideTimeout = setTimeout(() => {
    if (!isHovered.value && !isTooltipHovered.value) {
      showTooltip.value = false
    }
  }, 300)
}

const handleClose = () => {
  showTooltip.value = false
}
</script>

<template>
  <div
    class="relative w-full h-full z-10 transition-all duration-300"
    @mouseenter="handleMouseEnter"
    @mouseleave="handleMouseLeave"
  >
    <div
      ref="cardRef"
      class="relative cursor-pointer transition-shadow duration-300"
      :class="{ 'shadow-[0_20px_50px_-12px_rgba(0,0,0,0.5)]': isHovered }"
    >
      <CardImage3D :image-url="card.imageUrl" :alt="card.name" class="rounded-[inherit]">
        <div
          v-if="isInCollection && !hideTrade"
          class="absolute -top-3 -right-3 font-bold bg-[#169366] text-white px-2 py-1 rounded-md text-[10px] font-bold flex items-center gap-1 shadow-lg border border-[#ffffff] border-2 uppercase tracking-wider backdrop-blur-sm z-20"
        >
          <Check class="w-3 h-3" />
          Já possui
        </div>
      </CardImage3D>
    </div>

    <Teleport to="body">
      <div
        v-if="showTooltip"
        class="rounded-xl shadow-2xl p-5 border border-zinc-200 transition-all duration-300 flex flex-col fixed z-100"
        @click="handleClose"
        @mouseenter="handleTooltipMouseEnter"
        @mouseleave="handleTooltipMouseLeave"
        :style="
          windowWidth >= 640
            ? {
                top: `${tooltipCoords.top}px`,
                left: `${tooltipCoords.left}px`,
                transform:
                  tooltipPosition === 'right' ? 'translateY(-50%)' : 'translate(-100%, -50%)',
              }
            : {
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
              }
        "
        :class="[
          showTooltip
            ? 'opacity-100 visible pointer-events-auto'
            : 'opacity-0 invisible pointer-events-none',

          'bg-zinc-900/60 backdrop-blur-md sm:bg-white sm:backdrop-blur-none sm:w-72 sm:h-auto',

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

        <div class="relative z-10 flex flex-col h-full sm:h-auto">
          <h2 class="text-xl font-bold text-white sm:text-[#169366] truncate" :title="card.name">
            {{ card.name }}
          </h2>

          <p class="text-sm text-zinc-200 sm:text-zinc-600 mt-3 line-clamp-6">
            {{ card.description }}
          </p>

          <div class="mt-auto sm:mt-5 pt-4 border-t border-zinc-100 flex gap-3">
            <Button
              @click.stop="navigateToDetails"
              class="flex-1 bg-white text-[#169366] border border-[#169366] hover:bg-[#169366]/5 transition-colors shadow-sm cursor-pointer"
            >
              Detalhes
            </Button>

            <Button
              v-if="!hideTrade"
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
    </Teleport>
  </div>
</template>
