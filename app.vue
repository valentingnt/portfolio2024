<script setup lang="ts">
import type { FooterData } from '~/components/layout/Footer.vue';
import type { NavbarData } from '~/components/layout/Navbar.vue';

interface LayoutData {
  navbar: NavbarData
  footer: FooterData
}

const MOCK_DATA: LayoutData = {
  navbar: {
    links: [
      {
        text: 'home',
        href: '/',
      },
      {
        text: 'projects',
        href: '/projects',
      },
      {
        text: 'about_me',
        href: '/about',
      },
    ],
  },
  footer: {
    title: 'Valentin Genest',
    links: [
      {
        title: 'home',
        href: '/',
      },
      {
        title: 'projects',
        href: '/projects',
      },
      {
        title: 'about_me',
        href: '/about',
      },
    ],
    contactText: 'contact:',
    mailto: 'valentin64.genest@gmail.com',
    legalTexts: {
      allRightsReserved: 'Valentin Genest — Tous droits réservés.',
      developedBy: 'Design et développement par Valentin Genest',
    },
  },
}
</script>

<template>
  <template>
    <div>
      <LayoutNavbar v-bind="MOCK_DATA.navbar" />

      <NuxtPage />

      <LayoutFooter v-bind="MOCK_DATA.footer" />
    </div>
  </template>
</template>