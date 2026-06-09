import type { ComputedRef } from "vue"

export interface SeoMeta {
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
    hreflang?: string
  }[]
}

export interface UseSeoReturn {
  meta: ComputedRef<SeoMeta>
}
