<template>
  <div class="shell">
    <div
      v-if="menuOpen"
      aria-hidden="true"
      class="shell__overlay"
      @click="menuOpen = false"
    />

    <aside class="shell__drawer" :class="{ 'shell__drawer--open': menuOpen }">
      <div class="shell__brand">
        <div>
          <p class="shell__brand-mark">CelerServus</p>
          <h1 class="shell__brand-title">{{ roleMeta.shortLabel }}</h1>
        </div>
        <button
          aria-label="Menü schließen"
          class="shell__close"
          type="button"
          @click="menuOpen = false"
        >
          x
        </button>
      </div>

      <section class="shell__profile surface surface--soft">
        <p class="eyebrow">Aktive Rolle</p>
        <strong>{{ roleMeta.label }}</strong>
        <p class="shell__muted">{{ roleMeta.description }}</p>
        <p class="shell__muted">Angemeldet als {{ auth.user?.username || 'unbekannt' }}</p>
      </section>

      <nav class="shell__nav">
        <p class="shell__nav-title">Navigation</p>
        <RouterLink
          v-for="item in navigation"
          :key="item.to"
          :to="item.to"
          class="shell__nav-link"
          :class="{ 'shell__nav-link--active': route.path === item.to }"
          @click="menuOpen = false"
        >
          <strong>{{ item.label }}</strong>
          <span>{{ item.caption }}</span>
        </RouterLink>
      </nav>

      <section class="shell__info surface surface--soft">
        <p class="eyebrow">Live Status</p>
        <strong>Realtime aktiv</strong>
        <p class="shell__muted">
          Änderungen an Bestellungen werden auf allen offenen Ansichten synchronisiert.
        </p>
      </section>

      <button class="button button--ghost shell__logout" type="button" @click="logout">
        Abmelden
      </button>
    </aside>

    <div class="shell__main">
      <header class="shell__topbar">
        <div class="shell__topbar-left">
          <button
            aria-label="Navigation öffnen"
            class="shell__burger"
            type="button"
            @click="menuOpen = !menuOpen"
          >
            <span />
            <span />
            <span />
          </button>

          <div>
            <p class="eyebrow">{{ roleMeta.label }}</p>
            <h2 class="shell__route-title">{{ currentTitle }}</h2>
          </div>
        </div>

        <div class="shell__topbar-right">
          <span class="shell__status">Live</span>
        </div>
      </header>

      <main class="shell__content">
        <slot />
      </main>
    </div>
  </div>
</template>

<script setup>
import { computed, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { getNavigationForRole, getRoleMeta } from '@/lib/navigation'

const route = useRoute()
const router = useRouter()
const auth = useAuthStore()
const menuOpen = ref(false)

const roleMeta = computed(() => getRoleMeta(auth.role))
const navigation = computed(() => getNavigationForRole(auth.role))
const currentTitle = computed(() => route.meta.title || roleMeta.value.shortLabel)

watch(
  () => route.fullPath,
  () => {
    menuOpen.value = false
  },
)

async function logout() {
  await auth.logout()
  menuOpen.value = false
  await router.replace('/login')
}
</script>
