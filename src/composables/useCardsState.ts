import { computed, type Ref } from 'vue'
import { useInfiniteQuery } from '@tanstack/vue-query'
import { CardsService } from '@/services/cards.service'
import { useIntersectionObserver } from '@vueuse/core'

export function useCardsState(loadMoreRef: Ref<HTMLElement | null>, rpp: number) {
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } = useInfiniteQuery({
    queryKey: ['cards'],
    queryFn: ({ pageParam = 1 }) =>
      CardsService.getCards({ page: pageParam as number, rpp }).then((res) => res.data),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => (lastPage.more ? lastPage.page + 1 : undefined),
  })

  const allCards = computed(() => data.value?.pages.flatMap((page) => page.list) || [])

  useIntersectionObserver(
    loadMoreRef,
    (entries) => {
      const isIntersecting = entries[0]?.isIntersecting
      if (isIntersecting && hasNextPage.value && !isFetchingNextPage.value) {
        fetchNextPage()
      }
    },
    { threshold: 0.1 },
  )

  return { allCards, isLoading, hasNextPage, isFetchingNextPage }
}
