<script setup lang="ts">
import Lenis from 'lenis'

const lenis = ref<Lenis>()

function raf(time: number) {
  lenis.value?.raf(time)
  window.requestAnimationFrame(raf)
}

onMounted(() => {
  lenis.value = new Lenis({ duration: 0.7 })

  window.requestAnimationFrame(raf)
})

onUnmounted(() => lenis.value?.destroy())
</script>

<template>
  <main>
    <NuxtPage />
  </main>
</template>