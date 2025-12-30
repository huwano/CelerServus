<template>
  <div style="padding: 2rem; font-family: sans-serif">
    <h1>CelerServus – Login</h1>

    <form @submit.prevent="onLogin" style="display: grid; gap: 0.75rem; max-width: 320px">
      <input v-model="username" placeholder="Benutzername" autocomplete="username" />
      <input
        v-model="password"
        placeholder="Passwort"
        type="password"
        autocomplete="current-password"
      />
      <button type="submit">Einloggen</button>
      <p v-if="error" style="color: darkred">{{ error }}</p>
    </form>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const route = useRoute()
const auth = useAuthStore()

const username = ref('')
const password = ref('')
const error = ref('')

function homeByRole(role) {
  if (role === 'waiter') return '/waiter'
  if (role === 'kitchen') return '/kitchen'
  if (role === 'admin') return '/admin'
  return '/login'
}

async function onLogin() {
  error.value = ''
  try {
    const user = await auth.login(username.value, password.value)
    const redirect = route.query.redirect?.toString()
    await router.replace(redirect || homeByRole(user.role))
  } catch (e) {
    error.value = e?.error || 'Login fehlgeschlagen'
  }
}
</script>
