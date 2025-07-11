<script setup lang="ts">
interface LanguageSelectorProps {
  onLanguageChange: (lang: string) => void
  isEnglish: boolean
}

defineProps<LanguageSelectorProps>()
</script>

<template>
  <div class="LanguageSelector">
    <span :class="{ active: !isEnglish }" class="language-selector-item" @click="() => onLanguageChange('fr')">
      FR
    </span>
    <span>/</span>
    <span :class="{ active: isEnglish }" class="language-selector-item" @click="() => onLanguageChange('en')">
      EN
    </span>
  </div>
</template>

<style scoped lang="scss">
@use '~/assets/stylesheets/resources/typography' as *;
@use '~/assets/stylesheets/variables/animations' as *;

.LanguageSelector {
  @extend %text-body;
  @include page-transition($page-transition-language-selector-delay);

  display: flex;
  gap: 8px;
  opacity: 0;

  .language-selector-item {
    cursor: pointer;
    position: relative;

    &.active {
      font-weight: 500;

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
</style>