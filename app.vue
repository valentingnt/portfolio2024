<script setup lang="ts">
import { Analytics } from '@vercel/analytics/nuxt'

const isReducedMotion = useReducedMotion()
let lenis: any

function raf(time: number) {
  lenis?.raf(time)
  window.requestAnimationFrame(raf)
}

onMounted(async () => {
  if (isReducedMotion.value) return

  const Lenis = (await import('lenis')).default
  lenis = new Lenis({ duration: 0.7 })

  window.requestAnimationFrame(raf)
})

onUnmounted(() => lenis?.destroy())

useAnalytics()
</script>

<template>
  <main>
    <Analytics />
    <NuxtPage />
  </main>
</template>