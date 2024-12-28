<script setup lang="ts">
export interface BigTitleData {
  title: string
  subtitle: string
}

interface BigTitleProps extends BigTitleData { }

defineProps<BigTitleProps>()
</script>

<template>
  <div class="BigTitle">
    <div class="subtitle-container">
      <p class="subtitle">
        {{ subtitle }}
      </p>
      <svg class="separator" style="display: block;" width="100%" height="1" fill="none"
        xmlns="http://www.w3.org/2000/svg">
        <line x1="0.5" y1="0.5" x2="100%" y2="0.5" />
      </svg>
    </div>
    <h1 class="main-title">
      {{ title }}
    </h1>
  </div>
</template>

<style scoped lang="scss">
.BigTitle {
  .main-title {
    @extend %text-h1;
    opacity: 0;
    transform: translateY(20px);
    transition: opacity 0.7s cubic-bezier(0.22, 1, 0.36, 1) 0.2s,
      transform 0.7s cubic-bezier(0.22, 1, 0.36, 1) 0.2s;

    .AboutPage.is-visible & {
      opacity: 1;
      transform: translateY(0);
    }
  }

  .subtitle-container {
    display: flex;
    align-items: center;
    gap: 20px;
    opacity: 0;
    transform: translateY(20px);
    transition: opacity 0.7s cubic-bezier(0.22, 1, 0.36, 1) 0.1s,
      transform 0.7s cubic-bezier(0.22, 1, 0.36, 1) 0.1s;

    .AboutPage.is-visible & {
      opacity: 1;
      transform: translateY(0);
    }

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
</style>