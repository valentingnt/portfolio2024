const MEASUREMENT_ID = 'G-WXR9Z2L6LZ'

export function useAnalytics(): void {
  const route = useRoute()

  onMounted(() => {
    const script = document.createElement('script')
    script.defer = true
    script.async = true
    script.src = `https://www.googletagmanager.com/gtag/js?id=${MEASUREMENT_ID}`
    document.head.appendChild(script)

    window.dataLayer = window.dataLayer || []
    // GA4 requires the IArguments object to be pushed, not a plain array
    window.gtag = function gtag() {
      // eslint-disable-next-line prefer-rest-params
      window.dataLayer.push(arguments)
    }
    window.gtag('js', new Date())
    window.gtag('config', MEASUREMENT_ID)
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
