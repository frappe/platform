<script setup lang="ts">
import { theme } from 'frappe-ui/vitepress'
import { useRoute } from 'vitepress'
import { nextTick, onMounted, watch } from 'vue'

const DocsLayout = theme.Layout
const route = useRoute()

async function markMainContent() {
  await nextTick()
  const main = document.querySelector('main')
  if (main) {
    main.id = 'main-content'
    main.tabIndex = -1
  }
}

onMounted(markMainContent)
watch(() => route.path, markMainContent)
</script>

<template>
  <a class="skip-link" href="#main-content">Skip to content</a>
  <DocsLayout />
</template>
