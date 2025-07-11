export const useAnalytics = () => {
  const route = useRoute()
  const MEASUREMENT_ID = "G-WXR9Z2L6LZ"

  onMounted(() => {
    const script = document.createElement("script")
    script.defer = true
    script.async = true
    script.src = `https://www.googletagmanager.com/gtag/js?id=${MEASUREMENT_ID}`
    document.head.appendChild(script)

    window.dataLayer = window.dataLayer || []
    function gtag(...args: any[]) {
      window.dataLayer.push(args)
    }
    gtag("js", new Date())
    gtag("config", MEASUREMENT_ID)
  })

  watch(
    () => route.fullPath,
    (path) => {
      if (window.gtag) {
        window.gtag("config", MEASUREMENT_ID, {
          page_path: path,
          page_location: window.location.href,
        })
      }
    }
  )
}
