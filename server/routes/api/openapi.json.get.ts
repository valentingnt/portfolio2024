export default defineEventHandler((event) => {
  const requestUrl = getRequestURL(event)
  const origin = `${requestUrl.protocol}//${requestUrl.host}`

  setResponseHeader(event, "content-type", "application/openapi+json")
  setResponseHeader(event, "cache-control", "public, max-age=3600")

  return {
    openapi: "3.1.0",
    info: {
      title: "valentingenest.fr API",
      version: "1.2.0",
      description:
        "Machine-readable API description for the valentingenest.fr portfolio. Exposes a health check, the API catalog, content-negotiated Markdown for every page, and a Model Context Protocol (MCP) server.",
      contact: {
        name: "Valentin Genest",
        email: "contact@valentingenest.fr",
        url: "https://valentingenest.fr",
      },
      license: {
        name: "All rights reserved",
      },
    },
    servers: [
      {
        url: origin,
        description: "Current origin",
      },
      {
        url: "https://valentingenest.fr",
        description: "Production",
      },
    ],
    tags: [
      { name: "discovery", description: "Agent and API discovery endpoints" },
      { name: "system", description: "Operational endpoints" },
    ],
    paths: {
      "/api/health": {
        get: {
          tags: ["system"],
          summary: "Health status",
          description: "Returns the operational status of the service.",
          operationId: "getHealthStatus",
          responses: {
            "200": {
              description: "Service is healthy",
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/HealthResponse" },
                  examples: {
                    ok: { value: { status: "ok" } },
                  },
                },
              },
            },
          },
        },
      },
      "/.well-known/api-catalog": {
        get: {
          tags: ["discovery"],
          summary: "API catalog (RFC 9727)",
          description:
            "Returns a linkset describing the available APIs and their machine-readable descriptions.",
          operationId: "getApiCatalog",
          responses: {
            "200": {
              description: "Linkset describing the available APIs",
              content: {
                "application/linkset+json": {
                  schema: { $ref: "#/components/schemas/Linkset" },
                },
              },
            },
          },
        },
      },
      "/.well-known/agent-skills/index.json": {
        get: {
          tags: ["discovery"],
          summary: "Agent skills discovery index",
          description:
            "Returns the Agent Skills Discovery RFC v0.2.0 index for this site.",
          operationId: "getAgentSkillsIndex",
          responses: {
            "200": {
              description: "Agent skills discovery index",
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/AgentSkillsIndex" },
                },
              },
            },
          },
        },
      },
      "/api/mcp": {
        get: {
          tags: ["discovery"],
          summary: "MCP server metadata",
          description:
            "Returns metadata describing the MCP server hosted on this domain.",
          operationId: "getMcpMetadata",
          responses: {
            "200": {
              description: "MCP server metadata",
              content: {
                "application/json": {
                  schema: { type: "object" },
                },
              },
            },
          },
        },
        post: {
          tags: ["discovery"],
          summary: "MCP JSON-RPC endpoint (Streamable HTTP)",
          description:
            "Accepts JSON-RPC 2.0 requests for the Model Context Protocol. Supported methods include `initialize`, `tools/list`, `tools/call`, `resources/list`, `resources/read`, `prompts/list`, `prompts/get`, and `ping`.",
          operationId: "callMcp",
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: { type: "object" },
                examples: {
                  initialize: {
                    value: {
                      jsonrpc: "2.0",
                      id: 1,
                      method: "initialize",
                      params: {
                        protocolVersion: "2025-06-18",
                        capabilities: {},
                        clientInfo: { name: "example-client", version: "1.0" },
                      },
                    },
                  },
                  toolsList: {
                    value: { jsonrpc: "2.0", id: 2, method: "tools/list" },
                  },
                },
              },
            },
          },
          responses: {
            "200": {
              description: "JSON-RPC response",
              content: {
                "application/json": {
                  schema: { type: "object" },
                },
              },
            },
            "202": {
              description: "Notification accepted (no response body)",
            },
          },
        },
      },
      "/{lang}": {
        get: {
          tags: ["discovery"],
          summary: "Localized portfolio page",
          description:
            "Returns the portfolio page in HTML by default, or in Markdown when the `Accept: text/markdown` header is set.",
          operationId: "getLocalizedPortfolio",
          parameters: [
            {
              name: "lang",
              in: "path",
              required: true,
              schema: { type: "string", enum: ["fr", "en"] },
              description: "Language code (`fr` or `en`).",
            },
            {
              name: "Accept",
              in: "header",
              required: false,
              schema: { type: "string" },
              description:
                "Use `text/markdown` to receive the Markdown version of the page.",
            },
          ],
          responses: {
            "200": {
              description: "Portfolio content",
              content: {
                "text/html": {
                  schema: { type: "string" },
                },
                "text/markdown": {
                  schema: { type: "string" },
                },
              },
            },
          },
        },
      },
    },
    components: {
      schemas: {
        HealthResponse: {
          type: "object",
          required: ["status"],
          properties: {
            status: { type: "string", enum: ["ok"] },
          },
        },
        Linkset: {
          type: "object",
          required: ["linkset"],
          properties: {
            linkset: {
              type: "array",
              items: {
                type: "object",
                required: ["anchor"],
                properties: {
                  anchor: { type: "string", format: "uri" },
                },
                additionalProperties: true,
              },
            },
          },
        },
        AgentSkillsIndex: {
          type: "object",
          required: ["skills"],
          properties: {
            $schema: { type: "string", format: "uri" },
            skills: {
              type: "array",
              items: {
                type: "object",
                required: ["name", "type", "description", "url", "digest"],
                properties: {
                  name: { type: "string" },
                  type: { type: "string", enum: ["skill-md", "archive"] },
                  description: { type: "string" },
                  url: { type: "string", format: "uri" },
                  digest: {
                    type: "string",
                    pattern: "^sha256:[0-9a-f]{64}$",
                  },
                },
              },
            },
          },
        },
      },
    },
  }
})
