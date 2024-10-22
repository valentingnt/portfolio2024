export interface Language {
  isEnglish: ComputedRef<boolean>
  setLang: (value: string) => void
  updateLanguage: (newLang: string) => void
}

export function useLanguage(baseLang: string): Language {
  const lang = ref(baseLang)
  const route = useRoute()
  const cookieLang = useCookie('lang')

  function setLang(value: string) {
    lang.value = value
    history.replaceState({}, '', `/${value}`)
  }

  const updateLanguage = (newLang: string) => {
    setLang(newLang)
    cookieLang.value = newLang
  }

  watch(lang, () => {
    cookieLang.value = lang.value
  })

  const isEnglish = computed(() => lang.value === 'en')

  onMounted(() => {
    setLang(route.params.lang as string)
    cookieLang.value = lang.value
  })

  return { isEnglish, setLang, updateLanguage }
}