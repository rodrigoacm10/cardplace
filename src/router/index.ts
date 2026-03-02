import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import LoginView from '../views/auth/LoginView.vue'
import RegisterView from '../views/auth/RegisterView.vue'
import CardsView from '../views/cards/CardsView.vue'
import TradeView from '../views/trades/TradeView.vue'
import TradesView from '../views/trades/TradesView.vue'
import CardDetailsView from '../views/cards/CardDetailsView.vue'
import CollectionView from '../views/cards/CollectionView.vue'
import MainLayout from '../layouts/MainLayout.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/login',
      name: 'login',
      component: LoginView,
      meta: { guestOnly: true },
    },
    {
      path: '/register',
      name: 'register',
      component: RegisterView,
      meta: { guestOnly: true },
    },
    // Rota Pai (Layout)
    {
      path: '/',
      component: MainLayout,
      meta: { requiresAuth: true }, // Protege todo o layout e suas filhas
      children: [
        {
          path: '', // Rota raiz redireciona para cards
          redirect: '/cards',
        },
        {
          path: 'cards', // Vai renderizar em /cards dentro do layout
          name: 'cards',
          component: CardsView,
        },
        {
          path: 'trade',
          name: 'trade',
          component: TradeView,
        },
        {
          path: 'trades',
          name: 'trades',
          component: TradesView,
        },
        {
          path: 'cards/:id',
          name: 'card-details',
          component: CardDetailsView,
        },
        {
          path: 'collection',
          name: 'collection',
          component: CollectionView,
        },
        // Adicione outras páginas logadas aqui no futuro (ex: perfil, configurações)
      ],
    },
  ],
})

router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()
  const isAuthenticated = authStore.isAuthenticated

  if (to.meta.requiresAuth && !isAuthenticated) {
    next('/login')
  } else if (to.meta.guestOnly && isAuthenticated) {
    next('/cards')
  } else {
    next()
  }
})

export default router
