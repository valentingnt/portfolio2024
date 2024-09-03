export function useLanguage() {
  const route = useRoute()
  const { lang, setLang } = useLang()
  const cookieLang = useCookie('lang')

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

  return { lang, setLang, updateLanguage, isEnglish }
}