<template>
  <div id="app" style="padding: 2rem; font-family: sans-serif;">
    <h1>Fest-Bestellung Demo</h1>

    <!-- Bestellformular -->
    <div style="margin-bottom: 2rem;">
      <input v-model="item" placeholder="Artikel" />
      <input v-model.number="quantity" type="number" placeholder="Anzahl" style="width: 60px; margin-left: 0.5rem;" />
      <button @click="sendOrder" style="margin-left: 0.5rem;">Bestellen</button>
    </div>

    <!-- Bestellübersicht -->
    <div>
      <h2>Alle Bestellungen</h2>
      <ul>
        <li v-for="order in orders" :key="order.id">
          {{ order.quantity }} × {{ order.item }} - Status: {{ order.status }}
        </li>
      </ul>
      <button @click="loadOrders">Aktualisieren</button>
    </div>
  </div>
</template>

<script setup>
  import { ref, onMounted, onUnmounted } from 'vue'
  import { io } from 'socket.io-client'

  const item = ref('')
  const quantity = ref(1)
  const orders = ref([])

  const BACKEND_URL = 'http://localhost:3000'

  // Socket.IO-Verbindung herstellen
  const socket = io(BACKEND_URL)

  const sendOrder = async () => {
  if (!item.value) return alert('Artikel eingeben')
  const res = await fetch(`${BACKEND_URL}/orders`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ item: item.value, quantity: quantity.value })
})
  const data = await res.json()
  console.log(data)
  item.value = ''
  quantity.value = 1
}

  const loadOrders = async () => {
  const res = await fetch(`${BACKEND_URL}/orders`)
  orders.value = await res.json()
}

  // 🔥 Realtime-Event empfangen
  socket.on('new-order', (order) => {
  console.log('Neue Bestellung empfangen:', order)
  orders.value.push(order)
})

  onMounted(() => {
  loadOrders()
})

  onUnmounted(() => {
  socket.disconnect()
})
</script>


<style>
button {
  cursor: pointer;
}
</style>
