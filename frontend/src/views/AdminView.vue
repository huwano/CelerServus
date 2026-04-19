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
        <MetricCard
          hint="gesamt im System"
          label="Bestellungen"
          :value="metrics.totalOrders"
          tone="accent"
        />
        <MetricCard
          hint="offen oder in Bearbeitung"
          label="Aktiv"
          :value="metrics.activeOrders"
          tone="warning"
        />
        <MetricCard
          hint="vollständig abgeschlossen"
          label="Erledigt"
          :value="metrics.completedOrders"
        />
      </div>
    </section>

    <section class="cards-grid">
      <MetricCard hint="Tische mit aktiven Orders" label="Belegte Tische" :value="metrics.busyTables" />
      <MetricCard
        hint="aktive Positionen für Ausgabe"
        label="Theke offen"
        :value="metrics.activeBarItems"
        tone="warning"
      />
      <MetricCard
        hint="aktive Positionen für Zubereitung"
        label="Küche offen"
        :value="metrics.activeKitchenItems"
        tone="warning"
      />
      <MetricCard hint="registrierte Nutzer im System" label="Nutzer" :value="metrics.totalUsers" />
      <MetricCard
        hint="Kommunikation über alle Orders"
        label="Nachrichten"
        :value="metrics.totalMessages"
      />
    </section>

    <section class="list-panel surface">
      <div class="panel-head">
        <div>
          <p class="eyebrow">Systemstatus</p>
          <h2 class="panel-title">Betriebsübersicht</h2>
        </div>
        <button class="button--ghost" @click="loadOverview">Aktualisieren</button>
      </div>

      <p v-if="loading" class="empty-state">Lade Leitstand...</p>
      <p v-else-if="error" class="error-text">{{ error }}</p>
      <p v-else-if="!hasOverviewData" class="empty-state">Noch keine Statistikdaten vorhanden.</p>

      <div v-else class="content-grid">
        <article class="data-card">
          <div class="row-spread">
            <div>
              <p class="data-card__title">Order-Status</p>
              <p class="data-card__meta">Klare Verteilung über alle Arbeitszustände</p>
            </div>
            <span class="soft-pill">{{ metrics.totalOrders }} gesamt</span>
          </div>

          <ul class="inline-list">
            <li v-for="entry in statusEntries" :key="entry.key" class="inline-item">
              <div>
                <strong>{{ entry.label }}</strong>
                <p class="data-card__meta">Orders in diesem Zustand</p>
              </div>
              <span class="status-pill" :data-tone="entry.tone">{{ entry.value }}</span>
            </li>
          </ul>
        </article>

        <article class="data-card">
          <div class="row-spread">
            <div>
              <p class="data-card__title">Katalog-Nutzung</p>
              <p class="data-card__meta">Welche Bereiche aktuell Volumen erzeugen</p>
            </div>
            <span class="soft-pill">{{ metrics.waiterCount }} Bedienungen aktiv geplant</span>
          </div>

          <ul v-if="categoryEntries.length" class="inline-list">
            <li v-for="categoryEntry in categoryEntries" :key="categoryEntry.key" class="inline-item">
              <div>
                <strong>{{ categoryEntry.label }}</strong>
                <p class="data-card__meta">
                  {{ categoryEntry.lineCount }} Positionen · {{ categoryEntry.quantityTotal }}
                  Artikel
                </p>
              </div>
              <span class="soft-pill">{{ categoryEntry.quantityTotal }} Artikel</span>
            </li>
          </ul>
          <p v-else class="empty-state">Noch keine Nutzung aus dem Katalog erfasst.</p>
        </article>
      </div>
    </section>
  </div>
</template>

<script setup>
import { computed, onMounted, onUnmounted, ref } from 'vue'
import MetricCard from '@/components/MetricCard.vue'
import { ADMIN_ORDER_STATUS_KEYS, buildAdminOverviewMetrics } from '@/lib/admin-overview'
import { useCatalogStore } from '@/stores/catalog'
import { api, getErrorMessage, unwrapData } from '@/stores/api'
import { subscribeToOrderChanges } from '@/realtime/orders'

const catalogStore = useCatalogStore()
const overview = ref(null)
const error = ref('')
const loading = ref(false)

const metrics = computed(() => buildAdminOverviewMetrics(overview.value || {}))
const hasOverviewData = computed(
  () =>
    metrics.value.totalOrders > 0 ||
    metrics.value.totalMessages > 0 ||
    metrics.value.busyTables > 0 ||
    metrics.value.totalUsers > 0,
)
const statusEntries = computed(() =>
  ADMIN_ORDER_STATUS_KEYS.map((statusKey) => ({
    key: statusKey,
    label: statusLabel(statusKey),
    tone: statusTone(statusKey),
    value: Number(overview.value?.ordersByStatus?.[statusKey] || 0),
  })),
)
const categoryEntries = computed(() =>
  Object.entries(overview.value?.itemsByCategory || {})
    .map(([categoryKey, stats]) => ({
      key: categoryKey,
      label: catalogStore.getCategoryLabel(categoryKey),
      lineCount: Number(stats?.lineCount || 0),
      quantityTotal: Number(stats?.quantityTotal || 0),
    }))
    .sort(
      (left, right) =>
        right.quantityTotal - left.quantityTotal ||
        right.lineCount - left.lineCount ||
        left.label.localeCompare(right.label, 'de'),
    ),
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
  if (value === 'completed' || value === 'ready') return 'success'
  if (value === 'cancelled') return 'danger'
  return 'warning'
}

async function loadOverview() {
  loading.value = true
  error.value = ''

  try {
    const payload = await api('/stats/overview')
    overview.value = unwrapData(payload)
  } catch (requestError) {
    error.value = getErrorMessage(requestError, 'Leitstand konnte nicht geladen werden')
  } finally {
    loading.value = false
  }
}

function initializeView() {
  if (!catalogStore.loaded && !catalogStore.loading) {
    void catalogStore.fetchCatalog()
  }

  return loadOverview()
}

onMounted(() => {
  initializeView()
})

const unsubscribe = subscribeToOrderChanges(() => {
  loadOverview()
})

onUnmounted(() => {
  unsubscribe()
})
</script>
