<template>
  <article class="metric-card" :data-tone="tone">
    <p class="metric-card__label">{{ label }}</p>
    <strong class="metric-card__value">{{ value }}</strong>
    <p v-if="hint" class="metric-card__hint">{{ hint }}</p>
  </article>
</template>

<script setup>
defineProps({
  label: {
    type: String,
    required: true,
  },
  value: {
    type: [String, Number],
    required: true,
  },
  hint: {
    type: String,
    default: '',
  },
  tone: {
    type: String,
    default: 'neutral',
  },
})
</script>
