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
  <div class="Header">
    <ThemeToggle />

    <span class="lang-selector">
      <span :class="{ active: !isEnglish }" @click="onLanguageChange('fr')">FR</span>
      <span :class="{ active: isEnglish }" @click="onLanguageChange('en')">EN</span>
    </span>

    <BigTitle :title="content.header.title" :subtitle="content.header.subtitle" />
  </div>
</template>

<style scoped lang="scss">
.Header {
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

  .lang-selector {
    @extend %text-body;

    position: fixed;
    top: 16px;
    right: 24px;
    display: flex;
    gap: 8px;
    z-index: 2;

    span {
      cursor: pointer;
      position: relative;

      &.active {
        font-weight: 600;

        &::after {
          content: '•';
          position: absolute;
          bottom: -12px;
          left: calc(50% - 4px);
        }
      }

      @media (hover: hover) {
        &:hover {
          text-decoration: underline;
        }
      }
    }
  }
}
</style>