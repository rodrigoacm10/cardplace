<script setup lang="ts">
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar'
import AppSidebar from '@/components/AppSidebar.vue'
import { LayoutDashboard } from 'lucide-vue-next'
</script>

<template>
  <SidebarProvider>
    <AppSidebar />

    <main class="w-full flex flex-col min-h-screen text-white">
      <header class="sticky top-0 z-10 bg-[#ffffff] flex justify-between items-center py-4 px-8">
        <div class="flex items-center gap-4">
          <SidebarTrigger class="text-[#169366] hover:text-[#128159] cursor-pointer" />
          <div>
            <h1 class="text-[#169366] text-xl font-bold">CardPlace</h1>
          </div>
        </div>

        <div class="text-[#4e4e4d] font-semibold flex items-center space-x-2">
          <router-link to="/cards" class="flex items-center">
            <LayoutDashboard class="w-4 h-4 mr-2" />
            <span>Marketplace</span>
          </router-link>

          <div class="bg-[#4e4e4d] w-0.5 h-6"></div>

          <router-link to="/cards" class="flex items-center">
            <LayoutDashboard class="w-4 h-4 mr-2" />
            <span>Marketplace</span>
          </router-link>

          <div class="bg-[#4e4e4d] w-0.5 h-6"></div>

          <router-link to="/cards" class="flex items-center">
            <LayoutDashboard class="w-4 h-4 mr-2" />
            <span>Marketplace</span>
          </router-link>
        </div>
      </header>

      <!-- p-8 -->
      <div class="flex-1 bg-[#eaeaea]">
        <div class="max-w-6xl mx-auto">
          <router-view />
        </div>
      </div>
    </main>
  </SidebarProvider>
</template>
