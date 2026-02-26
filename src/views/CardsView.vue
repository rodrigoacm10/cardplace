<script setup lang="ts"></script>

<template>
  <div class="min-h-screen bg-zinc-95 text-white p-8">
    <div class="max-w-6xl mx-auto">
      <header class="flex justify-between items-center mb-12">
        <div>
          <h1 class="text-3xl font-bold">Marketplace</h1>
          <p class="text-zinc-400">Bem-vindo ao CardPlace</p>
        </div>
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
