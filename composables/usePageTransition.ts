export function usePageTransition() {
  const isVisible = ref(false)

  onMounted(() => {
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        isVisible.value = true
      })
    })
  })

  return {
    isVisible
  }
}
