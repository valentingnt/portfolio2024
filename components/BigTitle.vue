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
      <h2 class="subtitle">
        {{ subtitle }}
      </h2>
      <svg
        class="separator"
        style="display: block;"
        width="100%"
        height="1"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <line
          x1="0.5"
          y1="0.5"
          x2="100%"
          y2="0.5"
          stroke="var(--color-black)"
        />
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
  }

  .subtitle-container {
    display: flex;
    align-items: center;
    gap: 20px;

    .subtitle {
      @extend %text-h2;

      flex: 0 0 auto;
    }

    .separator {
      flex: 1 0 0;
    }
  }
}
</style>