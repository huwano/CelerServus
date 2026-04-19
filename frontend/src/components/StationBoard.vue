<template>
  <div class="view-shell view-shell--with-bottom-bar">
    <section class="list-panel surface station-board__header">
      <div>
        <p class="eyebrow">{{ eyebrow }}</p>
        <h1 class="panel-title">{{ title }}</h1>
        <p class="muted">{{ description }}</p>
      </div>
      <div class="station-board__header-meta">
        <span class="soft-pill">{{ orders.length }} Orders</span>
        <BaseButton variant="ghost" @click="loadOrders">Aktualisieren</BaseButton>
      </div>
    </section>

    <p v-if="loading" class="empty-state">Lade Bestellungen...</p>
    <p v-else-if="error" class="error-text">{{ error }}</p>
    <p v-else-if="tickets.length === 0" class="empty-state">Keine Tickets für diese Station.</p>

    <div v-else class="station-board__lanes">
      <section v-for="lane in lanes" :key="lane.key" class="surface station-board__lane">
        <header class="station-board__lane-head">
          <h2 class="panel-title">{{ lane.label }}</h2>
          <span class="status-pill" :data-tone="lane.tone">{{ lane.items.length }}</span>
        </header>

        <p v-if="lane.items.length === 0" class="empty-state">Aktuell leer.</p>

        <ul v-else class="station-board__ticket-list">
          <li v-for="ticket in lane.items" :key="ticket.id" class="station-board__ticket surface surface--soft">
            <div class="row-spread">
              <div>
                <p class="data-card__title">Tisch {{ ticket.tableNumber }}</p>
                <p class="data-card__meta">{{ ticket.waitLabel }} · Bestellung {{ ticket.orderId }}</p>
              </div>
              <span class="status-pill" :data-tone="statusTone(ticket.status)">
                {{ statusLabel(ticket.status) }}
              </span>
            </div>

            <p class="station-board__item-line">
              <strong>{{ ticket.quantity }} x {{ ticket.name }}</strong>
            </p>

            <p v-if="ticket.lastMessage" class="data-card__meta">Hinweis: {{ ticket.lastMessage }}</p>

            <div class="station-board__actions">
              <BaseButton
                v-if="nextStatus(ticket.status)"
                block
                :disabled="savingItemId === ticket.id"
                @click="advanceItem(ticket.orderId, ticket.id, nextStatus(ticket.status))"
              >
                {{ actionLabel(ticket.status) }}
              </BaseButton>
            </div>
          </li>
        </ul>
      </section>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, onUnmounted, ref } from 'vue'
import BaseButton from '@/components/ui/BaseButton.vue'
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

const tickets = computed(() =>
  orders.value.flatMap((order) => {
    const latestMessage = Array.isArray(order.messages) && order.messages.length
      ? order.messages[order.messages.length - 1].message
      : ''

    return (order.items || []).map((item) => ({
      ...item,
      orderId: order.id,
      tableNumber: order.tableNumber,
      lastMessage: latestMessage,
      waitLabel: buildWaitLabel(item.createdAt || order.createdAt),
    }))
  }),
)

const lanes = computed(() => {
  const laneDefs = [
    { key: 'new', label: 'Neu', tone: 'warning' },
    { key: 'in_progress', label: 'In Arbeit', tone: 'warning' },
    { key: 'ready', label: 'Fertig', tone: 'success' },
  ]

  return laneDefs.map((lane) => ({
    ...lane,
    items: tickets.value.filter((ticket) => ticket.status === lane.key),
  }))
})

function buildWaitLabel(dateValue) {
  if (!dateValue) {
    return 'Zeit unbekannt'
  }

  const ageInMs = Date.now() - new Date(dateValue).getTime()
  const minutes = Math.max(0, Math.round(ageInMs / 60000))
  return `${minutes} min`
}

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
  if (value === 'completed' || value === 'ready') return 'success'
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

<style scoped>
.station-board__header {
  display: grid;
  gap: var(--space-3);
}

.station-board__header-meta {
  display: grid;
  grid-template-columns: 1fr;
  gap: var(--space-2);
}

.station-board__lanes {
  display: grid;
  gap: var(--space-3);
}

.station-board__lane {
  padding: var(--space-3);
  display: grid;
  gap: var(--space-3);
}

.station-board__lane-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-2);
}

.station-board__ticket-list {
  display: grid;
  gap: var(--space-2);
}

.station-board__ticket {
  padding: var(--space-3);
  display: grid;
  gap: var(--space-2);
}

.station-board__item-line {
  margin: 0;
}

.station-board__actions {
  margin-top: var(--space-1);
}

@media (min-width: 768px) {
  .station-board__header-meta {
    grid-template-columns: auto auto;
    justify-content: start;
  }

  .station-board__lanes {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (min-width: 1024px) {
  .station-board__lanes {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
}
</style>

