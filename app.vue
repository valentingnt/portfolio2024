<script setup lang="ts">
// import type { FooterData } from '~/components/layout/Footer.vue';
// import type { NavbarData } from '~/components/layout/Navbar.vue';

import Lenis from 'lenis'

// interface LayoutData {
//   navbar: NavbarData
//   footer: FooterData
// }

// const MOCK_DATA: LayoutData = {
//   navbar: {
//     links: [
//       {
//         text: 'home',
//         href: '/',
//       },
//       {
//         text: 'projects',
//         href: '/projects',
//       },
//       {
//         text: 'about_me',
//         href: '/about',
//       },
//     ],
//   },
//   footer: {
//     title: 'Valentin Genest',
//     links: [
//       {
//         title: 'home',
//         href: '/',
//       },
//       {
//         title: 'projects',
//         href: '/projects',
//       },
//       {
//         title: 'about_me',
//         href: '/about',
//       },
//     ],
//     contactText: 'contact:',
//     mailto: 'valentin64.genest@gmail.com',
//     legalTexts: {
//       allRightsReserved: 'Valentin Genest — Tous droits réservés.',
//       developedBy: 'Design et développement par Valentin Genest',
//     },
//   },
// }
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

onUnmounted(() => {
  lenis.value?.destroy()
})
</script>

<template>
  <main>
    <NuxtPage />
  </main>
</template>