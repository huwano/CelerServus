import { createRouter, createWebHistory } from 'vue-router'

import LoginView from '@/views/LoginView.vue'
import WaiterView from '@/views/WaiterView.vue'
import KitchenView from '@/views/KitchenView.vue'
import AdminView from '@/views/AdminView.vue'
import { useAuthStore } from '@/stores/auth'

const routes = [
  { path: '/login', name: 'login', component: LoginView },

  {
    path: '/waiter',
    name: 'waiter',
    component: WaiterView,
    meta: { requiresAuth: true, roles: ['waiter'] },
  },
  {
    path: '/kitchen',
    name: 'kitchen',
    component: KitchenView,
    meta: { requiresAuth: true, roles: ['kitchen'] },
  },
  {
    path: '/admin',
    name: 'admin',
    component: AdminView,
    meta: { requiresAuth: true, roles: ['admin'] },
  },

  { path: '/', redirect: '/login' },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

function homeByRole(role) {
  if (role === 'waiter') return '/waiter'
  if (role === 'kitchen') return '/kitchen'
  if (role === 'admin') return '/admin'
  return '/login'
}

router.beforeEach(async (to) => {
  const auth = useAuthStore()

  // 1) Einmalig User/Session vom Backend holen (wichtig für Refresh)
  if (!auth.loaded) {
    await auth.fetchMe()
  }

  // 2) Wenn schon eingeloggt und jemand geht auf /login -> zur Startseite
  if (to.name === 'login' && auth.isAuthenticated) {
    return homeByRole(auth.role)
  }

  // 3) Auth-Check
  if (to.meta.requiresAuth && !auth.isAuthenticated) {
    return { name: 'login', query: { redirect: to.fullPath } }
  }

  // 4) Role-Check (wenn roles definiert sind)
  const roles = to.meta.roles
  if (roles && auth.isAuthenticated && !roles.includes(auth.role)) {
    return homeByRole(auth.role)
  }

  // allow navigation
  return true
})

export default router
