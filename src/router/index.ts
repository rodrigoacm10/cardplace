import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import LoginView from '../views/LoginView.vue'
import RegisterView from '../views/RegisterView.vue'
import CardsView from '../views/CardsView.vue'
import TradeView from '../views/TradeView.vue'
import TradesView from '../views/TradesView.vue'
import CardDetailsView from '../views/CardDetailsView.vue'
import CollectionView from '../views/CollectionView.vue'
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
