<script setup lang="ts">
import { useAuthStore } from '@/stores/auth'
import { useRouter } from 'vue-router'
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar'
import { Button } from '@/components/ui/button'
import AppSidebar from '@/components/AppSidebar.vue'

const authStore = useAuthStore()
const router = useRouter()

const handleLogout = () => {
  authStore.logout()
  router.push('/login')
}
</script>

<template>
  <SidebarProvider>
    <AppSidebar />

    <main class="w-full flex flex-col min-h-screen bg-zinc-950 text-white">
      <header
        class="sticky top-0 z-10 bg-red-200 flex justify-between items-center p-4 border-b border-zinc-800"
      >
        <div class="flex items-center gap-4">
          <SidebarTrigger class="text-white hover:bg-zinc-900" />
          <div>
            <h1 class="text-xl font-bold">CardPlace</h1>
          </div>
        </div>
        <Button
          @click="handleLogout"
          variant="outline"
          class="border-zinc-800 text-white hover:bg-zinc-900"
        >
          Sair
        </Button>
      </header>

      <div class="p-8 flex-1">
        <div class="max-w-6xl mx-auto">
          <router-view />
        </div>
      </div>
    </main>
  </SidebarProvider>
</template>
