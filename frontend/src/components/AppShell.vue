<template>
  <div class="shell shell--compact">
    <header class="shell__topbar shell__topbar--compact surface">
      <div class="shell__topbar-left">
        <div>
          <p class="eyebrow">{{ roleMeta.label }}</p>
          <h2 class="shell__route-title">{{ currentTitle }}</h2>
        </div>
      </div>

      <div class="shell__topbar-right">
        <span class="shell__status">Live</span>
        <button class="button button--ghost shell__theme-toggle" type="button" @click="toggleTheme">
          {{ themeToggleLabel }}
        </button>
        <button class="button button--ghost shell__logout" type="button" @click="logout">
          Abmelden
        </button>
      </div>
    </header>

    <main class="shell__main shell__main--compact">
      <section class="shell__profile surface surface--soft">
        <p class="eyebrow">Aktive Rolle</p>
        <strong>{{ roleMeta.label }}</strong>
        <p class="shell__muted">{{ roleMeta.description }}</p>
        <p class="shell__muted">Angemeldet als {{ auth.user?.username || 'unbekannt' }}</p>
      </section>

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
