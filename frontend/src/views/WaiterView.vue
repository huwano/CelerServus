<template>
  <div class="view-shell view-shell--with-bottom-bar">
    <section class="hero-panel surface waiter-hero">
      <h1 class="hero-title">Service Hub</h1>
      <span class="soft-pill">{{ draftItemsCount }}</span>
    </section>

    <div class="view-tabs" role="tablist" aria-label="Ansicht">
      <button
        class="view-tab"
        :class="{ 'view-tab--active': activeSection === 'catalog' }"
        role="tab"
        type="button"
        @click="activeSection = 'catalog'"
      >
        Katalog
      </button>
      <button
        class="view-tab"
        :class="{ 'view-tab--active': activeSection === 'orders' }"
        role="tab"
        type="button"
        @click="activeSection = 'orders'"
      >
        Tischuebersicht
      </button>
    </div>

    <div class="content-grid content-grid--two">
      <section v-if="activeSection === 'catalog'" class="form-panel surface waiter-panel-flat">
        <div class="panel-head">
          <h2 class="panel-title">Neue Order</h2>
          <button
            :aria-expanded="showInitialNote"
            class="button--ghost search-toggle"
            title="Notiz"
            type="button"
            @click="showInitialNote = !showInitialNote"
          >
            <span class="waiter-note-icon" aria-hidden="true" />
            <span class="sr-only">Notiz</span>
          </button>
        </div>

        <form class="stack waiter-order-form" @submit.prevent="submitOrder">
          <div class="form-grid waiter-head-grid">
            <label :class="{ 'field-error': tableError }">
              <span>Tisch</span>
              <input
                v-model="tableNumber"
                :aria-invalid="tableError"
                :class="{ 'input-error': tableError }"
                placeholder="z. B. 12"
                @input="clearTableError"
              />
            </label>

            <label v-if="showInitialNote">
              <span>Notiz</span>
              <textarea v-model="initialNote" placeholder="Notiz" />
            </label>
          </div>

          <div class="surface surface--soft form-panel waiter-builder">
            <div class="panel-head">
              <h3 class="panel-title">Katalog</h3>
              <span class="soft-pill">{{ categoryLabel(category) }}</span>
            </div>

            <div class="category-tabs" role="tablist" aria-label="Katalogkategorien">
              <button
                v-for="categoryOption in categoryOptions"
                :key="categoryOption.value"
                :aria-selected="category === categoryOption.value"
                class="category-tab"
                :class="{ 'category-tab--active': category === categoryOption.value }"
                role="tab"
                type="button"
                @click="category = categoryOption.value"
              >
                {{ categoryOption.label }}
              </button>
            </div>

            <div class="catalog-toolbar">
              <button
                :aria-expanded="showSearch"
                class="button--ghost search-toggle"
                title="Suche"
                type="button"
                @click="showSearch = !showSearch"
              >
                <span class="search-toggle__icon" aria-hidden="true" />
                <span class="sr-only">Suche</span>
              </button>
              <label v-if="showSearch" class="catalog-search-field">
                <span class="sr-only">Suche im Katalog</span>
                <input
                  v-model="itemSearch"
                  placeholder="Filtern"
                  aria-label="Suche im Katalog"
                />
              </label>
            </div>

            <div class="stack waiter-catalog-stack">
              <span class="soft-pill">{{ filteredCatalogItems.length }}</span>
              <CatalogItemGrid
                class="waiter-catalog-grid"
                :items="displayCatalogItems"
                empty-text="Keine Treffer"
                @item-tap="addCatalogItemByKey"
              />
            </div>
          </div>

          <BottomActionBar>
            <template #meta>
              <div :class="['draft-meta', { 'draft-meta--compact': draftItemsCount === 0 }]">
                <strong>{{ draftActionLabel }}</strong>
                <span v-if="draftActionHint" class="muted">{{ draftActionHint }}</span>
              </div>
            </template>

            <BaseButton
              v-if="hasDraftContent"
              block
              :disabled="!hasDraftContent || submitting"
              type="button"
              variant="outline"
              @click="resetOrderForm"
            >
              Leeren
            </BaseButton>

            <BaseButton
              v-if="canSubmitOrder"
              block
              :disabled="!canSubmitOrder || submitting"
              type="submit"
              variant="success"
            >
              {{ submitting ? 'Sende...' : 'Senden' }}
            </BaseButton>
          </BottomActionBar>
        </form>
      </section>

      <section v-else class="list-panel surface">
        <div class="panel-head">
          <h2 class="panel-title">Meine Bestellungen</h2>
          <BaseButton
            aria-label="Aktualisieren"
            class="waiter-icon-btn"
            title="Aktualisieren"
            variant="ghost"
            @click="loadOrders"
          >
            <svg aria-hidden="true" class="waiter-inline-icon" viewBox="0 0 24 24">
              <path d="M20 12A8 8 0 1 1 17.6 6.2" />
              <path d="M20 4V10H14" />
            </svg>
            <span class="sr-only">Aktualisieren</span>
          </BaseButton>
        </div>

        <p v-if="loading" class="empty-state empty-state--compact">Lade...</p>
        <p v-else-if="loadError" class="error-text">{{ loadError }}</p>
        <p v-else-if="orders.length === 0" class="empty-state empty-state--compact">Leer</p>

        <ul v-else class="data-list">
          <li v-for="order in orders" :key="order.id" class="data-card">
            <div class="row-spread">
              <div>
                <p class="data-card__title">Tisch {{ order.tableNumber }}</p>
                <p class="data-card__meta">{{ order.items.length }} Artikel</p>
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

            <div class="surface surface--soft form-panel waiter-message-panel">
              <div class="panel-head">
                <h3 class="panel-title">Kommunikation</h3>
                <span class="soft-pill">{{ order.messages.length }}</span>
              </div>

              <p v-if="order.messages.length === 0" class="empty-state empty-state--compact">Leer</p>

              <ul v-else class="data-list">
                <li v-for="message in order.messages" :key="message.id" class="message-card">
                  <p>{{ message.message }}</p>
                  <p class="data-card__meta">{{ targetLabel(message.targetStations) }}</p>
                </li>
              </ul>

              <form class="stack" @submit.prevent="sendMessage(order.id)">
                <div class="target-tabs" role="tablist" aria-label="Nachrichtenziel">
                  <button
                    v-for="targetOption in messageTargetOptions"
                    :key="targetOption.value"
                    class="target-tab"
                    :class="{ 'target-tab--active': messageTargetByOrderId[order.id] === targetOption.value }"
                    role="tab"
                    type="button"
                    @click="messageTargetByOrderId[order.id] = targetOption.value"
                  >
                    {{ targetOption.label }}
                  </button>
                </div>

                <div class="catalog-toolbar">
                  <button
                    :aria-expanded="Boolean(messageComposerOpenByOrderId[order.id])"
                    class="button--ghost search-toggle"
                    title="Nachricht"
                    type="button"
                    @click="toggleMessageComposer(order.id)"
                  >
                    <span class="waiter-note-icon" aria-hidden="true" />
                    <span class="sr-only">Nachricht</span>
                  </button>
                  <label v-if="messageComposerOpenByOrderId[order.id]" class="catalog-search-field">
                    <span class="sr-only">Neue Nachricht</span>
                    <textarea v-model="messageDraftByOrderId[order.id]" placeholder="Nachricht" />
                  </label>
                </div>

                <p v-if="messageErrorByOrderId[order.id]" class="error-text">
                  {{ messageErrorByOrderId[order.id] }}
                </p>

                <div class="stack-row">
                  <BaseButton
                    :disabled="sendingMessageOrderId === order.id"
                    type="submit"
                    variant="primary"
                  >
                    Senden
                  </BaseButton>
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
import { computed, onMounted, onUnmounted, reactive, ref, watch } from 'vue'
import CatalogItemGrid from '@/components/app/CatalogItemGrid.vue'
import BaseButton from '@/components/ui/BaseButton.vue'
import BottomActionBar from '@/components/ui/BottomActionBar.vue'
import { buildOrderPayload } from '@/lib/order-payload'
import { api, getErrorMessage, unwrapData } from '@/stores/api'
import { useCatalogStore } from '@/stores/catalog'
import { subscribeToOrderChanges } from '@/realtime/orders'

