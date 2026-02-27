<script setup lang="ts">
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar'
import AppSidebar from '@/components/AppSidebar.vue'
import { useRouter } from 'vue-router'

const router = useRouter()
</script>

<template>
  <SidebarProvider>
    <AppSidebar />

    <main class="w-full flex flex-col min-h-screen text-white">
      <header class="sticky top-0 z-10 bg-[#ffffff] flex justify-between items-center p-4">
        <div class="flex items-center gap-4">
          <SidebarTrigger class="text-[#169366] hover:text-[#128159] cursor-pointer" />
          <div>
            <h1 class="text-[#169366] text-xl font-bold">CardPlace</h1>
          </div>
        </div>

        <div></div>
      </header>

      <div class="p-8 flex-1 bg-[#169366]">
        <div class="max-w-6xl mx-auto">
          <router-view />
        </div>
      </div>
    </main>
  </SidebarProvider>
</template>
