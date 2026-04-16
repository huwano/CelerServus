<template>
  <div class="login-screen">
    <div class="login-layout">
      <section class="login-panel surface">
        <p class="login-kicker">Restaurant Flow</p>
        <h1 class="login-title">Service, Theke und Küche in einem ruhigen Interface.</h1>
        <p class="login-copy">
          CelerServus bündelt Bestellungen, Stationsstatus und Nachrichten in einer mobilen
          Oberfläche, die schnell bedienbar bleibt, auch wenn es voll wird.
        </p>

        <div class="metrics-grid">
          <MetricCard hint="für Service und Stationen" label="Mobile First" value="1 UI" tone="accent" />
          <MetricCard hint="ohne manuelles Refresh-Chaos" label="Realtime" value="Live" />
          <MetricCard hint="klare Rollen im Betrieb" label="Arbeitsbereiche" value="4" tone="warning" />
        </div>
      </section>

      <section class="login-aside surface">
        <div class="stack">
          <div>
            <p class="eyebrow">Anmeldung</p>
            <h2 class="panel-title">Willkommen zurück</h2>
          </div>

          <form class="login-form" @submit.prevent="onLogin">
            <label>
              <span>Benutzername</span>
              <input v-model="username" autocomplete="username" placeholder="z. B. kellner1" />
            </label>

            <label>
              <span>Passwort</span>
              <input
                v-model="password"
                autocomplete="current-password"
                placeholder="Passwort"
                type="password"
              />
            </label>

            <p v-if="error" class="error-text">{{ error }}</p>
            <button type="submit">Einloggen</button>
          </form>
        </div>

        <div class="stack">
          <div class="panel-head">
            <div>
              <p class="eyebrow">Testzugänge</p>
              <h3 class="panel-title">Sofort ausprobieren</h3>
            </div>
          </div>

          <div class="demo-list">
            <article v-for="account in accounts" :key="account.username" class="demo-card">
              <div class="row-spread">
                <strong>{{ account.label }}</strong>
                <span class="soft-pill">{{ account.role }}</span>
              </div>
              <p class="muted"><code>{{ account.username }}</code> / <code>{{ account.password }}</code></p>
            </article>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import MetricCard from '@/components/MetricCard.vue'
import { homeByRole } from '@/lib/home-by-role'
import { useAuthStore } from '@/stores/auth'
import { getErrorMessage } from '@/stores/api'

const router = useRouter()
const route = useRoute()
const auth = useAuthStore()

const username = ref('')
const password = ref('')
const error = ref('')

const accounts = [
  { label: 'Bedienung', role: 'bedienung', username: 'kellner1', password: 'test123' },
  { label: 'Theke', role: 'theke', username: 'theke1', password: 'test123' },
  { label: 'Küche', role: 'kueche', username: 'kueche1', password: 'test123' },
  { label: 'Admin', role: 'admin', username: 'admin1', password: 'test123' },
]

async function onLogin() {
  error.value = ''

  try {
    const user = await auth.login(username.value, password.value)
    const redirect = route.query.redirect?.toString()
    await router.replace(redirect || homeByRole(user.role))
  } catch (requestError) {
    error.value = getErrorMessage(requestError, 'Login fehlgeschlagen')
  }
}
</script>
