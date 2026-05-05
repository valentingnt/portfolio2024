import { SERVER_INFO } from "../utils/mcp-server"

export default defineEventHandler((event) => {
  const requestUrl = getRequestURL(event)
  const origin = `${requestUrl.protocol}//${requestUrl.host}`

  setResponseHeader(event, "content-type", "application/json")
  setResponseHeader(event, "cache-control", "public, max-age=3600")
  setResponseHeader(event, "allow", "GET, POST")

  return {
    name: SERVER_INFO.name,
    title: SERVER_INFO.title,
    version: SERVER_INFO.version,
    transport: "streamable-http",
    endpoint: `${origin}/mcp`,
    serverCard: `${origin}/.well-known/mcp/server-card.json`,
    notice:
      "POST a JSON-RPC 2.0 request to this endpoint to interact with the MCP server. GET returns this metadata for debugging only.",
  }
})
