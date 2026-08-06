export function useScrollEffect() {
  const mediaRef = ref<HTMLElement>()
  const isIntersecting = ref(false)

  // Register with watchScroll(onScroll, { defer: true }) so updates are batched to one per frame
  function onScroll(scrollY: number) {
    if (!isIntersecting.value) return

    const value = Math.max(scrollY * 0.1, 0)
    mediaRef.value?.style.setProperty('--scrollY', `${value}`)
  }

  onMounted(() => {
    if (!mediaRef.value) return

    const observer = new IntersectionObserver((entries) => {
      const entry = entries[0]
      if (entry) isIntersecting.value = entry.isIntersecting
    })

    observer.observe(mediaRef.value)
    onUnmounted(() => observer.disconnect())
  })

  return { mediaRef, onScroll }
}
