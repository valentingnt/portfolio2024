export function usePageTransition() {
  const isVisible = ref(false)

  onMounted(() => {
    isVisible.value = true
  })

  return {
    isVisible
  }
} 