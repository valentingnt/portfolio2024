import aboutAll from "../../content/about.json"
import skillsAll from "../../content/skills.json"
import type {
  AboutMultiLangContent,
  AboutPageContent,
} from "../../types/about"
import type { Skill, SkillsMultiLangContent } from "../../types/skills"

export type PortfolioLang = "fr" | "en"

const aboutContent = aboutAll as AboutMultiLangContent
const skillsContent = skillsAll as SkillsMultiLangContent

export function isSupportedLanguage(value: unknown): value is PortfolioLang {
  return value === "fr" || value === "en"
}

export function getAboutContent(language: PortfolioLang): AboutPageContent {
  return aboutContent[language]
}

export function getSkillsContent(language: PortfolioLang): Skill[] {
  return skillsContent[language]
}

export function getContactInfo() {
  return {
    email: "contact@valentingenest.fr",
    location: "Paris / Bordeaux, France",
    profiles: {
      linkedin: "https://www.linkedin.com/in/valentin-genest/",
      github: "https://github.com/valentingnt",
      malt: "https://www.malt.fr/profile/valentingenest",
    },
    resumes: {
      fr: "https://valentingenest.fr/CV2024_Valentin_Genest.pdf",
      en: "https://valentingenest.fr/EN_CV2024_Valentin_Genest.pdf",
    },
    website: "https://valentingenest.fr",
  }
}

export function getRecentProjects(language: PortfolioLang) {
  const about = aboutContent[language]
  for (const section of about.sections) {
    const looksLikeProjects =
      Array.isArray(section.content) &&
      section.content.length > 0 &&
      typeof section.content[0] === "object" &&
      section.content[0] !== null &&
      "title" in section.content[0]

    if (
      looksLikeProjects &&
      section.title &&
      /project|projet/i.test(section.title)
    ) {
      return section.content as {
        title: string
        href?: string
        subtitle?: string
      }[]
    }
  }
  return []
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
  lines.push(isFrench ? "## Contact" : "## Contact", "")
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

export function getStructuredData(language: PortfolioLang): Record<string, unknown> {
  const isFrench = language === "fr"
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    name: "Valentin Genest",
    jobTitle: isFrench ? "Développeur Front-end" : "Front-end Developer",
    url: `https://valentingenest.fr/${language}`,
    image: "https://valentingenest.fr/img/moi.webp",
    sameAs: [
      "https://github.com/valentingnt",
      "https://www.linkedin.com/in/valentin-genest/",
      "https://www.malt.fr/profile/valentingenest",
    ],
    email: "contact@valentingenest.fr",
    nationality: "French",
    knowsLanguage: ["fr", "en"],
    address: {
      "@type": "PostalAddress",
      addressLocality: "Bordeaux",
      addressCountry: "FR",
    },
  }
}

export function renderPortfolioMarkdown(language: PortfolioLang): string {
  const isFrench = language === "fr"
  const about = getAboutContent(language)
  const skills = getSkillsContent(language)

  const seoTitle = isFrench
    ? "Valentin Genest — Développeur Front-end"
    : "Valentin Genest — Front-end Developer"
  const seoDescription = isFrench
    ? "Développeur front-end avec 5 ans d'expérience, basé entre Paris et Bordeaux. Spécialisé dans la création d'expériences web accessibles et performantes."
    : "Front-end developer with 5 years of experience, based between Paris and Bordeaux. Building accessible and performant web experiences."
  const seoImage = "https://valentingenest.fr/img/ogImage.jpg"

  const altNote = isFrench
    ? "_Available in English at [/en](/en)._"
    : "_Disponible en français sur [/fr](/fr)._"

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

  const structuredData = getStructuredData(language)
  const jsonLdBlock = `\`\`\`json\n${JSON.stringify(structuredData, null, 2)}\n\`\`\``

  return `---
title: ${seoTitle}
description: ${seoDescription}
image: ${seoImage}
---

# ${about.header.title}

> ${about.header.subtitle}

${altNote}

${sectionsMd}

${skillsHeading}

${renderSkillsList(skills)}

${renderFooter(about.footer, isFrench)}

${jsonLdBlock}
`
}
