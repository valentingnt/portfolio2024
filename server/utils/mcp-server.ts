import {
  getAboutContent,
  getContactInfo,
  getRecentProjects,
  getSkillsContent,
  isSupportedLanguage,
  renderPortfolioMarkdown,
  type PortfolioLang,
} from "./portfolio-content"

const PROTOCOL_VERSION = "2025-06-18"

export const SERVER_INFO = {
  name: "valentingenest-portfolio",
  title: "Valentin Genest — Portfolio MCP",
  version: "1.0.0",
}

type JsonRpcId = string | number | null

export type JsonRpcRequest = {
  jsonrpc: "2.0"
  id?: JsonRpcId
  method: string
  params?: Record<string, unknown>
}

export type JsonRpcResponse = {
  jsonrpc: "2.0"
  id: JsonRpcId
  result?: unknown
  error?: { code: number; message: string; data?: unknown }
}

const ERROR_PARSE = -32700
const ERROR_INVALID_REQUEST = -32600
const ERROR_METHOD_NOT_FOUND = -32601
const ERROR_INVALID_PARAMS = -32602

function isJsonRpcRequest(value: unknown): value is JsonRpcRequest {
  if (!value || typeof value !== "object") {
    return false
  }
  const candidate = value as Record<string, unknown>
  return candidate.jsonrpc === "2.0" && typeof candidate.method === "string"
}

function makeError(
  id: JsonRpcId,
  code: number,
  message: string,
  data?: unknown,
): JsonRpcResponse {
  return {
    jsonrpc: "2.0",
    id,
    error: { code, message, ...(data !== undefined ? { data } : {}) },
  }
}

function makeResult(id: JsonRpcId, result: unknown): JsonRpcResponse {
  return { jsonrpc: "2.0", id, result }
}

const TOOLS = [
  {
    name: "get_portfolio_markdown",
    title: "Get portfolio as Markdown",
    description:
      "Return the full portfolio of Valentin Genest as Markdown for the requested language (fr or en).",
    inputSchema: {
      type: "object",
      properties: {
        language: {
          type: "string",
          enum: ["fr", "en"],
          description: "Portfolio language. Defaults to 'en'.",
        },
      },
      additionalProperties: false,
    },
  },
  {
    name: "list_skills",
    title: "List skills",
    description: "List the technical skills of Valentin Genest with descriptions.",
    inputSchema: {
      type: "object",
      properties: {
        language: { type: "string", enum: ["fr", "en"] },
      },
      additionalProperties: false,
    },
  },
  {
    name: "list_recent_projects",
    title: "List recent projects",
    description:
      "List the recent client projects with their studio attribution and URL when public.",
    inputSchema: {
      type: "object",
      properties: {
        language: { type: "string", enum: ["fr", "en"] },
      },
      additionalProperties: false,
    },
  },
  {
    name: "get_contact_info",
    title: "Get contact information",
    description:
      "Return Valentin Genest's contact email, professional profiles, and resume URLs.",
    inputSchema: {
      type: "object",
      properties: {},
      additionalProperties: false,
    },
  },
  {
    name: "get_resume_url",
    title: "Get resume URL",
    description: "Return the public URL of Valentin Genest's PDF resume.",
    inputSchema: {
      type: "object",
      properties: {
        language: {
          type: "string",
          enum: ["fr", "en"],
          description: "Resume language. Defaults to 'en'.",
        },
      },
      additionalProperties: false,
    },
  },
] as const

const RESOURCES = [
  {
    uri: "portfolio://about/en",
    name: "Portfolio (English)",
    description: "Full portfolio content in English as structured Markdown.",
    mimeType: "text/markdown",
  },
  {
    uri: "portfolio://about/fr",
    name: "Portfolio (French)",
    description: "Full portfolio content in French as structured Markdown.",
    mimeType: "text/markdown",
  },
  {
    uri: "portfolio://skills/en",
    name: "Skills (English)",
    description: "Technical skills of Valentin Genest in English (JSON).",
    mimeType: "application/json",
  },
  {
    uri: "portfolio://skills/fr",
    name: "Skills (French)",
    description: "Technical skills of Valentin Genest in French (JSON).",
    mimeType: "application/json",
  },
  {
    uri: "portfolio://contact",
    name: "Contact information",
    description: "Email, social profiles, and resume URLs (JSON).",
    mimeType: "application/json",
  },
] as const

const PROMPTS = [
  {
    name: "introduce_valentin",
    title: "Introduce Valentin Genest",
    description:
      "Generate a short, friendly introduction of Valentin Genest based on his portfolio.",
    arguments: [
      {
        name: "language",
        description: "Output language (fr or en).",
        required: false,
      },
    ],
  },
] as const

function resolveLang(value: unknown, fallback: PortfolioLang = "en"): PortfolioLang {
  return isSupportedLanguage(value) ? value : fallback
}

function textContent(text: string) {
  return [{ type: "text", text }]
}

function callTool(
  name: string,
  args: Record<string, unknown>,
): { content: unknown[]; isError?: boolean } {
  switch (name) {
    case "get_portfolio_markdown": {
      const language = resolveLang(args.language)
      return { content: textContent(renderPortfolioMarkdown(language)) }
    }
    case "list_skills": {
      const language = resolveLang(args.language)
      const skills = getSkillsContent(language)
      return { content: textContent(JSON.stringify(skills, null, 2)) }
    }
    case "list_recent_projects": {
      const language = resolveLang(args.language)
      const projects = getRecentProjects(language)
      return { content: textContent(JSON.stringify(projects, null, 2)) }
    }
    case "get_contact_info": {
      return { content: textContent(JSON.stringify(getContactInfo(), null, 2)) }
    }
    case "get_resume_url": {
      const language = resolveLang(args.language)
      const url = getContactInfo().resumes[language]
      return { content: textContent(url) }
    }
    default:
      return {
        isError: true,
        content: textContent(`Unknown tool: ${name}`),
      }
  }
}

