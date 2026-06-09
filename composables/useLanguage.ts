export interface Language {
  lang: Ref<string>
  isEnglish: ComputedRef<boolean>
  setLanguage: (value: string) => void
}

export function useLanguage(baseLang?: string): Language {
  const route = useRoute()
  const cookieLang = useCookie<string | undefined>('lang')

  const lang = useState<string>('lang', () => {
    return (route.params.lang as string | undefined) || cookieLang.value || baseLang || 'en'
  })

  const isEnglish = computed(() => lang.value === 'en')

  function setLanguage(value: string) {
    if (lang.value === value) return

    lang.value = value
    // Go through the router so route.params.lang stays in sync with the URL
    navigateTo(`/${value}`, { replace: true })
  }

  watch(
    () => route.params.lang as string | undefined,
    (param) => {
      lang.value = param || cookieLang.value || baseLang || 'en'
    }
  )

  watch(lang, (value) => (cookieLang.value = value), { immediate: true })

  return { lang, isEnglish, setLanguage }
}
