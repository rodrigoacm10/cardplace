import { createPinia } from 'pinia'
import { VueQueryPlugin, QueryClient } from '@tanstack/vue-query'
import { createRouter, createWebHistory } from 'vue-router'

const mockRouter = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', component: { template: '<div>Home</div>' } },
    { path: '/login', component: { template: '<div>Login</div>' } },
    { path: '/trades', component: { template: '<div>Trades</div>' } },
    { path: '/register', component: { template: '<div>Register</div>' } },
    { path: '/cards', component: { template: '<div>Cards</div>' } },
  ],
})

export function setupTestApp(customPinia?: any) {
  const pinia = customPinia || createPinia()
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  })

  return {
    global: {
      plugins: [pinia, mockRouter, [VueQueryPlugin, { queryClient }] as any],
    },
  }
}

Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: (query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: () => {}, // deprecated
    removeListener: () => {}, // deprecated
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => {},
  }),
})

export { mockRouter }
