<script setup lang="ts">
import { Button } from '@/components/ui/button'
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Checkbox } from '@/components/ui/checkbox'
import { Eye, EyeOff } from 'lucide-vue-next'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

import { useLogin } from '@/composables/auth/useLogin'

const { isLoading, rememberMe, showPassword, onSubmit } = useLogin()
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
          <CardTitle class="text-2xl font-semibold">Login</CardTitle>
          <CardDescription class="text-app-gray-dark">
            Entre com suas credenciais para acessar sua conta.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form @submit="onSubmit" class="space-y-6">
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

            <div class="flex items-center space-x-2">
              <Checkbox
                id="remember"
                :checked="rememberMe"
                @update:checked="rememberMe = $event"
                class="cursor-pointer border-zinc-700 data-[state=checked]:bg-white data-[state=checked]:text-zinc-950"
              />
              <label
                for="remember"
                class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-app-gray-dark cursor-pointer"
              >
                Lembrar de mim
              </label>
            </div>

            <Button
              type="submit"
              class="cursor-pointer w-full rounded-full font-semibold text-white bg-app-orange hover:bg-app-orange-darker"
              :disabled="isLoading"
            >
              <span v-if="isLoading">Entrando...</span>
              <span v-else>Entrar</span>
            </Button>
          </form>
        </CardContent>
        <CardFooter class="flex flex-col space-y-4">
          <div class="text-center text-sm text-app-gray-dark">
            Não tem uma conta?
            <router-link to="/register" class="text-app-green underline-offset-4 hover:underline">
              Crie uma agora
            </router-link>
          </div>
        </CardFooter>
      </Card>
    </div>
  </div>
</template>
