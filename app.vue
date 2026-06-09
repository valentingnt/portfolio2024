<script setup lang="ts">
import type Lenis from 'lenis'

const isReducedMotion = useReducedMotion()
let lenis: Lenis | undefined

onMounted(async () => {
  if (isReducedMotion.value) return

  const LenisModule = (await import('lenis')).default
  lenis = new LenisModule({ duration: 0.7, autoRaf: true })
})

onUnmounted(() => lenis?.destroy())

useAnalytics()
</script>

<template>
  <main>
    <NuxtPage />
  </main>
</template>