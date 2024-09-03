import { Application } from '@splinetool/runtime'

export function useSpline(isMobile: Ref<boolean>, isReducedMotion: Ref<boolean>) {
  const canvas3d = ref()
  const app = ref<Application>()

  async function initializeSpline() {
    if (!isMobile.value && !isReducedMotion.value) {
      app.value = new Application(canvas3d.value)
      
      try {
        await app.value.load('https://prod.spline.design/kz-R06edYbCwBzh0/scene.splinecode')
        
        app.value.addEventListener('rendered', () => {
          canvas3d.value.style.display = 'block'
        })
      } catch (error) {
        console.error('Failed to load Spline scene:', error)
      }
    }
  }

  onMounted(initializeSpline)
  onUnmounted(() => {
    app.value?.dispose()
  })

  return { canvas3d, app }
}