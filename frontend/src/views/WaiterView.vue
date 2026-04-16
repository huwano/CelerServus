<template>
  <div class="view-shell">
    <section class="hero-panel surface">
      <div>
        <p class="eyebrow">Service Hub</p>
        <h1 class="hero-title">Tische schnell aufnehmen, klar an Stationen senden.</h1>
        <p class="hero-copy">
          Die Bedienung arbeitet mobil in einem Fluss: Positionen sammeln, Order senden und
          Rückfragen direkt an Theke oder Küche schicken.
        </p>
      </div>

      <div class="metrics-grid">
        <MetricCard
          hint="eigene Orders sichtbar"
          label="Aktive Bestellungen"
          :value="activeOrdersCount"
          tone="accent"
        />
        <MetricCard
          hint="laufende Stationskommunikation"
          label="Nachrichten gesendet"
          :value="totalMessagesCount"
        />
        <MetricCard
          hint="noch nicht abgeschickt"
          label="Warenkorb"
          :value="draftItemsCount"
          tone="warning"
        />
      </div>
    </section>

    <div class="content-grid content-grid--two">
      <section class="form-panel surface">
        <div class="panel-head">
          <div>
            <p class="eyebrow">Neue Order</p>
            <h2 class="panel-title">Bestellung zusammenstellen</h2>
          </div>
          <span class="soft-pill">Mehrere Positionen</span>
        </div>

        <form class="stack" @submit.prevent="submitOrder">
          <div class="form-grid">
            <label>
              <span>Tisch</span>
              <input v-model="tableNumber" placeholder="z. B. 12" />
            </label>

            <label>
              <span>Initiale Notiz</span>
              <textarea
                v-model="initialNote"
                placeholder="Optionaler Hinweis für Theke oder Küche"
              />
            </label>
          </div>

          <div class="surface surface--soft form-panel">
            <div class="panel-head">
              <div>
                <p class="eyebrow">Position Builder</p>
                <h3 class="panel-title">Artikel hinzufügen</h3>
              </div>
            </div>

            <div class="form-grid">
              <label>
                <span>Artikel</span>
                <input v-model="itemName" placeholder="z. B. Apfelschorle" />
              </label>

              <label>
                <span>Kategorie</span>
                <select v-model="category">
                  <option value="drink">Getränk</option>
                  <option value="food">Speise</option>
                </select>
              </label>

              <label>
                <span>Anzahl</span>
                <input v-model.number="quantity" min="1" type="number" />
              </label>
            </div>

            <div class="stack-row">
              <span class="muted">Position zuerst sammeln, danach als Order senden.</span>
              <button class="secondary-button" type="button" @click="addDraftItem">
                Position hinzufügen
              </button>
            </div>
          </div>

          <div class="surface surface--soft form-panel">
            <div class="panel-head">
              <div>
                <p class="eyebrow">Vorbereitung</p>
                <h3 class="panel-title">Aktuelle Positionen</h3>
              </div>
              <span class="soft-pill">{{ draftItems.length }} gespeichert</span>
            </div>

            <p v-if="draftItems.length === 0" class="empty-state">
              Noch keine Positionen hinzugefügt.
            </p>

            <ul v-else class="data-list">
              <li v-for="draftItem in draftItems" :key="draftItem.id" class="draft-card">
                <div class="row-spread">
                  <div>
                    <p class="data-card__title">{{ draftItem.quantity }} x {{ draftItem.name }}</p>
                    <p class="data-card__meta">{{ categoryLabel(draftItem.category) }}</p>
                  </div>
                  <button
                    class="danger-button"
                    type="button"
                    @click="removeDraftItem(draftItem.id)"
                  >
                    Entfernen
                  </button>
                </div>
              </li>
            </ul>
          </div>

          <p v-if="formError" class="error-text">{{ formError }}</p>
          <button :disabled="submitting" type="submit">Bestellung anlegen</button>
        </form>
      </section>

      <section class="list-panel surface">
        <div class="panel-head">
          <div>
            <p class="eyebrow">Laufender Betrieb</p>
            <h2 class="panel-title">Meine Bestellungen</h2>
          </div>
          <button class="button--ghost" @click="loadOrders">Aktualisieren</button>
        </div>

        <p v-if="loading" class="empty-state">Lade Bestellungen...</p>
        <p v-else-if="loadError" class="error-text">{{ loadError }}</p>
        <p v-else-if="orders.length === 0" class="empty-state">
          Noch keine Bestellungen vorhanden.
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

            <p v-if="order.initialNote" class="muted">{{ order.initialNote }}</p>

            <ul class="inline-list">
              <li v-for="orderItem in order.items" :key="orderItem.id" class="inline-item">
                <div>
                  <strong>{{ orderItem.quantity }} x {{ orderItem.name }}</strong>
                  <p class="data-card__meta">{{ categoryLabel(orderItem.category) }}</p>
                </div>
                <span class="soft-pill">{{ statusLabel(orderItem.status) }}</span>
              </li>
            </ul>

            <div class="surface surface--soft form-panel">
              <div class="panel-head">
                <div>
                  <p class="eyebrow">Stationsnachrichten</p>
                  <h3 class="panel-title">Kommunikation</h3>
                </div>
                <span class="soft-pill">{{ order.messages.length }} gesendet</span>
              </div>

              <p v-if="order.messages.length === 0" class="empty-state">
                Noch keine Stationsnachrichten vorhanden.
              </p>

              <ul v-else class="data-list">
                <li v-for="message in order.messages" :key="message.id" class="message-card">
                  <p>{{ message.message }}</p>
                  <p class="data-card__meta">An {{ targetLabel(message.targetStations) }}</p>
                </li>
              </ul>

              <form class="stack" @submit.prevent="sendMessage(order.id)">
                <div class="form-grid">
                  <label>
                    <span>Ziel</span>
                    <select v-model="messageTargetByOrderId[order.id]">
                      <option value="both">Theke und Küche</option>
                      <option value="theke">Nur Theke</option>
                      <option value="kueche">Nur Küche</option>
                    </select>
                  </label>

                  <label>
                    <span>Neue Nachricht</span>
                    <textarea
                      v-model="messageDraftByOrderId[order.id]"
                      placeholder="z. B. Getränke zuerst an den Tisch"
                    />
                  </label>
                </div>

                <p v-if="messageErrorByOrderId[order.id]" class="error-text">
                  {{ messageErrorByOrderId[order.id] }}
                </p>

                <div class="stack-row">
                  <span class="muted">Die Nachricht wird chronologisch an die Order angehängt.</span>
                  <button :disabled="sendingMessageOrderId === order.id" type="submit">
                    Nachricht senden
                  </button>
                </div>
              </form>
            </div>
          </li>
        </ul>
      </section>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, onUnmounted, reactive, ref } from 'vue'
