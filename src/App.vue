<script setup lang="ts">
import { RouterView } from 'vue-router'
import { Toaster } from '@/components/ui/sonner'
import 'vue-sonner/style.css'
</script>

<template>
  <div class="min-h-screen bg-zinc-950">
    <RouterView />
    <Toaster />
  </div>
</template>

<style scoped></style>
