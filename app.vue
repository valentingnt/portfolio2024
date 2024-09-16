<script setup lang="ts">
import Lenis from 'lenis'

useSeoMeta({
  title: 'Valentin Genest',
  description: "Valentin Genest - Développeur web depuis 5 ans. J'ai travaillé pendant 2 ans en tant que développeur front-end pour Dernier Cri, ai été freelance accompagné par le Studio Wawww pour des rêves plus grands et j’ai rejoint Unlikely dans l’optique de retrouver une cohésion d’agence. J'aime ce que je fais et je le fais bien. La stack que j'utilise est différente en fonction du projet et des besoins, mais je continue d'apprendre de nouvelles techniques pour construire un internet comme il se doit.",
  ogDescription: "Valentin Genest - Développeur web. Construisons un internet comme il se doit.",
  ogTitle: 'Valentin Genest',
  ogType: 'website',
  ogUrl: 'https://valentingenest.fr',
  ogImage: '/img/moi2.jpeg',
  ogImageAlt: 'Valentin Genest',
  ogSiteName: 'Valentin Genest',
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