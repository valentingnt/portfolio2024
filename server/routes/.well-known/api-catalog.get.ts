export default defineEventHandler((event) => {
  const requestUrl = getRequestURL(event)
  const origin = `${requestUrl.protocol}//${requestUrl.host}`

  setResponseHeader(event, "content-type", "application/linkset+json")
  setResponseHeader(event, "cache-control", "public, max-age=3600")

  return {
    linkset: [
      {
        anchor: `${origin}/mcp`,
        "service-desc": [
          {
            href: `${origin}/.well-known/mcp/server-card.json`,
            type: "application/json",
          },
        ],
        "service-doc": [
          {
            href: `${origin}/llms.txt`,
            type: "text/plain",
          },
        ],
        status: [
          {
            href: `${origin}/mcp`,
            type: "application/json",
          },
        ],
        type: "mcp-server",
      },
    ],
  }
})
