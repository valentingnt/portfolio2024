import type { ComputedRef } from "vue"

export interface SeoMeta {
  title: string
  htmlAttrs: {
    lang: string
  }
  meta: SeoMetaTag[]
  script: {
    type: 'application/ld+json'
    innerHTML: string
  }[]
  link: SeoLink[]
}

// These mirror unhead's discriminated unions. Optional-everything shapes (`name?` and
// `property?` on one object, or a widened `rel: string`) leave useHead() unable to pick
// a variant, so each tag shape is spelled out separately.
export type SeoMetaTag =
  | { name: string, content: string }
  | { property: string, content: string }

export type SeoLink =
  | { rel: 'canonical', href: string }
  | { rel: 'me', href: string }
  | { rel: 'alternate', href: string, hreflang: string }

export interface UseSeoReturn {
  meta: ComputedRef<SeoMeta>
}
