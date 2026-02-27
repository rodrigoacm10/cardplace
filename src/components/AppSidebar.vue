<script setup lang="ts">
import { Sidebar, SidebarContent, SidebarGroup } from '@/components/ui/sidebar'
import { Button } from '@/components/ui/button'
import { useAuthStore } from '@/stores/auth'
import { LogOut } from 'lucide-vue-next'
import { useRouter } from 'vue-router'

const authStore = useAuthStore()
const router = useRouter()

const handleLogout = () => {
  authStore.logout()
  router.push('/login')
}
</script>

<template>
  <Sidebar>
    <SidebarContent class="bg-[#ffffff] text-[#4e4e4d]">
      <SidebarGroup class="h-full flex flex-col items-center justify-between py-6">
        <div class="flex flex-col items-center space-y-10">
          <div class="flex flex-col items-center space-y-6">
            <div class="w-20 h-20 rounded-full bg-[#169366] flex items-center justify-center">
              <p>AC</p>
            </div>

            <div class="text-center">
              <p class="font-bold text-lg text-[#169366]">Rodrigo Andrade</p>
              <p>rodrigoacm10@gmail.com</p>
            </div>
          </div>

          <div class="space-y-2">
            <p class="font-semibold">Número de cartas</p>

            <div class="border rounded-lg flex justify-center bg-[#169366]">
              <p class="text-white font-bold text-xl py-3">10</p>
            </div>
          </div>
        </div>

        <Button
          @click="handleLogout"
          variant="ghost"
          class="flex items-center justify-center gap-2 rounded-lg w-full text-red-600 hover:text-red-600 cursor-pointer hover:bg-[#e0e0e0]"
        >
          <LogOut />
          Sair
        </Button>
      </SidebarGroup>
    </SidebarContent>
  </Sidebar>
</template>
