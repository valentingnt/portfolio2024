export type AboutSectionItem = {
  title: string
  href?: string
  subtitle?: string
  badge?: string
}

export type AboutPageContent = {
  header: {
    title: string
    subtitle: string
  }
  sections: {
    title?: string
    content: string | string[] | AboutSectionItem[]
  }[]
  downloadText: string
  footer: {
    content: string[]
    links: {
      title: string
      url: string
    }[]
  }
}

export type AboutMultiLangContent = {
  en: AboutPageContent
  fr: AboutPageContent
}
