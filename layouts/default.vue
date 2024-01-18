<script setup lang="ts">
const MOCK_DATA = {
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
  }
}
</script>

<template>
  <div>
    <LayoutNavbar v-bind="MOCK_DATA.navbar" />
    <slot />
  </div>
</template>

<style scoped lang="scss">
.Navbar {
  grid-column: 1 / span 5;
  position: fixed;
  top: 12px;
  left: 50%;
  transform: translateX(-50%);

  @media screen and (min-width: $screen-mobile) {
    grid-column: 2 / span 4;
  }
}
</style>