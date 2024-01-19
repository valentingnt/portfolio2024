export function useBreakpoints() {
  const { width } = useOnWindowResize()

  const isMobile = computed(() => width.value <= 640 || 'ontouchstart' in window)
  const isTablet = computed(() => width.value <= 1280 && width.value > 640)
  const isDesktop = computed(() => width.value > 1280)

  return {
    isMobile,
    isTablet,
    isDesktop
  }
}
