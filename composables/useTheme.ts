type ThemePreference = 'light' | 'dark' | 'system'

export function useTheme() {
  const userPreference = useCookie<ThemePreference>('theme-preference', {
    default: () => 'system',
    watch: true
  })

  const theme = useState<string>('theme', () => userPreference.value)

  function setTheme(newTheme: ThemePreference) {
    userPreference.value = newTheme
    updateThemeFromPreference()
  }

  function updateThemeFromPreference() {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    theme.value = userPreference.value === 'system'
      ? (prefersDark ? 'dark' : 'light')
      : userPreference.value
    document.documentElement.setAttribute('data-theme', theme.value)
  }

  onMounted(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    mediaQuery.addEventListener('change', updateThemeFromPreference)

    // The inline head script already set data-theme pre-paint; this syncs the reactive state
    updateThemeFromPreference()

    onUnmounted(() => mediaQuery.removeEventListener('change', updateThemeFromPreference))
  })

  return {
    preference: computed(() => userPreference.value),
    setTheme
  }
}
