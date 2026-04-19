<template>
  <button
    class="base-button"
    :class="[
      `base-button--${variant}`,
      {
        'base-button--block': block,
      },
    ]"
    :disabled="disabled"
    :type="type"
    v-bind="$attrs"
  >
    <slot>{{ label }}</slot>
  </button>
</template>

<script setup>
defineOptions({
  inheritAttrs: false,
})

defineProps({
  block: {
    type: Boolean,
    default: false,
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  label: {
    type: String,
    default: '',
  },
  type: {
    type: String,
    default: 'button',
  },
  variant: {
    type: String,
    default: 'primary',
  },
})
</script>

<style scoped>
.base-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.55rem;
  min-height: var(--touch-min);
  padding: 0.8rem 1rem;
  border: 1px solid var(--accent);
  border-radius: var(--radius-md);
  background: var(--accent);
  color: var(--color-accent-contrast);
  font: inherit;
  font-weight: var(--font-weight-bold);
  letter-spacing: 0.01em;
  cursor: pointer;
  transition: transform 80ms ease, opacity 80ms ease, background-color 80ms ease;
}

.base-button:active {
  transform: scale(0.98);
}

.base-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.base-button--block {
  width: 100%;
}

.base-button--primary {
  border-color: var(--accent);
  background: var(--accent);
  color: var(--color-accent-contrast);
}

.base-button--primary:active {
  background: var(--accent-strong);
}

.base-button--secondary {
  border-color: var(--color-border-strong);
  background: var(--surface-strong);
  color: var(--ink-1);
}

.base-button--secondary:active {
  background: var(--surface-soft);
}

.base-button--ghost {
  border-color: var(--line);
  background: var(--surface-soft);
  color: var(--ink-1);
}

.base-button--ghost:active {
  background: var(--surface-strong);
}

.base-button--danger {
  border-color: var(--danger);
  background: var(--danger);
  color: var(--color-accent-contrast);
}

.base-button--danger:active {
  background: color-mix(in srgb, var(--danger) 86%, black);
}
</style>
