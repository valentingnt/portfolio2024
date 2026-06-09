<script setup lang="ts">
interface LanguageSelectorProps {
  isEnglish: boolean
}

defineProps<LanguageSelectorProps>()

const emit = defineEmits<{
  change: [lang: string]
}>()
</script>

<template>
  <div class="LanguageSelector">
    <button
      type="button"
      class="language-selector-item"
      :class="{ active: !isEnglish }"
      :aria-current="!isEnglish"
      aria-label="Passer en français"
      @click="emit('change', 'fr')"
    >
      FR
    </button>
    <span aria-hidden="true">/</span>
    <button
      type="button"
      class="language-selector-item"
      :class="{ active: isEnglish }"
      :aria-current="isEnglish"
      aria-label="Switch to English"
      @click="emit('change', 'en')"
    >
      EN
    </button>
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
    @extend %text-body;

    color: inherit;
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
