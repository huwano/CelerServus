<template>
  <div style="padding: 2rem; font-family: sans-serif">
    <h1>Kellner</h1>

    <div style="margin-bottom: 1rem">
      <button @click="logout">Logout</button>
    </div>

    <h2>Neue Bestellung</h2>
    <div style="margin-bottom: 2rem">
      <input v-model="item" placeholder="Artikel" />
      <input
        v-model.number="quantity"
        type="number"
        placeholder="Anzahl"
        style="width: 60px; margin-left: 0.5rem"
      />
      <button @click="sendOrder" style="margin-left: 0.5rem">Bestellen</button>
    </div>

    <h2>Alle Bestellungen</h2>
    <ul>
      <li v-for="order in orders" :key="order.id">
        {{ order.quantity }} × {{ order.item }} - Status: {{ order.status }}
      </li>
    </ul>
    <button @click="loadOrders">Aktualisieren</button>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { io } from 'socket.io-client'
import { useAuthStore } from '@/stores/auth'
import { useRouter } from 'vue-router'

const router = useRouter()
const auth = useAuthStore()

const item = ref('')
const quantity = ref(1)
const orders = ref([])

const BACKEND_URL = 'http://localhost:3000'

// wichtig: Cookies mitsenden (für spätere Socket-Auth)
const socket = io(BACKEND_URL, { withCredentials: true })

async function sendOrder() {
  if (!item.value) return alert('Artikel eingeben')

  const res = await fetch(`${BACKEND_URL}/orders`, {
    method: 'POST',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ item: item.value, quantity: quantity.value }),
  })

  await res.json()
  item.value = ''
  quantity.value = 1
}

async function loadOrders() {
  const res = await fetch(`${BACKEND_URL}/orders`, { credentials: 'include' })
  orders.value = await res.json()
}

socket.on('new-order', (order) => {
  orders.value.push(order)
})

async function logout() {
  await auth.logout()
  await router.replace('/login')
}

onMounted(loadOrders)
onUnmounted(() => socket.disconnect())
</script>
