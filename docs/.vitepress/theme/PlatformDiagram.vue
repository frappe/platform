<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref, useId, watch } from 'vue'

const props = defineProps<{ chart: string }>()
const id = `diagram-${useId().replace(/[^a-zA-Z0-9]/g, '')}`
const svg = ref('')
const error = ref('')
let observer: MutationObserver | undefined
let narrowScreen: MediaQueryList | undefined
let version = 0

async function render() {
  const current = ++version
  const { default: mermaid } = await import('mermaid')
  const dark = document.documentElement.dataset.theme === 'dark'
  mermaid.initialize({
    startOnLoad: false,
    securityLevel: 'strict',
    look: 'classic',
    theme: dark ? 'dark' : 'neutral',
    themeVariables: {
      primaryColor: dark ? '#1d252c' : '#f3f7fa',
      primaryTextColor: dark ? '#eeeeee' : '#262626',
      primaryBorderColor: dark ? '#7896ad' : '#9caebb',
      lineColor: dark ? '#939ca5' : '#7c8791',
      edgeLabelBackground: dark ? '#171717' : '#ffffff',
      fontSize: '15px',
    },
    fontFamily: 'Inter, system-ui, sans-serif',
    flowchart: { useMaxWidth: true, htmlLabels: false, curve: 'linear' },
    sequence: { useMaxWidth: true, wrap: true },
  })
  try {
    const chart = narrowScreen?.matches
      ? props.chart.replace(/^flowchart LR/m, 'flowchart TB')
      : props.chart
    const result = await mermaid.render(`${id}-${current}`, chart)
    if (current === version) {
      svg.value = result.svg
      error.value = ''
    }
  } catch (exception) {
    error.value = 'The diagram could not be displayed.'
    console.error('Platform diagram failed', exception)
  }
}

onMounted(() => {
  narrowScreen = window.matchMedia('(max-width: 640px)')
  narrowScreen.addEventListener('change', render)
  render()
  observer = new MutationObserver(render)
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] })
})
watch(() => props.chart, render)
onBeforeUnmount(() => {
  version++
  observer?.disconnect()
  narrowScreen?.removeEventListener('change', render)
})
</script>

<template>
  <figure class="platform-diagram" aria-label="Platform flow diagram">
    <div v-if="svg" class="diagram-image" role="img" aria-label="Platform flow diagram" v-html="svg" />
    <pre v-else>{{ chart }}</pre>
    <figcaption v-if="error" role="alert">{{ error }}</figcaption>
  </figure>
</template>
