export function useLang(): { lang: Ref<string>, setLang: (value: string) => void } {
  const lang = ref()
  const route = useRoute()

  async function setLang(value: string) {
    lang.value = value
    history.replaceState({}, '', `/${value}`)
  }

  return { lang, setLang }
}