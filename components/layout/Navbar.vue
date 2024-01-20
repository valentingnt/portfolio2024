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
      [<NuxtLink :to="link.href" class="link">
        <span class="title">{{ link.text }}</span>
      </NuxtLink>]
    </div>
  </nav>
</template>

<style scoped lang="scss">
.Navbar {
  @extend %text-body;

  pointer-events: none;
  font-weight: 600;
  font-style: italic;
  font-size: 12px;
  display: inline-flex;
  justify-content: center;
  align-items: center;
  padding: 10px;
  gap: 12px;
  white-space: pre;
  position: fixed;
  top: 12px;
  left: 50%;
  transform: translateX(-50%);
  background-color: rgba(255, 253, 249, 0.8);
  border: 1.5px solid rgba(255, 253, 249, 0.8);
  border-radius: 5px;
  backdrop-filter: blur(6px);
  z-index: 10;

  @media screen and (min-width: $screen-mobile) {
    gap: 18px;
  }

  .separator {
    margin-right: 12px;

    @media screen and (min-width: $screen-mobile) {
      margin-right: 18px;
    }
  }

  .router-link-active,
  .title {
    pointer-events: auto;
  }

  .router-link-active {
    text-decoration: underline;
    text-underline-offset: 4px;
  }

}
</style>