const catalogStore = useCatalogStore()
const tableNumber = ref('')
const itemSearch = ref('')
const showSearch = ref(false)
const showInitialNote = ref(false)
const activeSection = ref('catalog')
const category = ref(catalogStore.defaultCategoryKey)
const initialNote = ref('')
const draftItems = ref([])
const nextDraftItemId = ref(1)
const submitting = ref(false)
const formError = ref('')
const tableError = ref(false)
const loadError = ref('')
const loading = ref(false)
const orders = ref([])
const sendingMessageOrderId = ref('')
const messageDraftByOrderId = reactive({})
const messageTargetByOrderId = reactive({})
const messageComposerOpenByOrderId = reactive({})
const messageErrorByOrderId = reactive({})
const messageTargetOptions = [
  { value: 'both', label: 'Theke + Kueche' },
  { value: 'theke', label: 'Theke' },
  { value: 'kueche', label: 'Kueche' },
]
const fallbackPriceByItemKey = {
  'riesling-schorle': '4,90 EUR',
  apfelschorle: '3,80 EUR',
  wasser: '2,90 EUR',
  sekt: '5,40 EUR',
  'flammkuchen-klassik': '9,80 EUR',
  pommes: '4,70 EUR',
  bratwurst: '5,90 EUR',
  kaesebrot: '4,20 EUR',
}

