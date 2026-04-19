<template>
  <div class="bottom-action-bar">
    <div v-if="$slots.meta" class="bottom-action-bar__meta">
      <slot name="meta" />
    </div>

    <div class="bottom-action-bar__actions">
      <slot />
    </div>
  </div>
</template>

<style scoped>
.bottom-action-bar {
  display: grid;
  gap: var(--space-3);
  padding: var(--space-3);
  border: 1px solid var(--color-border-strong);
  border-radius: var(--radius-lg);
  background: var(--surface);
}

.bottom-action-bar__meta {
  display: grid;
  gap: 2px;
}

.bottom-action-bar__actions {
  display: grid;
  gap: var(--space-2);
}

@media (max-width: 959px) {
  .bottom-action-bar {
    position: fixed;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 25;
    margin: 0;
    padding: var(--space-3) var(--space-3) calc(var(--space-3) + env(safe-area-inset-bottom));
    border-left: none;
    border-right: none;
    border-bottom: none;
    border-radius: 0;
  }
}

@media (min-width: 720px) {
  .bottom-action-bar__actions {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (min-width: 960px) {
  .bottom-action-bar {
    position: sticky;
    bottom: var(--space-4);
  }
}
</style>
