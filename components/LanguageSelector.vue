<script setup lang="ts">
interface LanguageSelectorProps {
  onLanguageChange: (lang: string) => void
  isEnglish: boolean
}

defineProps<LanguageSelectorProps>()
</script>

<template>
  <div class="LanguageSelector">
    <span :class="{ active: !isEnglish }" @click="() => onLanguageChange('fr')">
      FR
    </span>
    <span>/</span>
    <span :class="{ active: isEnglish }" @click="() => onLanguageChange('en')">
      EN
    </span>
  </div>
</template>

<style scoped lang="scss">
.LanguageSelector {
  @extend %text-body;
  display: flex;
  gap: 8px;
  opacity: 0;
  transform: translateY(-10px);
  transition: opacity 0.7s cubic-bezier(0.22, 1, 0.36, 1),
    transform 0.7s cubic-bezier(0.22, 1, 0.36, 1);

  .AboutPage.is-visible & {
    opacity: 1;
    transform: translateY(0);
  }

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
</style>