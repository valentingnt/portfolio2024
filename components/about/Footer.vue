<script setup lang="ts">
import type { AboutPageContent } from '@/types/about'

interface FooterProps {
  content: Pick<AboutPageContent, 'footer'>
  mail: string
  onMailClick: () => void
}

defineProps<FooterProps>()
</script>

<template>
  <footer class="footer">
    <p v-for="(content, index) in content.footer.content" :key="index">
      {{ content }}
    </p>

    <ul class="links">
      <li class="link-title" :style="{ cursor: 'pointer' }" @click="onMailClick">
        {{ mail }}
      </li>

      <li class="link-separator">~</li>

      <li v-for="(link, index) in content.footer.links" :key="index" class="link">
        <NuxtLink :to="link.url" target="_blank" class="link-title">
          {{ link.title }}
        </NuxtLink>

        <span v-if="index !== content.footer.links.length - 1" class="link-separator">~</span>
      </li>
    </ul>
  </footer>
</template>

<style scoped lang="scss">
@use '~/assets/stylesheets/resources/typography' as *;
@use '~/assets/stylesheets/variables/animations' as *;

.footer {
  @include page-transition($page-transition-footer-delay);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 16px;

  .links {
    display: flex;
    gap: 8px;
    list-style: none;

    .link {
      display: flex;
      gap: 8px;
    }

    .link-separator {
      user-select: none;
    }

    .link-title {
      @extend %link;
      transition: transform cubic-bezier(0.22, 1, 0.36, 1) 0.2s;

      @media (hover: hover) {
        &:hover {
          transform: translateY(-2px);
        }
      }
    }
  }
}
</style>