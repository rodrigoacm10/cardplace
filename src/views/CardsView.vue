<script setup lang="ts">
import { useAuthStore } from '@/stores/auth'
import { useRouter } from 'vue-router'
import { Button } from '@/components/ui/button'

const authStore = useAuthStore()
const router = useRouter()

const handleLogout = () => {
  authStore.logout()
  router.push('/login')
}
</script>

<template>
  <div class="min-h-screen bg-zinc-950 text-white p-8">
    <div class="max-w-6xl mx-auto">
      <header class="flex justify-between items-center mb-12">
        <div>
          <h1 class="text-3xl font-bold">Marketplace</h1>
          <p class="text-zinc-400">Bem-vindo ao CardPlace</p>
        </div>
        <Button
          @click="handleLogout"
          variant="outline"
          class="border-zinc-800 text-white hover:bg-zinc-900"
        >
          Sair
        </Button>
      </header>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div
          v-for="i in 6"
          :key="i"
          class="h-64 rounded-xl bg-zinc-900 border border-zinc-800 animate-pulse"
        ></div>
      </div>
    </div>
  </div>
</template>
