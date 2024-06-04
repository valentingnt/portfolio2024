export function useLang(defaultValue: string = 'fr'): { lang: Ref<string>, setLang: (value: string) => void } {
  const lang = ref(defaultValue);

  function setLang(value: string) {
    lang.value = value;
  }

  return { lang, setLang };
}