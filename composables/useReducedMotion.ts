const MEDIA_QUERY = '(prefers-reduced-motion: reduce)'

const isReducedMotion = ref(
  typeof window !== 'undefined' ? window.matchMedia(MEDIA_QUERY).matches : false
)

let isBound = false

export function useReducedMotion(): Ref<boolean> {
  if (import.meta.client && !isBound) {
    isBound = true

    const mediaQuery = window.matchMedia(MEDIA_QUERY)
    mediaQuery.addEventListener(
      'change',
      () => (isReducedMotion.value = mediaQuery.matches),
      { passive: true }
    )
  }

  return isReducedMotion
}