function readResource(
  uri: string,
): { contents: { uri: string; mimeType: string; text: string }[] } | null {
  if (uri === "portfolio://contact") {
    return {
      contents: [
        {
          uri,
          mimeType: "application/json",
          text: JSON.stringify(getContactInfo(), null, 2),
        },
      ],
    }
  }

  const aboutMatch = uri.match(/^portfolio:\/\/about\/(fr|en)$/)
  if (aboutMatch) {
    const language = aboutMatch[1] as PortfolioLang
    return {
      contents: [
        {
          uri,
          mimeType: "text/markdown",
          text: renderPortfolioMarkdown(language),
        },
      ],
    }
  }

  const skillsMatch = uri.match(/^portfolio:\/\/skills\/(fr|en)$/)
  if (skillsMatch) {
    const language = skillsMatch[1] as PortfolioLang
    return {
      contents: [
        {
          uri,
          mimeType: "application/json",
          text: JSON.stringify(getSkillsContent(language), null, 2),
        },
      ],
    }
  }

  return null
}

function getPrompt(
  name: string,
  args: Record<string, unknown>,
): { description: string; messages: unknown[] } | null {
  if (name === "introduce_valentin") {
    const language = resolveLang(args.language)
    const about = getAboutContent(language)
    const intro = typeof about.sections[0]?.content === "string"
      ? (about.sections[0].content as string)
      : ""
    return {
      description: "A short introduction of Valentin Genest.",
      messages: [
        {
          role: "user",
          content: {
            type: "text",
            text:
              language === "fr"
                ? `Présente Valentin Genest en quelques phrases en te basant sur ces informations : ${intro}`
                : `Briefly introduce Valentin Genest based on this background: ${intro}`,
          },
        },
      ],
    }
  }
  return null
}

export function handleJsonRpc(request: JsonRpcRequest): JsonRpcResponse | null {
  const id = request.id ?? null
  const method = request.method
  const params = (request.params ?? {}) as Record<string, unknown>

  // Notifications: no response expected.
  if (id === undefined || id === null) {
    if (method.startsWith("notifications/")) {
      return null
    }
  }

  switch (method) {
    case "initialize":
      return makeResult(id, {
        protocolVersion: PROTOCOL_VERSION,
        serverInfo: SERVER_INFO,
        capabilities: {
          tools: { listChanged: false },
          resources: { listChanged: false, subscribe: false },
          prompts: { listChanged: false },
          logging: {},
        },
        instructions:
          "Read-only MCP server exposing the public portfolio of Valentin Genest. Use tools to fetch about content, skills, projects, contact info, or resume URLs.",
      })

    case "ping":
      return makeResult(id, {})

    case "tools/list":
      return makeResult(id, { tools: TOOLS })

    case "tools/call": {
      const name = params.name
      if (typeof name !== "string") {
        return makeError(id, ERROR_INVALID_PARAMS, "Missing tool name")
      }
      const args = (params.arguments ?? {}) as Record<string, unknown>
      const outcome = callTool(name, args)
      return makeResult(id, outcome)
    }

    case "resources/list":
      return makeResult(id, { resources: RESOURCES })

    case "resources/read": {
      const uri = params.uri
      if (typeof uri !== "string") {
        return makeError(id, ERROR_INVALID_PARAMS, "Missing resource uri")
      }
      const result = readResource(uri)
      if (!result) {
        return makeError(id, ERROR_INVALID_PARAMS, `Unknown resource: ${uri}`)
      }
      return makeResult(id, result)
    }

    case "prompts/list":
      return makeResult(id, { prompts: PROMPTS })

    case "prompts/get": {
      const name = params.name
      if (typeof name !== "string") {
        return makeError(id, ERROR_INVALID_PARAMS, "Missing prompt name")
      }
      const args = (params.arguments ?? {}) as Record<string, unknown>
      const result = getPrompt(name, args)
      if (!result) {
        return makeError(id, ERROR_INVALID_PARAMS, `Unknown prompt: ${name}`)
      }
      return makeResult(id, result)
    }

    case "notifications/initialized":
    case "notifications/cancelled":
    case "notifications/progress":
    case "notifications/roots/list_changed":
      return null

    default:
      if (id !== undefined) {
        return makeError(id, ERROR_METHOD_NOT_FOUND, `Method not found: ${method}`)
      }
      return null
  }
}

export function handleJsonRpcPayload(
  payload: unknown,
):
  | JsonRpcResponse
  | JsonRpcResponse[]
  | null
  | { error: JsonRpcResponse } {
  if (Array.isArray(payload)) {
    const responses = payload
      .map((item) =>
        isJsonRpcRequest(item)
          ? handleJsonRpc(item)
          : makeError(null, ERROR_INVALID_REQUEST, "Invalid JSON-RPC request"),
      )
      .filter((value): value is JsonRpcResponse => value !== null)
    return responses.length === 0 ? null : responses
  }

  if (!isJsonRpcRequest(payload)) {
    return {
      error: makeError(null, ERROR_INVALID_REQUEST, "Invalid JSON-RPC request"),
    }
  }

  return handleJsonRpc(payload)
}

export const PARSE_ERROR = makeError(null, ERROR_PARSE, "Parse error")
