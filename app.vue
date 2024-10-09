<script setup lang="ts">
import Lenis from 'lenis'

useSeoMeta({
  title: 'Valentin Genest',
  description: "Valentin Genest - Développeur web passionné avec 5 ans d'expérience. Spécialisé en front-end, j'ai travaillé pour Dernier Cri, Studio Wawww, et rejoint Unlikely. À la pointe et en constante évolution pour créer un web de qualité.",
  ogDescription: "Valentin Genest - Développeur web. Construisons un internet comme il se doit.",
  ogTitle: 'Valentin Genest',
  ogType: 'website',
  ogUrl: 'https://valentingenest.fr',
  ogImage: '/img/moi2.jpeg',
  ogImageAlt: 'Valentin Genest',
  ogSiteName: 'Valentin Genest'
})

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