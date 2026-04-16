<template>
  <div class="view-shell">
    <section class="hero-panel surface">
      <div>
        <p class="eyebrow">{{ eyebrow }}</p>
        <h1 class="hero-title">{{ title }}</h1>
        <p class="hero-copy">{{ description }}</p>
      </div>

      <div class="metrics-grid">
        <MetricCard
          hint="sichtbar für diese Station"
          label="Orders im Blick"
          :value="orders.length"
          tone="accent"
        />
        <MetricCard
          hint="noch nicht gestartet"
          label="Neu"
          :value="newItemsCount"
          tone="warning"
        />
        <MetricCard hint="bereit zum Abholen" label="Fertig" :value="readyItemsCount" />
      </div>
    </section>

    <section class="list-panel surface">
      <div class="panel-head">
        <div>
          <p class="eyebrow">Stationsliste</p>
          <h2 class="panel-title">Aktive Positionen</h2>
        </div>
        <button class="button--ghost" @click="loadOrders">Aktualisieren</button>
      </div>

      <p v-if="loading" class="empty-state">Lade Bestellungen...</p>
      <p v-else-if="error" class="error-text">{{ error }}</p>
      <p v-else-if="orders.length === 0" class="empty-state">
        Keine Bestellungen für diese Station.
      </p>

      <ul v-else class="data-list">
        <li v-for="order in orders" :key="order.id" class="data-card">
          <div class="row-spread">
            <div>
              <p class="data-card__title">Tisch {{ order.tableNumber }}</p>
              <p class="data-card__meta">Bestellung {{ order.id }}</p>
            </div>
            <span class="status-pill" :data-tone="statusTone(order.status)">
              {{ statusLabel(order.status) }}
            </span>
          </div>

          <ul class="inline-list">
            <li v-for="item in order.items" :key="item.id" class="inline-item">
              <div>
                <strong>{{ item.quantity }} x {{ item.name }}</strong>
                <p class="data-card__meta">{{ statusLabel(item.status) }}</p>
              </div>

              <button
                v-if="nextStatus(item.status)"
                :disabled="savingItemId === item.id"
                @click="advanceItem(order.id, item.id, nextStatus(item.status))"
              >
                {{ actionLabel(item.status) }}
              </button>
            </li>
          </ul>

          <div v-if="order.messages.length" class="surface surface--soft form-panel">
            <div class="panel-head">
              <div>
                <p class="eyebrow">Nachrichten</p>
                <h3 class="panel-title">Für diese Station sichtbar</h3>
              </div>
            </div>

            <ul class="data-list">
              <li v-for="message in order.messages" :key="message.id" class="message-card">
                <p>{{ message.message }}</p>
              </li>
            </ul>
          </div>
        </li>
      </ul>
    </section>
  </div>
</template>

<script setup>
import { computed, onMounted, onUnmounted, ref } from 'vue'
import MetricCard from '@/components/MetricCard.vue'
import { api, getErrorMessage, unwrapData } from '@/stores/api'
import { subscribeToOrderChanges } from '@/realtime/orders'

defineProps({
  eyebrow: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    default: '',
  },
})

const orders = ref([])
const error = ref('')
const loading = ref(false)
const savingItemId = ref('')

const stationItems = computed(() => orders.value.flatMap((order) => order.items))
const newItemsCount = computed(
  () => stationItems.value.filter((item) => item.status === 'new').length,
)
const readyItemsCount = computed(
  () => stationItems.value.filter((item) => item.status === 'ready').length,
)

function statusLabel(value) {
  const labels = {
    open: 'Offen',
    in_progress: 'In Bearbeitung',
    completed: 'Abgeschlossen',
    cancelled: 'Storniert',
    new: 'Neu',
    ready: 'Fertig',
  }

  return labels[value] || value
}

function statusTone(value) {
  if (value === 'completed' || value === 'ready') return 'accent'
  if (value === 'cancelled') return 'danger'
  return 'warning'
}

function nextStatus(status) {
  if (status === 'new') return 'in_progress'
  if (status === 'in_progress') return 'ready'
  return null
}

function actionLabel(status) {
  if (status === 'new') return 'Starten'
  if (status === 'in_progress') return 'Fertig melden'
  return ''
}

async function loadOrders() {
  loading.value = true
  error.value = ''

  try {
    const payload = await api('/orders')
    orders.value = unwrapData(payload)
  } catch (requestError) {
    error.value = getErrorMessage(requestError, 'Bestellungen konnten nicht geladen werden')
  } finally {
    loading.value = false
  }
}

async function advanceItem(orderId, itemId, status) {
  savingItemId.value = itemId
  error.value = ''

  try {
    await api(`/orders/${orderId}/items/${itemId}`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    })

    await loadOrders()
  } catch (requestError) {
    error.value = getErrorMessage(requestError, 'Status konnte nicht geändert werden')
  } finally {
    savingItemId.value = ''
  }
}

onMounted(loadOrders)

const unsubscribe = subscribeToOrderChanges(() => {
  loadOrders()
})

onUnmounted(() => {
  unsubscribe()
})
</script>
