import { ref } from 'vue'

export function usePageTransition() {
  const isVisible = ref(false)

  onMounted(() => {
    isVisible.value = true
  })

  return {
    isVisible
  }
} 