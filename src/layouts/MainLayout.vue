<script setup lang="ts">
import { ref } from 'vue'
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar'
import AppSidebar from '@/components/layout/AppSidebar.vue'
import { Search, ArrowLeftRight, Library, Menu } from 'lucide-vue-next'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'

const isMobileMenuOpen = ref(false)

const navLinks = [
  { to: '/cards', label: 'Marketplace', icon: Search },
  { to: '/trades', label: 'Trocas', icon: ArrowLeftRight },
  { to: '/collection', label: 'Coleção', icon: Library },
]
</script>

<template>
  <SidebarProvider>
    <AppSidebar />

    <main class="w-full flex flex-col min-h-screen">
      <header
        class="sticky top-0 z-50 bg-white border-b border-zinc-100 flex justify-between items-center py-4 px-6 h-18"
      >
        <div class="flex items-center gap-1">
          <SidebarTrigger class="text-app-green hover:bg-app-green/5 cursor-pointer" />
          <div class="flex items-center gap-2">
            <h1 class="text-app-green text-xl font-black tracking-tight">CardPlace</h1>
          </div>
        </div>

        <nav class="hidden sm:flex items-center bg-zinc-50 border border-zinc-100 p-1 rounded-2xl">
          <Button
            v-for="link in navLinks"
            :key="link.to"
            as-child
            variant="ghost"
            size="sm"
            class="rounded-xl font-bold transition-all text-zinc-500 hover:text-zinc-900 text-sm"
          >
            <router-link :to="link.to" active-class="bg-white shadow-xs !text-app-green">
              <component :is="link.icon" class="w-4 h-4 mr-2" />
              <span>{{ link.label }}</span>
            </router-link>
          </Button>
        </nav>

        <Sheet v-model:open="isMobileMenuOpen">
          <SheetTrigger as-child>
            <Button
              variant="outline"
              size="icon"
              class="sm:hidden rounded-xl bg-zinc-50 border-zinc-100 text-zinc-600 active:scale-95 transition-transform"
            >
              <Menu class="w-5 h-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="top" class="p-6">
            <SheetHeader class="mb-4">
              <SheetTitle class="text-app-green text-xl font-black">Navegação</SheetTitle>
            </SheetHeader>
            <div class="flex flex-row overflow-x-auto gap-3 pb-2 scrollbar-none">
              <Button
                v-for="link in navLinks"
                :key="link.to"
                as-child
                variant="ghost"
                @click="isMobileMenuOpen = false"
                class="rounded-2xl font-bold transition-all whitespace-nowrap bg-zinc-50 text-zinc-500 border border-zinc-100 flex items-center justify-center p-6 h-auto"
              >
                <router-link
                  :to="link.to"
                  active-class="!bg-app-green/5 !text-app-green !border-app-green/20"
                >
                  <component :is="link.icon" class="w-5 h-5 mr-2" />
                  <span>{{ link.label }}</span>
                </router-link>
              </Button>
            </div>
          </SheetContent>
        </Sheet>
      </header>

      <div class="flex-1 bg-app-gray-light">
        <div class="max-w-7xl mx-auto overflow-hidden">
          <router-view v-slot="{ Component }">
            <Transition
              enter-active-class="transition duration-300 ease-out"
              enter-from-class="opacity-0 translate-y-4"
              enter-to-class="opacity-100 translate-y-0"
            >
              <component :is="Component" />
            </Transition>
          </router-view>
        </div>
      </div>
    </main>
  </SidebarProvider>
</template>
