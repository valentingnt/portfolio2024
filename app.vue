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