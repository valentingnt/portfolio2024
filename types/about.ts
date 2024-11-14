export type AboutPageContent = {
  header: {
    title: string
    subtitle: string
  }
  sections: {
    title?: string
    content: string | string[] | { title: string, href?: string, subtitle?: string }[]
  }[]
  downloadText: string
  footer: {
    content: string[]
    links: {
      title: string
      url?: string
      onClick?: () => void
    }[]
  }
} 