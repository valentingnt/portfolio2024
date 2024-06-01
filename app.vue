<script setup lang="ts">
import Lenis from 'lenis'

useSeoMeta({
  title: 'Valentin Genest',
  description: 'Valentin Genest - Web developer for 5 years. Now at the top working with cutting-edge front-end related technology. I worked for 2 years for @derniercri and now in freelance accompanied by @studiowawww for biggest dreams. I love what I do and do it the right way. The stack I use differs depending on the project and needs, but I keep learning new things to build an internet as it should be.',
  ogDescription: "Valentin Genest - Web developer. Let's build an internet as it should be.",
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

onMounted(async () => {
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