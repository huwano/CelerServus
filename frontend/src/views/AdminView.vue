<template>
  <div class="view-shell">
    <section class="hero-panel surface">
      <div>
        <p class="eyebrow">Leitstand</p>
        <h1 class="hero-title">Alle Stationen in einer klaren Operations-Ansicht.</h1>
        <p class="hero-copy">
          Admin sieht die komplette Lage: aktive Orders, Abschlussquote und aktuelle Last über alle
          Stationen hinweg.
        </p>
      </div>

      <div class="metrics-grid">
        <MetricCard hint="gesamt im System" label="Bestellungen" :value="orders.length" tone="accent" />
        <MetricCard
          hint="offen oder in Bearbeitung"
          label="Aktiv"
          :value="activeOrdersCount"
          tone="warning"
        />
        <MetricCard hint="vollständig abgeschlossen" label="Erledigt" :value="completedOrdersCount" />
      </div>
    </section>

    <section class="list-panel surface">
      <div class="panel-head">
        <div>
          <p class="eyebrow">Systemstatus</p>
          <h2 class="panel-title">Alle Bestellungen</h2>
        </div>
        <button class="button--ghost" @click="loadOrders">Aktualisieren</button>
      </div>

      <p v-if="loading" class="empty-state">Lade Bestellungen...</p>
      <p v-else-if="error" class="error-text">{{ error }}</p>
      <p v-else-if="orders.length === 0" class="empty-state">Keine Bestellungen vorhanden.</p>

      <ul v-else class="data-list">
        <li v-for="order in orders" :key="order.id" class="data-card">
          <div class="row-spread">
            <div>
              <p class="data-card__title">Tisch {{ order.tableNumber }}</p>
              <p class="data-card__meta">Erstellt von {{ order.createdByUserId }}</p>
            </div>
            <span class="status-pill" :data-tone="statusTone(order.status)">
              {{ statusLabel(order.status) }}
            </span>
          </div>

          <ul class="inline-list">
            <li v-for="item in order.items" :key="item.id" class="inline-item">
              <div>
                <strong>{{ item.quantity }} x {{ item.name }}</strong>
                <p class="data-card__meta">{{ item.station }}</p>
              </div>
              <span class="soft-pill">{{ statusLabel(item.status) }}</span>
            </li>
          </ul>
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

const orders = ref([])
const error = ref('')
const loading = ref(false)

const activeOrdersCount = computed(() =>
  orders.value.filter((order) => ['open', 'in_progress'].includes(order.status)).length,
)
const completedOrdersCount = computed(
  () => orders.value.filter((order) => order.status === 'completed').length,
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

onMounted(loadOrders)

const unsubscribe = subscribeToOrderChanges(() => {
  loadOrders()
})

onUnmounted(() => {
  unsubscribe()
})
</script>
