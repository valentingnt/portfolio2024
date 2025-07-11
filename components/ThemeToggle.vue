<script setup lang="ts">
const { preference, setTheme } = useTheme()

const isOpen = ref(false)
const isMobile = ref(false)

const themes = [
  { value: 'light', label: 'Light' },
  { value: 'dark', label: 'Dark' },
  { value: 'system', label: 'System' }
] as const

function selectTheme(theme: 'light' | 'dark' | 'system') {
  setTheme(theme)
  isOpen.value = false
}

function onSelectChange(event: Event) {
  const select = event.target as HTMLSelectElement
  setTheme(select.value as 'light' | 'dark' | 'system')
}

const currentTheme = computed(() => themes.find(t => t.value === preference.value))

// Close menu when clicking outside
onMounted(() => {
  const handleClickOutside = (event: MouseEvent) => {
    const target = event.target as HTMLElement
    if (!target.closest('.theme-toggle')) {
      isOpen.value = false
    }
  }

  const checkMobile = () => {
    isMobile.value = window.innerWidth <= 640
  }

  checkMobile()
  window.addEventListener('resize', checkMobile)
  document.addEventListener('click', handleClickOutside)

  onUnmounted(() => {
    document.removeEventListener('click', handleClickOutside)
    window.removeEventListener('resize', checkMobile)
  })
})
</script>

<template>
  <div class="theme-toggle" :class="{ open: isOpen }">
    <template v-if="!isMobile">
      <button class="current-theme" @click="isOpen = !isOpen">
        <span class="label">{{ currentTheme?.label }}</span>
      </button>
      <div class="theme-options">
        <button v-for="theme in themes" :key="theme.value" class="theme-option"
          :class="{ active: theme.value === preference }" @click="selectTheme(theme.value)">
          <span class="label">{{ theme.label }}</span>
        </button>
      </div>
    </template>
    <select v-else class="mobile-select" :value="preference" @change="onSelectChange">
      <option v-for="theme in themes" :key="theme.value" :value="theme.value">
        {{ theme.label }}
      </option>
    </select>
  </div>
</template>

<style scoped lang="scss">
@use '~/assets/stylesheets/resources/typography' as *;
@use '~/assets/stylesheets/variables/animations' as *;

.theme-toggle {
  @include page-transition($page-transition-theme-toggle-delay);

  position: fixed;
  top: 16px;
  left: 24px;
  z-index: 2;
  opacity: 0;

  .current-theme,
  .theme-option {
    @extend %text-body;

    display: flex;
    align-items: center;
    gap: 8px;
    color: var(--color-primary);
    font-weight: 500;
    padding: 6px 10px;
    border-radius: 60px;
    border: none;
    background: transparent;
    cursor: pointer;
    transition: all cubic-bezier(0.22, 1, 0.36, 1) 0.2s;
    white-space: nowrap;

    .label {
      font-size: 12px;
      text-decoration: none;
      transition: text-decoration-color 0.2s cubic-bezier(0.22, 1, 0.36, 1);
    }

    @media (max-width: 640px) {
      padding: 0;
    }

    @media (hover: hover) {
      &:hover .label {
        text-decoration: underline;
      }
    }

    &:active .label {
      text-decoration: underline;
    }
  }

  .current-theme {
    position: relative;
  }

  .theme-options {
    position: absolute;
    top: calc(100% + 4px);
    left: 0;
    display: flex;
    flex-direction: column;
    gap: 2px;
    padding: 4px;
    border-radius: 12px;
    background: color-mix(in srgb, var(--color-secondary) 95%, var(--color-primary));
    backdrop-filter: blur(8px);
    opacity: 0;
    transform: translateY(-6px);
    pointer-events: none;
    transition: all 0.2s cubic-bezier(0.22, 1, 0.36, 1);

    .theme-option {
      border-radius: 8px;
      padding: 6px 12px;

      &.active .label {
        text-decoration: underline;
      }
    }
  }

  &.open {
    .current-theme {
      opacity: 1;
    }

    .theme-options {
      opacity: 1;
      transform: translateY(0);
      pointer-events: all;
    }
  }

  .mobile-select {
    @extend %text-body;
    color: var(--color-primary);
    font-weight: 500;
    border: none;
    background: transparent;
    cursor: pointer;
    appearance: none;
    -webkit-appearance: none;
    background-repeat: no-repeat;
    background-position: right 8px center;
    text-decoration: underline;

    &:focus {
      outline: none;
    }

    option {
      background: var(--color-secondary);
      color: var(--color-primary);
      font-size: 16px;
      padding: 8px;
    }
  }
}
</style>