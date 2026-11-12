// A message for the curious who crack open devtools. Lives here rather than in
// DuckFeet so it still prints under reduced motion (which blanks the canvas).

// Module-level so a route change or HMR re-run never prints it twice.
let printed = false

const DUCK_ART = `
⠀⠀⠀⠀⠀⠀⣀⣤⣶⣶⣤⡀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⢀⣾⠛⠁⢰⣧⡈⢻⣦⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⢸⣇⣼⡀⠻⠟⠁⠀⢻⡆⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⢀⡞⣹⠙⣧⡀⠀⠀⡀⢸⡇⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⣀⡴⠋⠀⣀⣴⣿⡷⠴⠞⠁⢸⡇⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⢾⣁⣀⡤⠾⠛⠁⣸⠀⠀⠀⠀⢸⡇⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠈⠁⠀⠀⠀⠀⢠⡟⠀⠀⠀⠀⣾⠃⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⣠⣿⠁⠀⠀⠀⢀⣿⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⣰⡿⠁⠀⠀⠀⠀⠀⢿⣶⠶⠿⠟⠿⠿⣶⣦⣄⡀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⣼⠟⠀⠀⠀⠀⠀⠀⠀⠈⠻⣄⠀⠀⠀⠀⠀⠈⠙⠛⠿⠶⣶⣤⡀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⣸⡏⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠁⢀⣀⣠⣤⣤⣤⣤⣤⣀⠀⠉⠙⠳⢦⣄⡀⣀⣤⣀⣀⡄⠀
⠀⢀⣿⠁⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠈⠉⠁⠀⠀⠀⠀⠀⠈⠉⠻⢶⣀⠀⠀⠈⠉⢁⠈⠏⣿⣁⠀
⠀⢸⣿⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠻⣦⣀⣀⡴⠁⠀⠀⢙⣿⡾
⠀⠘⣿⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠉⠉⠀⠀⣀⣠⡾⠟⠃
⠀⠀⠹⣧⡀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣀⣀⣀⡔⢊⣵⠞⠋⠁⠀⠀⠀
⠀⠀⠀⠙⠿⣦⣀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⡠⠚⠉⠀⣠⣴⠟⠁⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠈⠙⠳⠶⣤⣤⣄⣀⠀⠀⠀⠀⠀⠀⠀⢤⣤⣴⠊⣁⣤⠶⠛⠉⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠉⠙⠛⡷⢶⡶⠶⠤⠔⢺⠃⡟⠉⠉⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⢀⣀⣀⣀⠀⢰⡇⠀⡇⠀⠀⠀⢸⠀⠃⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠈⣹⣤⣭⠿⠟⣃⣾⠋⠀⠀⢠⡟⢸⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠁⠈⠉⠙⠛⢋⣿⣙⣶⣾⡿⢷⡿⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠐⠛⠛⠻⠧⠶⠾⠛⠁⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
`

export function useConsoleEgg(): void {
  // The language is read straight off the URL at print time. Going through
  // useLanguage() here would run on the bare `/` (before the page redirects),
  // initialise the shared lang state to 'en' and write that to the cookie —
  // silently flipping the site's French default for first-time visitors.
  const route = useRoute()
  const isReducedMotion = useReducedMotion()

  onMounted(() => {
    if (printed) return

    let idleId: number | undefined
    let timeoutId: ReturnType<typeof setTimeout> | undefined

    function fire() {
      if (printed) return
      printed = true

      // The muted accent reads on both a light and a dark devtools theme, so
      // the message doesn't hardcode a hex the palette might later change.
      const accent = getComputedStyle(document.documentElement)
        .getPropertyValue("--color-accent-rgb")
        .trim()
      const color = accent ? `rgb(${accent})` : "#7a2f42"
      const base = `font-family: monospace; color: ${color}`

      // Fired at idle, well after the `/` redirect settled, so the param is
      // the URL's truth; anywhere it is missing, French is the site default.
      const isEnglish = route.params.lang === "en"
      const message = isEnglish
        ? "quack, you found the console.\nnot looking for work right now, but let's keep in touch → contact@valentingenest.fr"
        : "coin coin, tu as trouvé la console.\nje ne cherche pas de travail en ce moment, mais restons en contact → contact@valentingenest.fr"
      const hint = isEnglish
        ? "psst, try typing 'quack' on the page."
        : "psst, essaie de taper 'quack' sur la page."

      console.log(`%c${DUCK_ART}`, base)
      console.log(`%c${message}`, `${base}; font-weight: 600`)
      // The stampede needs the canvas sim, which reduced motion keeps blank —
      // don't promise those visitors an egg that can't hatch.
      if (!isReducedMotion.value)
        console.log(`%c${hint}`, `${base}; opacity: 0.7`)
    }

    // Defer off the critical path like useAnalytics; Safari lacks rIC.
    if ("requestIdleCallback" in window) {
      idleId = requestIdleCallback(fire, { timeout: 3000 })
    } else {
      timeoutId = setTimeout(fire, 2000)
    }

    onUnmounted(() => {
      if (idleId !== undefined && "cancelIdleCallback" in window)
        cancelIdleCallback(idleId)
      if (timeoutId !== undefined) clearTimeout(timeoutId)
    })
  })
}
