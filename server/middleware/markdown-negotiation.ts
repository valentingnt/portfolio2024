import { getRequestHeader, getRequestURL, setResponseHeader } from "h3"
import {
  isSupportedLanguage,
  renderPortfolioMarkdown,
  type PortfolioLang,
} from "../utils/portfolio-content"

const MARKDOWN_ACCEPT_RE = /(^|,)\s*text\/markdown\s*(;|,|$)/i
const EXCLUDED_PREFIXES = ["/api", "/_nuxt", "/.well-known", "/img"]
const EXCLUDED_EXACT_PATHS = [
  "/robots.txt",
  "/sitemap.xml",
  "/llms.txt",
  "/favicon.ico",
]

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

function resolveLanguage(pathname: string): PortfolioLang {
  const firstSegment = pathname.split("/").filter(Boolean)[0]
  if (isSupportedLanguage(firstSegment)) {
    return firstSegment
  }
  return "fr"
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
  const markdown = renderPortfolioMarkdown(language)

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