const filteredCatalogItems = computed(() =>
  catalogStore.getItemsForWaiter(category.value, itemSearch.value),
)
const displayCatalogItems = computed(() =>
  filteredCatalogItems.value.map((item) => ({
    ...item,
    shortLabel: item.shortLabel || item.label,
    priceLabel: item.priceLabel || fallbackPriceByItemKey[item.key] || '--',
  })),
)
const draftItemsCount = computed(() => draftItems.value.length)
const categoryOptions = computed(() => catalogStore.categoryOptions)
const canSubmitOrder = computed(() => draftItems.value.length > 0)
const hasDraftContent = computed(
  () =>
    canSubmitOrder.value ||
    tableNumber.value.trim().length > 0 ||
    initialNote.value.trim().length > 0,
)
const draftActionLabel = computed(() =>
  draftItemsCount.value > 0 ? `${draftItemsCount.value} bereit` : 'Leer',
)
const draftActionHint = computed(() => (canSubmitOrder.value ? 'Bereit' : ''))

function categoryLabel(value) {
  return catalogStore.getCategoryLabel(value)
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
  if (value === 'open' || value === 'new' || value === 'in_progress') return 'warning'
  return 'neutral'
}

function targetLabel(targetStations) {
  const labels = {
    both: 'Theke + Kueche',
    theke: 'Theke',
    kueche: 'Kueche',
  }

  if (!Array.isArray(targetStations)) {
    return labels[targetStations] || targetStations
  }

  const normalizedTargets = targetStations.map((target) => labels[target] || target)
  return normalizedTargets.join(', ')
}

function resetItemInputs() {
  itemSearch.value = ''
  showSearch.value = false
  showInitialNote.value = false
  category.value = catalogStore.defaultCategoryKey
}

function resetOrderForm() {
  tableNumber.value = ''
  initialNote.value = ''
  draftItems.value = []
  tableError.value = false
  resetItemInputs()
}

function clearTableError() {
  if (tableError.value && tableNumber.value.trim().length > 0) {
    tableError.value = false
  }
}

