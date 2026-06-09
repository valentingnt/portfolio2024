<script setup lang="ts">
import type { AboutPageContent } from '@/types/about'

interface FooterProps {
  content: Pick<AboutPageContent, 'footer'>
  mail: string
}

defineProps<FooterProps>()

const emit = defineEmits<{
  mailClick: []
}>()
</script>

<template>
  <footer class="footer">
    <p v-for="(contentItem, index) in content.footer.content" :key="index">
      {{ contentItem }}
    </p>

    <ul class="links">
      <li class="link">
        <button type="button" class="link-title" @click="emit('mailClick')">
          {{ mail }}
        </button>
        <span class="link-separator" aria-hidden="true">~</span>
      </li>

      <li v-for="(link, index) in content.footer.links" :key="link.url" class="link">
        <NuxtLink :to="link.url" target="_blank" rel="noopener noreferrer" class="link-title">
          {{ link.title }}
        </NuxtLink>

        <span
          v-if="index !== content.footer.links.length - 1"
          class="link-separator"
          aria-hidden="true"
        >~</span>
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

      color: inherit;
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
