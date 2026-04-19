<template>
  <div class="catalog-item-grid">
    <button
      v-for="item in items"
      :key="item.key"
      class="catalog-item-grid__item"
      :class="{
        'catalog-item-grid__item--selected': modelValue === item.key,
      }"
      type="button"
      @click="onItemTap(item)"
    >
      <span class="catalog-item-grid__label">{{ item.shortLabel || item.label }}</span>
      <span class="catalog-item-grid__price">{{ item.priceLabel || '--' }}</span>
    </button>

    <p v-if="items.length === 0" class="catalog-item-grid__empty">
      {{ emptyText }}
    </p>
  </div>
</template>

<script setup>
defineProps({
  emptyText: {
    type: String,
    default: 'Keine Artikel gefunden.',
  },
  items: {
    type: Array,
    default: () => [],
  },
  modelValue: {
    type: String,
    default: '',
  },
})

const emit = defineEmits(['item-tap', 'update:modelValue'])

function onItemTap(item) {
  emit('update:modelValue', item.key)
  emit('item-tap', item.key)
}
</script>

<style scoped>
.catalog-item-grid {
  display: grid;
  gap: 0.4rem;
  grid-template-columns: repeat(2, minmax(0, 1fr));
}

.catalog-item-grid__item {
  min-height: var(--touch-min);
  padding: 0.5rem 0.55rem;
  border: 1px solid var(--color-border-strong);
  border-radius: var(--radius-sm);
  background: var(--surface-strong);
  color: var(--ink-1);
  text-align: left;
  font: inherit;
  font-weight: var(--font-weight-bold);
  cursor: pointer;
  transition: transform 80ms ease, background-color 80ms ease, border-color 80ms ease;
}

.catalog-item-grid__item:active {
  transform: scale(0.98);
}

.catalog-item-grid__item--selected {
  border-color: var(--accent);
  background: var(--accent-soft);
  color: var(--accent-strong);
}

.catalog-item-grid__label {
  display: block;
  font-size: 0.92rem;
  line-height: 1.15;
}

.catalog-item-grid__price {
  display: block;
  margin-top: 0.2rem;
  font-size: 0.8rem;
  font-weight: var(--font-weight-bold);
  color: var(--ink-2);
}

.catalog-item-grid__empty {
  grid-column: 1 / -1;
  margin: 0;
  padding: var(--space-4);
  border: 1px dashed var(--color-border-strong);
  border-radius: var(--radius-md);
  color: var(--ink-3);
  text-align: center;
}

@media (min-width: 720px) {
  .catalog-item-grid {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
}
</style>