import MetricCard from '@/components/MetricCard.vue'
import { api, getErrorMessage, unwrapData } from '@/stores/api'
import { subscribeToOrderChanges } from '@/realtime/orders'

const tableNumber = ref('')
const itemName = ref('')
const category = ref('drink')
const quantity = ref(1)
const initialNote = ref('')
const draftItems = ref([])
const nextDraftItemId = ref(1)
const submitting = ref(false)
const formError = ref('')
const loadError = ref('')
const loading = ref(false)
const orders = ref([])
const sendingMessageOrderId = ref('')
const messageDraftByOrderId = reactive({})
const messageTargetByOrderId = reactive({})
const messageErrorByOrderId = reactive({})

const activeOrdersCount = computed(() =>
  orders.value.filter((order) => ['open', 'in_progress'].includes(order.status)).length,
)
const totalMessagesCount = computed(() =>
  orders.value.reduce((sum, order) => sum + order.messages.length, 0),
)
const draftItemsCount = computed(
  () => draftItems.value.length + (itemName.value.trim() ? 1 : 0),
)

function categoryLabel(value) {
  return value === 'drink' ? 'Getränk' : 'Speise'
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
  if (value === 'completed' || value === 'ready') return 'accent'
  if (value === 'cancelled') return 'danger'
  if (value === 'open' || value === 'new' || value === 'in_progress') return 'warning'
  return 'neutral'
}

