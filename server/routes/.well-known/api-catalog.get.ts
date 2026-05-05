export default defineEventHandler((event) => {
  const requestUrl = getRequestURL(event)
  const origin = `${requestUrl.protocol}//${requestUrl.host}`

  setResponseHeader(event, "content-type", "application/linkset+json")
  setResponseHeader(event, "cache-control", "public, max-age=3600")

  return {
    linkset: [
      {
        anchor: `${origin}/api`,
        "service-desc": [
          {
            href: `${origin}/api/openapi.json`,
            type: "application/openapi+json",
          },
        ],
        "service-doc": [
          {
            href: `${origin}/api/docs`,
            type: "text/html",
          },
        ],
        status: [
          {
            href: `${origin}/api/health`,
            type: "application/json",
          },
        ],
        describedby: [
          {
            href: `${origin}/.well-known/oauth-protected-resource`,
            type: "application/json",
          },
        ],
      },
      {
        anchor: `${origin}/api/mcp`,
        "service-desc": [
          {
            href: `${origin}/.well-known/mcp/server-card.json`,
            type: "application/json",
          },
        ],
        "service-doc": [
          {
            href: `${origin}/api/docs`,
            type: "text/html",
          },
        ],
        type: "mcp-server",
      },
    ],
  }
})
