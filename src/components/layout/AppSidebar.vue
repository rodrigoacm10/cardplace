<script setup lang="ts">
import { computed, watch } from 'vue'
import axios from 'axios'
import { Sidebar, SidebarContent, SidebarGroup } from '@/components/ui/sidebar'
import { Button } from '@/components/ui/button'
import { useAuthStore } from '@/stores/auth'
import { useQuery } from '@tanstack/vue-query'
import { CollectionService } from '@/services/collection.service'
import { LogOut } from 'lucide-vue-next'
import { useRouter } from 'vue-router'
import AddCardsDialog from '@/components/cards/AddCardsDialog.vue'

const authStore = useAuthStore()
const router = useRouter()

const { data: collectionData, isLoading } = useQuery({
  queryKey: ['collection'],
  queryFn: () => CollectionService.getMyCollection().then((res) => res.data),
  retry: (failureCount, error: unknown) => {
    if (axios.isAxiosError(error) && error.response?.status === 401) return false
    return failureCount < 3
  },
})

watch(
  collectionData,
  (newData) => {
    if (newData) {
      authStore.user = {
        id: newData.id,
        name: newData.name,
        email: newData.email,
        avatarUrl: newData.avatarUrl,
      }
    }
  },
  { immediate: true },
)

const myCardsCount = computed(() => collectionData.value?.cards?.length || 0)

const handleLogout = () => {
  authStore.logout()
  router.push('/login')
}
</script>

<template>
  <Sidebar>
    <SidebarContent class="bg-white text-app-gray-dark">
      <SidebarGroup class="h-full flex flex-col items-center justify-between py-6">
        <div class="flex flex-col items-center space-y-10 w-full px-4">
          <div class="flex flex-col items-center space-y-6 w-full">
            <div
              class="w-20 h-20 rounded-full bg-app-green flex items-center justify-center text-white text-2xl font-bold overflow-hidden shadow-md"
            >
              <img
                v-if="authStore.user?.avatarUrl"
                :src="authStore.user.avatarUrl"
                alt="Foto de perfil"
                class="w-full h-full object-cover"
              />
              <span v-else>{{ authStore.userInitials }}</span>
            </div>

            <div class="text-center w-full truncate">
              <p class="font-bold text-lg text-app-green truncate" :title="authStore.user?.name">
                {{ isLoading ? 'Carregando...' : authStore.user?.name }}
              </p>
              <p class="text-sm truncate text-gray-500" :title="authStore.user?.email">
                {{ authStore.user?.email || '' }}
              </p>
            </div>
          </div>

          <div class="space-y-2 w-full text-center flex flex-col items-center">
            <p class="font-semibold">Número de cartas</p>

            <div
              class="border rounded-lg flex justify-center w-full max-w-[120px] bg-app-green transition-all"
            >
              <p class="text-white font-bold text-xl py-3">
                {{ isLoading ? '-' : myCardsCount }}
              </p>
            </div>

            <AddCardsDialog />
          </div>
        </div>

        <Button
          @click="handleLogout"
          variant="ghost"
          class="flex items-center justify-center gap-2 rounded-lg w-full text-red-600 hover:text-red-600 cursor-pointer hover:bg-red-50 mt-4"
        >
          <LogOut class="w-5 h-5" />
          Sair
        </Button>
      </SidebarGroup>
    </SidebarContent>
  </Sidebar>
</template>
