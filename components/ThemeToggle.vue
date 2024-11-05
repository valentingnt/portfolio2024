<script setup lang="ts">
const { isDark, toggleTheme } = useTheme()
</script>

<template>
  <button class="theme-toggle" @click="toggleTheme">
    <svg v-if="isDark" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M12 16C14.2091 16 16 14.2091 16 12C16 9.79086 14.2091 8 12 8C9.79086 8 8 9.79086 8 12C8 14.2091 9.79086 16 12 16Z"
        stroke="currentColor" stroke-width="2" />
      <path
        d="M12 2V4M12 20V22M2 12H4M20 12H22M4.93 4.93L6.34 6.34M17.66 17.66L19.07 19.07M19.07 4.93L17.66 6.34M6.34 17.66L4.93 19.07"
        stroke="currentColor" stroke-width="2" />
    </svg>
    <svg v-else viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" stroke="currentColor" stroke-width="2" />
    </svg>
  </button>
</template>

<style scoped lang="scss">
.theme-toggle {
  position: fixed;
  top: 16px;
  left: 24px;
  width: 18px;
  height: 18px;
  z-index: 2;
  color: var(--color-primary);
  transition: transform 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);

  @media (hover: hover) {
    &:hover {
      transform: scale(0.9);
    }
  }
}
</style>