const MEASUREMENT_ID = 'G-WXR9Z2L6LZ'

export function useAnalytics(): void {
  const route = useRoute()

  onMounted(() => {
    // Stub immediately so events fired before the script loads queue in dataLayer
    window.dataLayer = window.dataLayer || []
    // GA4 requires the IArguments object to be pushed, not a plain array
    window.gtag = function gtag() {
      // eslint-disable-next-line prefer-rest-params
      window.dataLayer.push(arguments)
    }
    window.gtag('js', new Date())
    window.gtag('config', MEASUREMENT_ID)

    // Load the 117KB gtag.js off the critical path, once the main thread is idle
    function loadScript() {
      const script = document.createElement('script')
      script.async = true
      script.src = `https://www.googletagmanager.com/gtag/js?id=${MEASUREMENT_ID}`
      document.head.appendChild(script)
    }

    if ('requestIdleCallback' in window) {
      requestIdleCallback(loadScript, { timeout: 3000 })
    } else {
      setTimeout(loadScript, 2000)
    }
  })

  watch(
    () => route.fullPath,
    (path) => {
      window.gtag?.('config', MEASUREMENT_ID, {
        page_path: path,
        page_location: window.location.href
      })
    }
  )
}

export function trackEvent(name: string, params?: Record<string, string>): void {
  window.gtag?.('event', name, params)
}
