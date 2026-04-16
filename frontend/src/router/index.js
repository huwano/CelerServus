import { createRouter, createWebHistory } from 'vue-router'

import LoginView from '@/views/LoginView.vue'
import WaiterView from '@/views/WaiterView.vue'
import ThekeView from '@/views/ThekeView.vue'
import KitchenView from '@/views/KitchenView.vue'
import AdminView from '@/views/AdminView.vue'
import { useAuthStore } from '@/stores/auth'
import { homeByRole } from '@/lib/home-by-role'

const routes = [
  {
    path: '/login',
    name: 'login',
    component: LoginView,
    meta: { public: true, title: 'Willkommen zurück' },
  },

  {
    path: '/bedienung',
    name: 'bedienung',
    component: WaiterView,
    meta: {
      requiresAuth: true,
      roles: ['bedienung'],
      title: 'Service Hub',
    },
  },
  {
    path: '/theke',
    name: 'theke',
    component: ThekeView,
    meta: {
      requiresAuth: true,
      roles: ['theke'],
      title: 'Getränke-Board',
    },
  },
  {
    path: '/kueche',
    name: 'kueche',
    component: KitchenView,
    meta: {
      requiresAuth: true,
      roles: ['kueche'],
      title: 'Küchenpass',
    },
  },
  {
    path: '/admin',
    name: 'admin',
    component: AdminView,
    meta: {
      requiresAuth: true,
      roles: ['admin'],
      title: 'Leitstand',
    },
  },
  { path: '/waiter', redirect: '/bedienung' },
  { path: '/kitchen', redirect: '/kueche' },

  { path: '/', redirect: '/login' },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

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
