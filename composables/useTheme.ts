export function useTheme() {
  const userPreference = useCookie('theme-preference', {
    default: () => 'system',
    watch: true
  })
  
  const theme = ref('light')
  const isDark = computed(() => theme.value === 'dark')

  function setTheme(newTheme: 'light' | 'dark' | 'system') {
    userPreference.value = newTheme
    updateThemeFromPreference()
  }

  function toggleTheme() {
    const newTheme = userPreference.value === 'system' 
      ? (isDark.value ? 'light' : 'dark')
      : (userPreference.value === 'light' ? 'dark' : 'light')
    setTheme(newTheme)
  }

  function updateThemeFromPreference() {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    theme.value = userPreference.value === 'system'
      ? (prefersDark ? 'dark' : 'light')
      : userPreference.value
    document.documentElement.setAttribute('data-theme', theme.value)
  }

  onMounted(() => {
    // Listen for system theme changes
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    mediaQuery.addEventListener('change', updateThemeFromPreference)

    // Initial theme setup
    updateThemeFromPreference()

    // Cleanup
    onUnmounted(() => {
      mediaQuery.removeEventListener('change', updateThemeFromPreference)
    })
  })

  return {
    isDark,
    currentTheme: computed(() => theme.value),
    preference: computed(() => userPreference.value),
    setTheme,
    toggleTheme
  }
} 