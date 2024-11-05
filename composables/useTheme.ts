export function useTheme() {
  const theme = useCookie('theme', {
    default: () => 'light',
    watch: true
  })
  
  const isDark = computed(() => theme.value === 'dark')

  function toggleTheme() {
    theme.value = theme.value === 'light' ? 'dark' : 'light'
    updateTheme()
  }

  function updateTheme() {
    document.documentElement.setAttribute('data-theme', theme.value)
  }

  onMounted(() => {
    if (!theme.value) {
      theme.value = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
    }
    updateTheme()
  })

  watch(theme, () => {
    updateTheme()
  })

  return {
    isDark,
    toggleTheme
  }
} 