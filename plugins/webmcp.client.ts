type WebMcpToolHandler = (
  args: Record<string, unknown>,
) => unknown | Promise<unknown>

type WebMcpTool = {
  name: string
  description: string
  inputSchema: Record<string, unknown>
  execute: WebMcpToolHandler
}

type WebMcpModelContext = {
  registerTool?: (
    tool: WebMcpTool,
    options?: { signal?: AbortSignal },
  ) => Promise<unknown> | unknown
  provideContext?: (context: { tools: WebMcpTool[] }) => unknown
}

type WebMcpNavigator = Navigator & {
  modelContext?: WebMcpModelContext
}

const CONTACT_EMAIL = "contact@valentingenest.fr"

const RESUME_BY_LANGUAGE: Record<"fr" | "en", string> = {
  fr: "/CV2024_Valentin_Genest.pdf",
  en: "/EN_CV2024_Valentin_Genest.pdf",
}

function detectCurrentLanguage(): "fr" | "en" {
  if (typeof window === "undefined") {
    return "fr"
  }
  const segment = window.location.pathname.split("/").filter(Boolean)[0]
  if (segment === "fr" || segment === "en") {
    return segment
  }
  return "fr"
}

async function fetchPortfolioMarkdown(language: "fr" | "en"): Promise<string> {
  const response = await fetch(`/${language}`, {
    headers: { Accept: "text/markdown" },
  })
  if (!response.ok) {
    throw new Error(`Failed to fetch portfolio markdown (${response.status})`)
  }
  return response.text()
}

async function copyToClipboardSafe(text: string): Promise<boolean> {
  if (typeof navigator === "undefined" || !navigator.clipboard) {
    return false
  }
  try {
    await navigator.clipboard.writeText(text)
    return true
  } catch {
    return false
  }
}

function buildTools(): WebMcpTool[] {
  return [
    {
      name: "get_portfolio_markdown",
      description:
        "Fetch the full portfolio of Valentin Genest as Markdown for the current or requested language.",
      inputSchema: {
        type: "object",
        properties: {
          language: {
            type: "string",
            enum: ["fr", "en"],
            description: "Language to fetch. Defaults to the current page language.",
          },
        },
        additionalProperties: false,
      },
      async execute(args) {
        const language =
          args.language === "fr" || args.language === "en"
            ? args.language
            : detectCurrentLanguage()
        return fetchPortfolioMarkdown(language)
      },
    },
    {
      name: "switch_language",
      description:
        "Navigate the portfolio to the French (fr) or English (en) version.",
      inputSchema: {
        type: "object",
        properties: {
          language: { type: "string", enum: ["fr", "en"] },
        },
        required: ["language"],
        additionalProperties: false,
      },
      execute(args) {
        const language = args.language === "en" ? "en" : "fr"
        if (typeof window !== "undefined") {
          window.location.href = `/${language}`
        }
        return { navigatedTo: `/${language}` }
      },
    },
    {
      name: "copy_contact_email",
      description:
        "Copy Valentin Genest's contact email to the clipboard. Returns the email address.",
      inputSchema: {
        type: "object",
        properties: {},
        additionalProperties: false,
      },
      async execute() {
        const copied = await copyToClipboardSafe(CONTACT_EMAIL)
        return { email: CONTACT_EMAIL, copiedToClipboard: copied }
      },
    },
    {
      name: "open_resume",
      description:
        "Open Valentin Genest's PDF resume in a new tab and return the public URL.",
      inputSchema: {
        type: "object",
        properties: {
          language: {
            type: "string",
            enum: ["fr", "en"],
            description: "Resume language. Defaults to the current page language.",
          },
        },
        additionalProperties: false,
      },
      execute(args) {
        const language =
          args.language === "fr" || args.language === "en"
            ? args.language
            : detectCurrentLanguage()
        const path = RESUME_BY_LANGUAGE[language]
        const absolute = `${window.location.origin}${path}`
        window.open(absolute, "_blank", "noopener,noreferrer")
        return { url: absolute, language }
      },
    },
    {
      name: "get_contact_info",
      description:
        "Return Valentin Genest's contact information: email, professional profiles, and resume URLs.",
      inputSchema: {
        type: "object",
        properties: {},
        additionalProperties: false,
      },
      execute() {
        const origin =
          typeof window !== "undefined" ? window.location.origin : "https://valentingenest.fr"
        return {
          email: CONTACT_EMAIL,
          location: "Paris / Bordeaux, France",
          profiles: {
            linkedin: "https://www.linkedin.com/in/valentin-genest/",
            github: "https://github.com/valentingnt",
            malt: "https://www.malt.fr/profile/valentingenest",
          },
          resumes: {
            fr: `${origin}${RESUME_BY_LANGUAGE.fr}`,
            en: `${origin}${RESUME_BY_LANGUAGE.en}`,
          },
        }
      },
    },
  ]
}

function registerWebMcpTools() {
  if (typeof window === "undefined") {
    return
  }
  const nav = window.navigator as WebMcpNavigator
  if (!nav?.modelContext) {
    return
  }

  const tools = buildTools()

  if (typeof nav.modelContext.provideContext === "function") {
    try {
      nav.modelContext.provideContext({ tools })
    } catch {
      // ignore — fall through to per-tool registration
    }
  }

  if (typeof nav.modelContext.registerTool === "function") {
    for (const tool of tools) {
      try {
        nav.modelContext.registerTool(tool)
      } catch {
        // ignore
      }
    }
  }
}

export default defineNuxtPlugin(() => {
  registerWebMcpTools()
})
