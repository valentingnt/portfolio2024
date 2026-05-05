import { getRequestHeader, getRequestURL, setResponseHeader } from "h3"
import aboutAll from "../../content/about.json"
import skillsAll from "../../content/skills.json"
import type { AboutMultiLangContent, AboutPageContent } from "../../types/about"
import type { SkillsMultiLangContent, Skill } from "../../types/skills"

const MARKDOWN_ACCEPT_RE = /(^|,)\s*text\/markdown\s*(;|,|$)/i
const SUPPORTED_LANGS = new Set(["fr", "en"] as const)
type Lang = "fr" | "en"

const EXCLUDED_PREFIXES = ["/api", "/_nuxt", "/.well-known", "/img"]
const EXCLUDED_EXACT_PATHS = [
  "/robots.txt",
  "/sitemap.xml",
  "/llms.txt",
  "/favicon.ico",
]

const aboutContent = aboutAll as AboutMultiLangContent
const skillsContent = skillsAll as SkillsMultiLangContent

function hasMarkdownAcceptHeader(acceptHeader: string | undefined): boolean {
  if (!acceptHeader) {
    return false
  }
  return MARKDOWN_ACCEPT_RE.test(acceptHeader)
}

function isHtmlPageRequest(pathname: string): boolean {
  if (EXCLUDED_EXACT_PATHS.includes(pathname)) {
    return false
  }
  for (const prefix of EXCLUDED_PREFIXES) {
    if (pathname.startsWith(prefix)) {
      return false
    }
  }
  const hasFileExtension = /\.[a-z0-9]+$/i.test(pathname)
  return !hasFileExtension
}

function resolveLanguage(pathname: string): Lang {
  const firstSegment = pathname.split("/").filter(Boolean)[0]
  if (firstSegment && SUPPORTED_LANGS.has(firstSegment as Lang)) {
    return firstSegment as Lang
  }
  return "fr"
}

function isLinkContent(
  content: AboutPageContent["sections"][number]["content"],
): content is { title: string; href?: string; subtitle?: string }[] {
  return (
    Array.isArray(content) &&
    content.length > 0 &&
    typeof content[0] === "object" &&
    content[0] !== null &&
    "title" in content[0]
  )
}

function renderSectionContent(
  content: AboutPageContent["sections"][number]["content"],
): string {
  if (typeof content === "string") {
    return content
  }
  if (isLinkContent(content)) {
    return content
      .map((item) => {
        const subtitle = item.subtitle ? ` ${item.subtitle}` : ""
        if (item.href) {
          return `- [${item.title}](${item.href})${subtitle}`
        }
        return `- ${item.title}${subtitle}`
      })
      .join("\n")
  }
  if (Array.isArray(content)) {
    return (content as string[]).map((item) => `- ${item}`).join("\n")
  }
  return ""
}

function renderSkillsList(skills: Skill[]): string {
  return skills
    .map((skill) => `- **${skill.name}** — ${skill.description}`)
    .join("\n")
}

function renderFooter(
  footer: AboutPageContent["footer"],
  isFrench: boolean,
): string {
  const lines: string[] = []
  const heading = isFrench ? "## Contact" : "## Contact"
  lines.push(heading, "")
  for (const link of footer.links) {
    if (link.url) {
      lines.push(`- [${link.title}](${link.url})`)
    } else {
      lines.push(`- ${link.title}`)
    }
  }
  lines.push("")
  for (const item of footer.content) {
    lines.push(`> ${item}`)
  }
  return lines.join("\n")
}

function getAlternateLanguageNote(language: Lang): string {
  if (language === "fr") {
    return "_Available in English at [/en](/en)._"
  }
  return "_Disponible en français sur [/fr](/fr)._"
}

function buildMarkdown(language: Lang): string {
  const isFrench = language === "fr"
  const about = aboutContent[language]
  const skills = skillsContent[language]

  const seoTitle = isFrench
    ? "Valentin Genest — Développeur Front-end"
    : "Valentin Genest — Front-end Developer"
  const seoDescription = isFrench
    ? "Développeur front-end avec 5 ans d'expérience, basé entre Paris et Bordeaux. Spécialisé dans la création d'expériences web accessibles et performantes."
    : "Front-end developer with 5 years of experience, based between Paris and Bordeaux. Building accessible and performant web experiences."

  const sectionsMd = about.sections
    .map((section) => {
      const body = renderSectionContent(section.content)
      if (section.title) {
        return `## ${section.title.replace(/[:：]\s*$/, "").trim()}\n\n${body}`
      }
      return body
    })
    .join("\n\n")

  const skillsHeading = isFrench ? "## Compétences" : "## Skills"
  const navHeading = isFrench ? "## Navigation" : "## Navigation"
  const navItems = isFrench
    ? [
        "- [Version française](/fr)",
        "- [English version](/en)",
        "- [Sitemap](/sitemap.xml)",
        "- [robots.txt](/robots.txt)",
        "- [Catalogue API](/.well-known/api-catalog)",
        "- [llms.txt](/llms.txt)",
      ]
    : [
        "- [French version](/fr)",
        "- [English version](/en)",
        "- [Sitemap](/sitemap.xml)",
        "- [robots.txt](/robots.txt)",
        "- [API catalog](/.well-known/api-catalog)",
        "- [llms.txt](/llms.txt)",
      ]

  return `---
title: ${seoTitle}
description: ${seoDescription}
language: ${language}
canonical: https://valentingenest.fr/${language}
---

# ${about.header.title}

> ${about.header.subtitle}

${getAlternateLanguageNote(language)}

${sectionsMd}

${skillsHeading}

${renderSkillsList(skills)}

${renderFooter(about.footer, isFrench)}

${navHeading}

${navItems.join("\n")}
`
}

function estimateTokenCount(markdown: string): number {
  return Math.max(1, Math.ceil(markdown.length / 4))
}

export default defineEventHandler((event) => {
  if (event.method !== "GET" && event.method !== "HEAD") {
    return
  }

  const acceptHeader = getRequestHeader(event, "accept")
  if (!hasMarkdownAcceptHeader(acceptHeader)) {
    return
  }

  const { pathname } = getRequestURL(event)
  if (!isHtmlPageRequest(pathname)) {
    return
  }

  const language = resolveLanguage(pathname)
  const markdown = buildMarkdown(language)

  setResponseHeader(event, "content-type", "text/markdown; charset=utf-8")
  setResponseHeader(event, "vary", "Accept")
  setResponseHeader(
    event,
    "x-markdown-tokens",
    estimateTokenCount(markdown).toString(),
  )

  if (event.method === "HEAD") {
    return ""
  }

  return markdown
})
