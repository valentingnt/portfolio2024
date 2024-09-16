export function useScrollEffect() {
  const mediaRef = ref<HTMLElement>()
  const isIntersecting = ref(false)

  function onScroll(scrollY: number) {
    if (!isIntersecting.value) return

    const value = Math.max(scrollY * 0.1, 0)

    window.requestAnimationFrame(() => {
      mediaRef.value?.style.setProperty('--scrollY', `${value}px`)
    })
  }

  onMounted(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        isIntersecting.value = entries[0].isIntersecting
      },
      { threshold: 0 }
    )

    if (mediaRef.value) {
      observer.observe(mediaRef.value)
    }

    onUnmounted(() => {
      if (mediaRef.value) {
        observer.unobserve(mediaRef.value)
      }
    })
  })


  return { mediaRef, onScroll }
}