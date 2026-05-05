import {
  handleJsonRpcPayload,
  PARSE_ERROR,
} from "../../utils/mcp-server"

export default defineEventHandler(async (event) => {
  setResponseHeader(event, "content-type", "application/json")
  setResponseHeader(event, "cache-control", "no-store")

  let payload: unknown
  try {
    payload = await readBody(event)
  } catch {
    setResponseStatus(event, 400)
    return PARSE_ERROR
  }

  const result = handleJsonRpcPayload(payload)

  if (result && typeof result === "object" && "error" in result && !("jsonrpc" in result)) {
    setResponseStatus(event, 400)
    return (result as { error: unknown }).error
  }

  if (result === null) {
    setResponseStatus(event, 202)
    return null
  }

  return result
})
