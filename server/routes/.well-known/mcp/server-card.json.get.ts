export default defineEventHandler((event) => {
  const requestUrl = getRequestURL(event)
  const origin = `${requestUrl.protocol}//${requestUrl.host}`

  setResponseHeader(event, "content-type", "application/json")
  setResponseHeader(event, "cache-control", "public, max-age=3600")

  return {
    schemaVersion: "2025-06-18",
    serverInfo: {
      name: "valentingenest-portfolio",
      title: "Valentin Genest — Portfolio MCP",
      version: "1.0.0",
      description:
        "Read-only MCP server exposing the public portfolio of Valentin Genest: about, skills, recent projects, contact information, and resume URLs.",
    },
    transport: {
      type: "streamable-http",
      endpoint: `${origin}/mcp`,
    },
    capabilities: {
      tools: { listChanged: false },
      resources: { listChanged: false, subscribe: false },
      prompts: { listChanged: false },
    },
    auth: {
      required: false,
    },
    documentation: `${origin}/llms.txt`,
    contact: {
      email: "contact@valentingenest.fr",
      url: "https://valentingenest.fr",
    },
  }
})
