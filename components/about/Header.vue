<script setup lang="ts">
import type { AboutPageContent } from '@/types/about'

interface HeaderProps {
  content: Pick<AboutPageContent, 'header'>
  isEnglish: boolean
}

defineProps<HeaderProps>()

const emit = defineEmits<{
  languageChange: [lang: string]
}>()
</script>

<template>
  <header class="Header">
    <div class="top-bar">
      <ThemeToggle />
      <LanguageSelector :is-english="isEnglish" @change="emit('languageChange', $event)" />
    </div>

    <div class="title-container">
      <div class="subtitle-container">
        <p class="subtitle"><UiSplitText :text="content.header.subtitle" /></p>
        <svg
          class="separator"
          width="100%"
          height="1"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <line x1="0.5" y1="0.5" x2="100%" y2="0.5" />
        </svg>
      </div>
      <h1 class="main-title">{{ content.header.title }}</h1>
    </div>
  </header>
</template>

<style scoped lang="scss">
@use '~/assets/stylesheets/resources/typography' as *;
@use '~/assets/stylesheets/variables/animations' as *;

.Header {
  .top-bar {
    position: fixed;
    top: 16px;
    right: 24px;
    display: flex;
    align-items: center;
    gap: 16px;
    z-index: 2;
  }

  .title-container {
    @include page-transition($page-transition-header-delay);

    .main-title {
      @extend %text-h1;
      @include page-transition($page-transition-main-title-delay);
    }

    .subtitle-container {
      @include page-transition($page-transition-title-delay);

      display: flex;
      align-items: center;
      gap: 20px;

      .subtitle {
        // The only label that stays in Paper Mono, uppercase
        @extend %text-h2;
        font-family: var(--font-family-paper-mono);
        font-weight: var(--font-weight-medium);
        text-transform: uppercase;
        font-size: 12px;
        flex: 0 0 auto;
      }

      .separator {
        display: block;
        flex: 1 0 0;

        line {
          stroke: var(--color-accent);
        }
      }
    }
  }

  @media (max-width: 640px) {
    .top-bar {
      top: 12px;
      right: 16px;
    }
  }
}
</style>
