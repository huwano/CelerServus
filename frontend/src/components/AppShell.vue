<template>
  <div class="shell shell--compact">
    <header class="shell__topbar shell__topbar--compact surface">
      <div class="shell__topbar-left">
        <h2 class="shell__route-title" :title="currentTitle">{{ currentTitle }}</h2>
      </div>

      <div class="shell__topbar-right">
        <button
          class="button button--ghost shell__action-btn shell__theme-toggle"
          :aria-label="themeToggleLabel"
          :title="themeToggleLabel"
          type="button"
          @click="toggleTheme"
        >
          <svg aria-hidden="true" class="shell__icon" viewBox="0 0 24 24">
            <path
              d="M12 3.5V5.5M12 18.5V20.5M5.5 12H3.5M20.5 12H18.5M6.7 6.7L5.3 5.3M18.7 18.7L17.3 17.3M17.3 6.7L18.7 5.3M5.3 18.7L6.7 17.3M15.5 12A3.5 3.5 0 1 1 8.5 12A3.5 3.5 0 0 1 15.5 12Z"
            />
          </svg>
          <span class="u-sr-only">{{ themeToggleLabel }}</span>
        </button>
        <button
          class="button button--ghost shell__action-btn shell__logout"
          aria-label="Abmelden"
          title="Abmelden"
          type="button"
          @click="logout"
        >
          <svg aria-hidden="true" class="shell__icon" viewBox="0 0 24 24">
            <path d="M15 7V4.5H5V19.5H15V17" />
            <path d="M10 12H20" />
            <path d="M17 9L20 12L17 15" />
          </svg>
          <span class="u-sr-only">Abmelden</span>
        </button>
      </div>
    </header>

    <main class="shell__main shell__main--compact">

      <div class="shell__content">
        <slot />
      </div>
    </main>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useThemeStore } from '@/stores/theme'
import { getRoleMeta } from '@/lib/navigation'

const route = useRoute()
const router = useRouter()
const auth = useAuthStore()
const theme = useThemeStore()

const roleMeta = computed(() => getRoleMeta(auth.role))
const currentTitle = computed(() => route.meta.title || roleMeta.value.shortLabel)
const themeToggleLabel = computed(() => (theme.isDark ? 'Hellmodus' : 'Dunkelmodus'))

async function logout() {
  await auth.logout()
  await router.replace('/login')
}

function toggleTheme() {
  theme.toggleTheme()
}
</script>
