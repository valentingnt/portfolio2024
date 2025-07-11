<script setup lang="ts">
import type { AboutPageContent } from '@/types/about'

interface HeaderProps {
  content: Pick<AboutPageContent, 'header'>
  onLanguageChange: (lang: string) => void
  isEnglish: boolean
}

defineProps<HeaderProps>()
</script>

<template>
  <header class="Header">
    <div class="top-bar">
      <ThemeToggle />
      <LanguageSelector :onLanguageChange="onLanguageChange" :isEnglish="isEnglish" />
    </div>

    <div class="title-container">
      <div class="subtitle-container">
        <p class="subtitle">{{ content.header.subtitle }}</p>
        <svg class="separator" style="display: block;" width="100%" height="1" fill="none"
          xmlns="http://www.w3.org/2000/svg">
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
        @extend %text-h2;
        flex: 0 0 auto;
      }

      .separator {
        flex: 1 0 0;

        line {
          stroke: var(--color-primary);
        }
      }
    }
  }

  @media (max-width: 640px) {
    &::before {
      content: '';
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 72px;
      z-index: 1;
      opacity: 1;
      transition: opacity 0.3s ease;
      background: linear-gradient(to bottom,
          #FFFDF9 0%,
          color-mix(in srgb, #FFFDF9 98.7%, transparent) 8.1%,
          color-mix(in srgb, #FFFDF9 95.1%, transparent) 15.5%,
          color-mix(in srgb, #FFFDF9 89.6%, transparent) 22.5%,
          color-mix(in srgb, #FFFDF9 82.5%, transparent) 29%,
          color-mix(in srgb, #FFFDF9 74.1%, transparent) 35.3%,
          color-mix(in srgb, #FFFDF9 64.8%, transparent) 41.2%,
          color-mix(in srgb, #FFFDF9 55%, transparent) 47.1%,
          color-mix(in srgb, #FFFDF9 45%, transparent) 52.9%,
          color-mix(in srgb, #FFFDF9 35.2%, transparent) 58.8%,
          color-mix(in srgb, #FFFDF9 25.9%, transparent) 64.7%,
          color-mix(in srgb, #FFFDF9 17.5%, transparent) 71%,
          color-mix(in srgb, #FFFDF9 10.4%, transparent) 77.5%,
          color-mix(in srgb, #FFFDF9 4.9%, transparent) 84.5%,
          color-mix(in srgb, #FFFDF9 1.3%, transparent) 91.9%,
          color-mix(in srgb, #FFFDF9 0%, transparent) 100%);

      [data-theme="dark"] & {
        opacity: 0;
      }
    }

    &::after {
      content: '';
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 72px;
      z-index: 1;
      opacity: 0;
      transition: opacity 0.3s ease;
      background: linear-gradient(to bottom,
          #2B2B2B 0%,
          color-mix(in srgb, #2B2B2B 98.7%, transparent) 8.1%,
          color-mix(in srgb, #2B2B2B 95.1%, transparent) 15.5%,
          color-mix(in srgb, #2B2B2B 89.6%, transparent) 22.5%,
          color-mix(in srgb, #2B2B2B 82.5%, transparent) 29%,
          color-mix(in srgb, #2B2B2B 74.1%, transparent) 35.3%,
          color-mix(in srgb, #2B2B2B 64.8%, transparent) 41.2%,
          color-mix(in srgb, #2B2B2B 55%, transparent) 47.1%,
          color-mix(in srgb, #2B2B2B 45%, transparent) 52.9%,
          color-mix(in srgb, #2B2B2B 35.2%, transparent) 58.8%,
          color-mix(in srgb, #2B2B2B 25.9%, transparent) 64.7%,
          color-mix(in srgb, #2B2B2B 17.5%, transparent) 71%,
          color-mix(in srgb, #2B2B2B 10.4%, transparent) 77.5%,
          color-mix(in srgb, #2B2B2B 4.9%, transparent) 84.5%,
          color-mix(in srgb, #2B2B2B 1.3%, transparent) 91.9%,
          color-mix(in srgb, #2B2B2B 0%, transparent) 100%);

      [data-theme="dark"] & {
        opacity: 1;
      }
    }
  }
}
</style>