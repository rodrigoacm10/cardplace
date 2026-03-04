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

const cardRef = ref<HTMLElement | null>(null)
const isHovered = ref(false)

const showTooltip = ref(false)
const isTooltipHovered = ref(false)
const tooltipPosition = ref<'left' | 'right'>('right')

let showTimeout: ReturnType<typeof setTimeout> | null = null
let hideTimeout: ReturnType<typeof setTimeout> | null = null

const { width: windowWidth } = useWindowSize()
const tooltipCoords = ref({
  cardTop: 0,
  cardLeft: 0,
  cardWidth: 0,
  cardHeight: 0,
  desktopTop: 0,
  desktopLeft: 0,
})

const calculatePosition = () => {
  if (cardRef.value) {
    const rect = cardRef.value.getBoundingClientRect()
    const screenWidth = window.innerWidth

    if (rect.right + 320 > screenWidth) {
      tooltipPosition.value = 'left'
    } else {
      tooltipPosition.value = 'right'
    }

    tooltipCoords.value = {
      cardTop: rect.top,
      cardLeft: rect.left,
      cardWidth: rect.width,
      cardHeight: rect.height,
      desktopTop: rect.top + rect.height / 2,
      desktopLeft: tooltipPosition.value === 'right' ? rect.right + 16 : rect.left - 16,
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
  if (windowWidth.value < 640) return
  isHovered.value = true

  if (hideTimeout) clearTimeout(hideTimeout)

  showTimeout = setTimeout(() => {
    calculatePosition()
    showTooltip.value = true
  }, 400)
}

const handleMouseLeave = () => {
  if (windowWidth.value < 640) return
  isHovered.value = false

  if (showTimeout) clearTimeout(showTimeout)

  hideTimeout = setTimeout(() => {
    if (!isHovered.value && !isTooltipHovered.value) {
      showTooltip.value = false
    }
  }, 300)
}

const handleCardClick = () => {
  if (windowWidth.value < 640) {
    if (showTooltip.value) {
      showTooltip.value = false
    } else {
      calculatePosition()
      showTooltip.value = true
    }
  } else {
    navigateToDetails()
  }
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
      @click="handleCardClick"
    >
      <CardImage3D :image-url="card.imageUrl" :alt="card.name" class="rounded-[inherit]">
        <div
          v-if="isInCollection && !hideTrade"
          class="absolute -top-3 -right-3 font-bold bg-app-green text-white px-2 py-1 rounded-md text-[10px] flex items-center gap-1 border-white border-2 uppercase tracking-wider backdrop-blur-sm z-20"
        >
          <Check class="w-3 h-3" />
          Já possui
        </div>
      </CardImage3D>
    </div>

    <Teleport to="body">
      <transition
        enter-active-class="transition-opacity duration-300"
        enter-from-class="opacity-0"
        enter-to-class="opacity-100"
        leave-active-class="transition-opacity duration-200"
        leave-from-class="opacity-100"
        leave-to-class="opacity-0"
      >
        <div
          v-if="showTooltip && windowWidth < 640"
          class="fixed inset-0 z-40"
          @click="handleClose"
        ></div>
      </transition>

      <transition
        enter-active-class="transition-all duration-300 ease-out"
        :enter-from-class="`opacity-0 scale-95 ${windowWidth >= 640 ? (tooltipPosition === 'right' ? '-translate-x-4' : 'translate-x-4') : 'translate-y-4'}`"
        enter-to-class="opacity-100 translate-x-0 translate-y-0 scale-100"
        leave-active-class="transition-all duration-200 ease-in"
        leave-from-class="opacity-100 translate-x-0 translate-y-0 scale-100"
        :leave-to-class="`opacity-0 scale-95 ${windowWidth >= 640 ? (tooltipPosition === 'right' ? '-translate-x-4' : 'translate-x-4') : 'translate-y-4'}`"
      >
        <div
          v-if="showTooltip"
          class="overflow-hidden sm:overflow-visible sm:rounded-xl shadow-2xl p-4 sm:p-5 border border-app-green sm:border-zinc-200 flex flex-col fixed z-40 bg-zinc-900/95 backdrop-blur-md sm:bg-white sm:backdrop-blur-none sm:w-72 sm:h-auto"
          @click.stop="() => {}"
          @mouseenter="handleTooltipMouseEnter"
          @mouseleave="handleTooltipMouseLeave"
          :style="
            windowWidth >= 640
              ? {
                  top: `${tooltipCoords.desktopTop}px`,
                  left: `${tooltipCoords.desktopLeft}px`,
                  transform:
                    tooltipPosition === 'right' ? 'translateY(-50%)' : 'translate(-100%, -50%)',
                }
              : {
                  top: `${tooltipCoords.cardTop}px`,
                  left: `${tooltipCoords.cardLeft}px`,
                  width: `${tooltipCoords.cardWidth}px`,
                  height: `${tooltipCoords.cardHeight}px`,
                }
          "
        >
          <div
            class="hidden sm:block absolute top-1/2 -translate-y-1/2 w-4 h-4 bg-white border-zinc-200 transform rotate-45"
            :class="
              tooltipPosition === 'right'
                ? '-left-2 border-b border-l'
                : '-right-2 border-t border-r'
            "
          ></div>

          <div
            class="relative z-10 flex flex-col h-full sm:h-auto overflow-y-auto custom-scrollbar"
          >
            <div class="flex justify-between items-start">
              <h2
                class="text-xl font-bold text-white sm:text-app-green truncate pr-2"
                :title="card.name"
              >
                {{ card.name }}
              </h2>
              <button
                v-if="windowWidth < 640"
                @click="handleClose"
                class="text-zinc-400 hover:text-white shrink-0 -mt-1 -mr-1 p-2"
              >
                ✕
              </button>
            </div>

            <p class="text-sm text-zinc-200 sm:text-zinc-600 mt-3 line-clamp-6">
              {{ card.description }}
            </p>

            <div class="mt-auto sm:mt-5 pt-4 border-t border-zinc-100 flex gap-3">
              <Button
                @click.stop="navigateToDetails"
                class="flex-1 bg-white text-app-green border border-app-green hover:bg-app-green/5 transition-colors shadow-sm cursor-pointer"
              >
                Detalhes
              </Button>

              <Button
                v-if="!hideTrade"
                @click.stop="navigateToTrade"
                class="flex-1 bg-app-orange text-white hover:bg-app-orange-dark transition-colors shadow-md cursor-pointer flex items-center justify-center gap-2"
                :disabled="isInCollection"
              >
                <ArrowLeftRight class="w-4 h-4" />
                Trocar
              </Button>
            </div>
          </div>
        </div>
      </transition>
    </Teleport>
  </div>
</template>
