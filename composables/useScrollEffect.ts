export function useScrollEffect() {
  const mediaRef = ref<HTMLElement>()

  function onScroll(scrollY: number) {
    const value = Math.max(scrollY * 0.1, 0)

    window.requestAnimationFrame(() => {
      mediaRef.value?.style.setProperty('--scrollY', `${value}px`)
    })
  }

  function preventSpacebarScroll(event: KeyboardEvent) {
    if (event.key === ' ') event.preventDefault()
  }

  onMounted(() => {
    document.addEventListener('keypress', preventSpacebarScroll)
  })

  onUnmounted(() => {
    document.removeEventListener('keypress', preventSpacebarScroll)
  })

  return { mediaRef, onScroll }
}