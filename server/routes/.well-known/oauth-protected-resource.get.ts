export default defineEventHandler((event) => {
  const requestUrl = getRequestURL(event)
  const origin = `${requestUrl.protocol}//${requestUrl.host}`

  setResponseHeader(event, "content-type", "application/json")
  setResponseHeader(event, "cache-control", "public, max-age=3600")

  return {
    resource: `${origin}/api`,
    authorization_servers: [],
    scopes_supported: [],
    bearer_methods_supported: [],
    resource_documentation: `${origin}/api/docs`,
    resource_policy_uri: `${origin}/.well-known/security.txt`,
  }
})
