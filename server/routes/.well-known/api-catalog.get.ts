export default defineEventHandler((event) => {
  const requestUrl = getRequestURL(event)
  const origin = `${requestUrl.protocol}//${requestUrl.host}`
  const apiAnchor = `${origin}/api`

  setResponseHeader(event, "content-type", "application/linkset+json")

  return {
    linkset: [
      {
        anchor: apiAnchor,
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
      },
    ],
  }
})