function buildDraftItem(catalogItem, itemQuantity = 1) {
  if (!catalogItem) {
    throw new Error('Artikel muss aus dem Katalog gewaehlt werden')
  }

  if (!Number.isInteger(itemQuantity) || itemQuantity < 1) {
    throw new Error('Anzahl muss eine positive ganze Zahl sein')
  }

  if (!catalogStore.hasCategory(category.value)) {
    throw new Error('Kategorie ist nicht gueltig')
  }

  if (catalogItem.category !== category.value) {
    throw new Error('Artikel passt nicht zur Kategorie')
  }

  return {
    id: `draft-${nextDraftItemId.value++}`,
    catalogItemKey: catalogItem.key,
    name: catalogItem.label,
    quantity: itemQuantity,
    category: category.value,
  }
}

function addCatalogItemByKey(itemKey) {
  formError.value = ''

  try {
    const catalogItem = catalogStore.getItemByKey(itemKey)
    const existingIndex = draftItems.value.findIndex((item) => item.catalogItemKey === itemKey)

    if (existingIndex >= 0) {
      const existingItem = draftItems.value[existingIndex]
      const updatedItem = buildDraftItem(catalogItem, existingItem.quantity + 1)
      updatedItem.id = existingItem.id

      draftItems.value = draftItems.value.map((item, index) =>
        index === existingIndex ? updatedItem : item,
      )
      return
    }

    draftItems.value = [...draftItems.value, buildDraftItem(catalogItem)]
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

function toggleMessageComposer(orderId) {
  messageComposerOpenByOrderId[orderId] = !messageComposerOpenByOrderId[orderId]
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
      if (messageComposerOpenByOrderId[order.id] === undefined) {
        messageComposerOpenByOrderId[order.id] = false
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
  tableError.value = false
  submitting.value = true

  try {
    if (tableNumber.value.trim().length === 0) {
      tableError.value = true
      throw new Error('Bitte Tisch eingeben!')
    }

    if (draftItems.value.length === 0) {
      throw new Error('Mindestens eine Position ist erforderlich')
    }

    await api('/orders', {
      method: 'POST',
      body: JSON.stringify(
        buildOrderPayload({
          tableNumber: tableNumber.value,
          initialNote: initialNote.value,
          draftItems: draftItems.value,
        }),
      ),
    })

    resetOrderForm()
    await loadOrders()
  } catch (error) {
    const normalizedErrorMessage = String(error?.message || '').toLocaleLowerCase('de-DE')

    if (normalizedErrorMessage.includes('table number is required')) {
      tableError.value = true
      formError.value = 'Bitte Tisch eingeben!'
    } else {
      formError.value = getErrorMessage(error, error.message || 'Bestellung konnte nicht angelegt werden')
    }
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
    messageComposerOpenByOrderId[orderId] = false
    await loadOrders()
  } catch (error) {
    messageErrorByOrderId[orderId] = getErrorMessage(error, 'Nachricht konnte nicht gesendet werden')
  } finally {
    sendingMessageOrderId.value = ''
  }
}

onMounted(loadOrders)

watch(category, () => {
  formError.value = ''
})

const unsubscribe = subscribeToOrderChanges(() => {
  loadOrders()
})

onUnmounted(() => {
  unsubscribe()
})
</script>

<style scoped>
.view-tabs {
  display: grid;
  grid-auto-flow: column;
  grid-auto-columns: max-content;
  gap: 0.35rem;
  overflow-x: auto;
}

.view-tab {
  min-height: 2rem;
  padding: 0.25rem 0.65rem;
  border: 1px solid var(--line);
  border-radius: 999px;
  background: var(--surface-strong);
  color: var(--ink-2);
  white-space: nowrap;
}

.view-tab--active {
  border-color: var(--accent);
  background: var(--accent-soft);
  color: var(--accent-strong);
}

.waiter-hero {
  display: flex;
  align-items: center;
  justify-content: space-between;
  min-height: 3rem;
  max-height: 3rem;
  padding-top: 0.2rem;
  padding-bottom: 0.2rem;
  box-shadow: none;
}

.waiter-hero :deep(.hero-title) {
  font-size: 0.92rem;
  line-height: 1;
}

.waiter-panel-flat,
.waiter-panel-flat .surface {
  box-shadow: none;
}

.waiter-order-form {
  gap: 0.5rem;
}

.waiter-head-grid {
  gap: 0.45rem;
}

.field-error span {
  color: var(--danger);
}

.input-error {
  border-color: var(--danger);
  outline: 1px solid var(--danger);
  outline-offset: 0;
}

.waiter-builder {
  display: grid;
  gap: 0.4rem;
  min-height: 74vh;
  align-content: start;
}

.category-tabs {
  display: grid;
  grid-auto-flow: column;
  grid-auto-columns: max-content;
  gap: 0.35rem;
  overflow-x: auto;
  padding-bottom: 0.1rem;
}

.category-tab {
  min-height: 2rem;
  padding: 0.25rem 0.65rem;
  border: 1px solid var(--line);
  border-radius: 999px;
  background: var(--surface-strong);
  color: var(--ink-2);
  white-space: nowrap;
}

.category-tab--active {
  border-color: var(--accent);
  background: var(--accent-soft);
  color: var(--accent-strong);
}

.catalog-toolbar {
  display: flex;
  align-items: center;
  gap: 0.4rem;
}

.search-toggle {
  min-width: 2.05rem;
  min-height: 2.05rem;
  padding: 0;
  border-color: var(--line);
  background: var(--surface-strong);
}

.search-toggle__icon {
  position: relative;
  width: 0.75rem;
  height: 0.75rem;
  border: 2px solid currentColor;
  border-radius: 999px;
}

.search-toggle__icon::after {
  content: '';
  position: absolute;
  right: -0.38rem;
  bottom: -0.38rem;
  width: 0.42rem;
  height: 2px;
  background: currentColor;
  transform: rotate(45deg);
}

.waiter-note-icon {
  position: relative;
  display: block;
  width: 0.8rem;
  height: 0.9rem;
  border: 2px solid currentColor;
  border-radius: 2px;
}

.waiter-note-icon::after {
  content: '';
  position: absolute;
  left: 0.12rem;
  right: 0.12rem;
  top: 0.25rem;
  height: 2px;
  background: currentColor;
}

.catalog-search-field {
  flex: 1;
}

.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  border: 0;
}

.waiter-catalog-stack {
  gap: 0.4rem;
  min-height: 0;
}

.waiter-catalog-grid {
  min-height: 74vh;
}

.waiter-message-panel {
  padding-top: 0.45rem;
  padding-bottom: 0.45rem;
}

.empty-state--compact {
  padding: 0.2rem 0.45rem;
  border-style: solid;
  border-width: 1px;
  border-radius: var(--radius-sm);
  text-align: left;
}

.draft-meta {
  display: grid;
  gap: 0.1rem;
}

.draft-meta--compact {
  min-height: 1rem;
  align-items: center;
}

.waiter-icon-btn {
  min-width: 2rem;
  min-height: 2rem;
  padding: 0;
}

.waiter-inline-icon {
  width: 0.95rem;
  height: 0.95rem;
  fill: none;
  stroke: currentColor;
  stroke-width: 1.9;
  stroke-linecap: round;
  stroke-linejoin: round;
}

.target-tabs {
  display: grid;
  grid-auto-flow: column;
  grid-auto-columns: max-content;
  gap: 0.35rem;
  overflow-x: auto;
}

.target-tab {
  min-height: 2rem;
  padding: 0.25rem 0.6rem;
  border: 1px solid var(--line);
  border-radius: 999px;
  background: var(--surface-strong);
  color: var(--ink-2);
  white-space: nowrap;
}

.target-tab--active {
  border-color: var(--accent);
  background: var(--accent-soft);
  color: var(--accent-strong);
}

@media (min-width: 960px) {
  .waiter-builder,
  .waiter-catalog-grid {
    min-height: 78vh;
  }
}
</style>

