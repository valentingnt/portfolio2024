<script setup lang="ts">
import type { LinkData } from '../ui/Link.vue';

export interface NavbarData {
  links: LinkData[]
}

interface NavbarProps extends NavbarData { }

defineProps<NavbarProps>()
</script>

<template>
  <nav class="Navbar">
    <div v-for="(link, index) in links" :key="link.text">
      <span v-if="index > 0" class="separator">~</span>
      <NuxtLink :to="link.href" class="link">
        <span class="title">[{{ link.text }}]</span>
      </NuxtLink>
    </div>
  </nav>
</template>

<style scoped lang="scss">
.Navbar {
  /* TODO: put a %text-body for the navbar styles */
  font-family: var(--font-family-dm-mono);
  font-weight: 600;
  font-style: italic;
  font-size: 12px;
  color: var(--color-black);
  /* end todo */

  display: inline-flex;
  justify-content: center;
  align-items: center;
  padding: 10px;
  gap: 12px;
  white-space: pre;

  @media screen and (min-width: $screen-mobile) {
    gap: 18px;
  }

  .separator {
    margin-right: 12px;
    pointer-events: none;

    @media screen and (min-width: $screen-mobile) {
      margin-right: 18px;
    }
  }

  .router-link-active .title {
    text-decoration: underline;
    text-underline-offset: 4px;
  }
}
</style>