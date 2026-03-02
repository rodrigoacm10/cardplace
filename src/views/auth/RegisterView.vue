<script setup lang="ts">
import { Button } from '@/components/ui/button'
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Eye, EyeOff } from 'lucide-vue-next'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

import { useRegister } from '@/composables/auth/useRegister'

const { isLoading, showPassword, onSubmit } = useRegister()
</script>

<template>
  <div class="flex min-h-screen items-center justify-center bg-app-green p-4">
    <div class="w-full max-w-md">
      <div class="mb-8 text-center">
        <h1 class="text-4xl font-bold tracking-tight text-white">CardPlace</h1>
        <p class="text-white">O maior marketplace de cartas do Brasil</p>
      </div>

      <Card class="bg-white text-app-green">
        <CardHeader>
          <CardTitle class="text-2xl font-semibold">Criar Conta</CardTitle>
          <CardDescription class="text-app-gray-dark">
            Preencha os dados abaixo para se registrar.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form @submit="onSubmit" class="space-y-6">
            <FormField v-slot="{ componentField }" name="name">
              <FormItem>
                <FormLabel class="text-app-green">Nome</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Seu nome"
                    v-bind="componentField"
                    class="text-app-gray-dark placeholder:text-app-gray focus-visible:ring-zinc-700"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            </FormField>

            <FormField v-slot="{ componentField }" name="email">
              <FormItem>
                <FormLabel class="text-app-green">E-mail</FormLabel>
                <FormControl>
                  <Input
                    type="email"
                    placeholder="exemplo@teste.com"
                    v-bind="componentField"
                    class="text-app-gray-dark placeholder:text-app-gray focus-visible:ring-zinc-700"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            </FormField>

            <FormField v-slot="{ componentField }" name="password">
              <FormItem>
                <FormLabel class="text-app-green">Senha</FormLabel>
                <FormControl>
                  <div class="relative">
                    <Input
                      :type="showPassword ? 'text' : 'password'"
                      placeholder="••••••••"
                      v-bind="componentField"
                      class="text-app-gray-dark placeholder:text-app-gray focus-visible:ring-zinc-700 pr-10"
                    />
                    <button
                      type="button"
                      @click="showPassword = !showPassword"
                      class="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600"
                    >
                      <Eye v-if="!showPassword" class="h-4 w-4" />
                      <EyeOff v-else class="h-4 w-4" />
                    </button>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            </FormField>

            <FormField v-slot="{ componentField }" name="confirmPassword">
              <FormItem>
                <FormLabel class="text-app-green">Confirmar Senha</FormLabel>
                <FormControl>
                  <Input
                    type="password"
                    placeholder="••••••••"
                    v-bind="componentField"
                    class="text-app-gray-dark placeholder:text-app-gray focus-visible:ring-zinc-700"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            </FormField>

            <Button
              type="submit"
              class="cursor-pointer w-full rounded-full font-semibold text-white bg-app-orange hover:bg-app-orange-darker"
              :disabled="isLoading"
            >
              <span v-if="isLoading">Registrando...</span>
              <span v-else>Registrar</span>
            </Button>
          </form>
        </CardContent>
        <CardFooter class="flex flex-col space-y-4">
          <div class="text-center text-sm text-app-gray-dark">
            Já tem uma conta?
            <router-link to="/login" class="text-app-green underline-offset-4 hover:underline">
              Faça login
            </router-link>
          </div>
        </CardFooter>
      </Card>
    </div>
  </div>
</template>
