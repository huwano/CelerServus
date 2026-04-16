<template>
  <RouterView v-slot="{ Component }">
    <component :is="Component" v-if="isPublicRoute" />
    <AppShell v-else>
      <component :is="Component" />
    </AppShell>
  </RouterView>
</template>

<script setup>
import { computed } from 'vue'
import { RouterView, useRoute } from 'vue-router'
import AppShell from '@/components/AppShell.vue'

const route = useRoute()
const isPublicRoute = computed(() => route.meta.public === true)
</script>
