export interface UseSeoReturn {
  meta: {
    title: string
    htmlAttrs: {
      lang: string
    }
    meta: {
      name?: string
      property?: string
      content: string
    }[]
    script: {
      type: string
      children: string
    }[]
    link: {
      rel: string
      href: string
    }[]
  }
} 