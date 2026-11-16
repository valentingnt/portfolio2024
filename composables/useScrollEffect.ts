export function useScrollEffect() {
  const mediaRef = ref<HTMLElement>()
  const isIntersecting = ref(false)

  // Register with watchScroll(onScroll, { defer: true }) so updates are batched to one per frame
  function onScroll(scrollY: number) {
    if (!isIntersecting.value) return

    const value = Math.max(scrollY * 0.1, 0)
    // Straight to the image's transform: a custom property on the container made
    // the browser re-resolve calc(var()) through the subtree on every scroll frame
    const img = mediaRef.value?.firstElementChild as HTMLElement | null
    if (img) img.style.transform = `translate3d(0, ${value}px, 0)`
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
