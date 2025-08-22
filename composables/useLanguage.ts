export interface Language {
  isEnglish: ComputedRef<boolean>
  setLang: (value: string) => void
  updateLanguage: (newLang: string) => void
}

export function useLanguage(baseLang?: string): Language {
  const route = useRoute()
  const cookieLang = useCookie<string | undefined>("lang")

  // Shared reactive state across the whole app
  const lang = useState<string>("lang", () => {
    const fromRoute = route.params.lang as string | undefined
    return fromRoute || cookieLang.value || baseLang || "en"
  })

  function setLang(value: string) {
    if (lang.value === value) return
    lang.value = value
    cookieLang.value = value
    history.replaceState({}, "", `/${value}`)
  }

  function updateLanguage(newLang: string) {
    setLang(newLang)
  }

  // Keep cookie in sync when lang changes from anywhere
  watch(lang, (newVal) => {
    cookieLang.value = newVal
  })

  // Keep in sync with route param changes
  watch(
    () => route.params.lang,
    (newParam) => {
      const next =
        (newParam as string | undefined) || cookieLang.value || baseLang || "en"
      if (next !== lang.value) {
        lang.value = next
      }
    }
  )

  const isEnglish = computed(() => lang.value === "en")

  onMounted(() => {
    const fromRoute = route.params.lang as string | undefined
    const next = fromRoute || cookieLang.value || baseLang || "en"
    if (lang.value !== next) {
      lang.value = next
    }
    cookieLang.value = lang.value
  })

  return { isEnglish, setLang, updateLanguage }
}
