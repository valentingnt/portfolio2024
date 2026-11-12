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
  <div
    class="LanguageSelector"
    :class="{ 'is-english': isEnglish }"
    role="tablist"
    aria-label="Language"
    @keydown.left.prevent="emit('change', 'fr')"
    @keydown.right.prevent="emit('change', 'en')"
  >
    <span class="indicator" aria-hidden="true" />
    <button
      type="button"
      role="tab"
      class="language-selector-item"
      :class="{ active: !isEnglish }"
      :aria-selected="!isEnglish"
      :tabindex="isEnglish ? -1 : 0"
      aria-label="Passer en français"
      @click.passive="emit('change', 'fr')"
    >
      FR
    </button>
    <button
      type="button"
      role="tab"
      class="language-selector-item"
      :class="{ active: isEnglish }"
      :aria-selected="isEnglish"
      :tabindex="isEnglish ? 0 : -1"
      aria-label="Switch to English"
      @click.passive="emit('change', 'en')"
    >
      EN
    </button>
  </div>
</template>

<style scoped lang="scss">
@use '~/assets/stylesheets/resources/typography' as *;
@use '~/assets/stylesheets/variables/animations' as *;
@use '~/assets/stylesheets/resources/pill' as *;

.LanguageSelector {
  @extend %text-body;
  @include page-transition($page-transition-language-selector-delay);

  // Inset of the sliding indicator inside the control (the mobile pill pads it)
  --pad: 0px;

  position: relative;
  display: grid;
  grid-template-columns: 1fr 1fr;
  opacity: 0;

  @include header-pill($page-transition-language-selector-delay);

  // A tab-style segmented control: the indicator slides under the active label.
  // Both labels are two mono glyphs wide, so the two columns are always equal.
  .indicator {
    position: absolute;
    top: var(--pad);
    bottom: var(--pad);
    left: var(--pad);
    width: calc((100% - 2 * var(--pad)) / 2);
    border-radius: 999px;
    background-color: rgba(var(--color-accent-rgb), 0.16);
    transition: transform 0.35s cubic-bezier(0.22, 1, 0.36, 1);

    @media (prefers-reduced-motion: reduce) {
      transition: none;
    }
  }

  &.is-english .indicator {
    transform: translateX(100%);
  }

  .language-selector-item {
    @extend %text-body;

    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 6px 10px;
    border-radius: 999px;
    color: inherit;
    cursor: pointer;
    opacity: 0.55;
    transition: opacity 0.2s cubic-bezier(0.22, 1, 0.36, 1);

    &.active {
      font-weight: var(--font-weight-medium);
      opacity: 1;
    }

    &:focus-visible {
      outline: 1.5px solid var(--color-accent);
      outline-offset: -1.5px;
    }

    @media (hover: hover) {
      &:hover {
        opacity: 1;
      }
    }
  }

  @media (max-width: 640px) {
    --pad: 3px;

    padding: var(--pad);

    .language-selector-item {
      padding: 0 10px;
    }
  }
}
</style>