function targetLabel(targetStations) {
  const labels = {
    both: 'Theke und Küche',
    theke: 'Theke',
    kueche: 'Küche',
  }

  if (!Array.isArray(targetStations)) {
    return labels[targetStations] || targetStations
  }

  const normalizedTargets = targetStations.map((target) => labels[target] || target)
  return normalizedTargets.join(', ')
}

function resetItemInputs() {
  itemName.value = ''
  category.value = 'drink'
  quantity.value = 1
}

function resetOrderForm() {
  tableNumber.value = ''
  initialNote.value = ''
  draftItems.value = []
  resetItemInputs()
}

function buildDraftItem() {
  const normalizedName = itemName.value.trim()

  if (!normalizedName) {
    throw new Error('Artikelname ist erforderlich')
  }

  if (!Number.isInteger(quantity.value) || quantity.value < 1) {
    throw new Error('Anzahl muss eine positive ganze Zahl sein')
  }

  return {
    id: `draft-${nextDraftItemId.value++}`,
    name: normalizedName,
    quantity: quantity.value,
    category: category.value,
  }
}

function ensureCurrentItemCaptured() {
  if (!itemName.value.trim()) {
    return
  }

  draftItems.value = [...draftItems.value, buildDraftItem()]
  resetItemInputs()
}

function addDraftItem() {
  formError.value = ''

  try {
    draftItems.value = [...draftItems.value, buildDraftItem()]
    resetItemInputs()
  } catch (error) {
    formError.value = error.message
  }
}

function removeDraftItem(itemId) {
  draftItems.value = draftItems.value.filter((item) => item.id !== itemId)
}

function normalizeMessageTarget(orderId) {
  if (!messageTargetByOrderId[orderId]) {
    messageTargetByOrderId[orderId] = 'both'
  }

  return messageTargetByOrderId[orderId]
}

async function loadOrders() {
  loading.value = true
  loadError.value = ''

  try {
    const payload = await api('/orders')
    orders.value = unwrapData(payload)

    orders.value.forEach((order) => {
      normalizeMessageTarget(order.id)
      if (messageDraftByOrderId[order.id] === undefined) {
        messageDraftByOrderId[order.id] = ''
      }
    })
  } catch (error) {
    loadError.value = getErrorMessage(error, 'Bestellungen konnten nicht geladen werden')
  } finally {
    loading.value = false
  }
}

async function submitOrder() {
  formError.value = ''
  submitting.value = true

  try {
    ensureCurrentItemCaptured()

    if (draftItems.value.length === 0) {
      throw new Error('Mindestens eine Position ist erforderlich')
    }

    await api('/orders', {
      method: 'POST',
      body: JSON.stringify({
        tableNumber: tableNumber.value,
        initialNote: initialNote.value,
        items: draftItems.value.map(({ name, quantity: itemQuantity, category: itemCategory }) => ({
          name,
          quantity: itemQuantity,
          category: itemCategory,
        })),
      }),
    })

    resetOrderForm()
    await loadOrders()
  } catch (error) {
    formError.value = getErrorMessage(error, error.message || 'Bestellung konnte nicht angelegt werden')
  } finally {
    submitting.value = false
  }
}

async function sendMessage(orderId) {
  messageErrorByOrderId[orderId] = ''
  sendingMessageOrderId.value = orderId

  try {
    await api(`/orders/${orderId}/messages`, {
      method: 'POST',
      body: JSON.stringify({
        message: messageDraftByOrderId[orderId] || '',
        targetStations: normalizeMessageTarget(orderId),
      }),
    })

    messageDraftByOrderId[orderId] = ''
    await loadOrders()
  } catch (error) {
    messageErrorByOrderId[orderId] = getErrorMessage(
      error,
      'Nachricht konnte nicht gesendet werden',
    )
  } finally {
    sendingMessageOrderId.value = ''
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
