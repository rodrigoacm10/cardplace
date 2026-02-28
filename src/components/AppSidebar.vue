<script setup lang="ts">
import { onMounted } from 'vue'
import { Sidebar, SidebarContent, SidebarGroup } from '@/components/ui/sidebar'
import { Button } from '@/components/ui/button'
import { useAuthStore } from '@/stores/auth'
import { useCollectionStore } from '@/stores/collection'
import { LogOut } from 'lucide-vue-next'
import { useRouter } from 'vue-router'

const authStore = useAuthStore()
const collectionStore = useCollectionStore()
const router = useRouter()

onMounted(() => {
  collectionStore.fetchMyCollection()
})

const handleLogout = () => {
  authStore.logout()
  router.push('/login')
}

console.log('USer ', authStore.user)
</script>

<template>
  <Sidebar>
    <SidebarContent class="bg-[#ffffff] text-[#4e4e4d]">
      <SidebarGroup class="h-full flex flex-col items-center justify-between py-6">
        <div class="flex flex-col items-center space-y-10 w-full px-4">
          <div class="flex flex-col items-center space-y-6 w-full">
            <div
              class="w-20 h-20 rounded-full bg-[#169366] flex items-center justify-center text-white text-2xl font-bold overflow-hidden shadow-md"
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
              <p class="font-bold text-lg text-[#169366] truncate" :title="authStore.user?.name">
                {{ collectionStore.isLoading ? 'Carregando...' : authStore.user?.name }}
              </p>
              <p class="text-sm truncate text-gray-500" :title="authStore.user?.email">
                {{ authStore.user?.email || '' }}
              </p>
            </div>
          </div>

          <div class="space-y-2 w-full text-center">
            <p class="font-semibold">Número de cartas</p>

            <div class="border rounded-lg flex justify-center bg-[#169366] transition-all">
              <p class="text-white font-bold text-xl py-3">
                {{ collectionStore.isLoading ? '-' : collectionStore.myCardsCount }}
              </p>
            </div>
          </div>
        </div>

        <Button
          @click="handleLogout"
          variant="ghost"
          class="flex items-center justify-center gap-2 rounded-lg w-full text-red-600 hover:text-red-600 cursor-pointer hover:bg-[#e0e0e0]"
        >
          <LogOut class="w-5 h-5" />
          Sair
        </Button>
      </SidebarGroup>
    </SidebarContent>
  </Sidebar>
</template>
