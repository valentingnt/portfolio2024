export default defineEventHandler((event) => {
  setResponseHeader(event, "content-type", "text/html; charset=utf-8")
  setResponseHeader(event, "cache-control", "public, max-age=3600")

  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>valentingenest.fr — API documentation</title>
    <meta name="description" content="Human-readable API documentation for the valentingenest.fr portfolio: discovery, content negotiation, and operational endpoints." />
    <link rel="canonical" href="https://valentingenest.fr/api/docs" />
    <style>
      :root { color-scheme: light dark; --fg: #111; --muted: #555; --bg: #fafafa; --border: #ddd; }
      @media (prefers-color-scheme: dark) {
        :root { --fg: #f1f1f1; --muted: #a8a8a8; --bg: #111; --border: #2a2a2a; }
      }
      * { box-sizing: border-box; }
      body { margin: 0; font-family: ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif; color: var(--fg); background: var(--bg); line-height: 1.55; }
      main { max-width: 720px; margin: 0 auto; padding: 48px 24px 80px; }
      h1 { font-size: 1.875rem; margin: 0 0 8px; letter-spacing: -0.01em; }
      h2 { font-size: 1.125rem; margin: 32px 0 12px; }
      p, li { color: var(--fg); }
      a { color: inherit; }
      .lede { color: var(--muted); margin: 0 0 24px; }
      .endpoint { display: grid; grid-template-columns: 64px 1fr; gap: 12px; padding: 12px 0; border-top: 1px solid var(--border); }
      .endpoint:last-child { border-bottom: 1px solid var(--border); }
      .method { font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace; font-size: 0.75rem; font-weight: 600; padding: 2px 6px; border: 1px solid var(--border); border-radius: 4px; align-self: start; text-align: center; }
      .path { font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace; font-size: 0.875rem; }
      .desc { color: var(--muted); font-size: 0.9rem; margin: 4px 0 0; }
      code { font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace; font-size: 0.875rem; background: rgba(127,127,127,0.12); padding: 1px 6px; border-radius: 4px; }
      ul { padding-left: 20px; }
    </style>
  </head>
  <body>
    <main>
      <h1>valentingenest.fr API</h1>
      <p class="lede">Human-readable companion to the <a href="/api/openapi.json">OpenAPI specification</a>. This site is agent-ready: discovery, content negotiation, and a small operational surface.</p>

      <h2>Endpoints</h2>

      <div class="endpoint">
        <span class="method">GET</span>
        <div>
          <a class="path" href="/api/health">/api/health</a>
          <p class="desc">Returns <code>{"status":"ok"}</code> when the service is healthy.</p>
        </div>
      </div>

      <div class="endpoint">
        <span class="method">GET</span>
        <div>
          <a class="path" href="/api/openapi.json">/api/openapi.json</a>
          <p class="desc">OpenAPI 3.1 description of every endpoint.</p>
        </div>
      </div>

      <div class="endpoint">
        <span class="method">GET</span>
        <div>
          <a class="path" href="/.well-known/api-catalog">/.well-known/api-catalog</a>
          <p class="desc">RFC 9727 linkset describing this API and its machine-readable resources.</p>
        </div>
      </div>

      <div class="endpoint">
        <span class="method">GET</span>
        <div>
          <a class="path" href="/.well-known/agent-skills/index.json">/.well-known/agent-skills/index.json</a>
          <p class="desc">Agent Skills Discovery RFC v0.2.0 index for this site.</p>
        </div>
      </div>

      <div class="endpoint">
        <span class="method">GET</span>
        <div>
          <a class="path" href="/.well-known/mcp/server-card.json">/.well-known/mcp/server-card.json</a>
          <p class="desc">MCP Server Card describing the Model Context Protocol server.</p>
        </div>
      </div>

      <div class="endpoint">
        <span class="method">POST</span>
        <div>
          <span class="path">/api/mcp</span>
          <p class="desc">Streamable-HTTP MCP server. Accepts JSON-RPC 2.0 requests (<code>initialize</code>, <code>tools/list</code>, <code>tools/call</code>, <code>resources/list</code>, <code>resources/read</code>, <code>prompts/list</code>, <code>prompts/get</code>).</p>
        </div>
      </div>

      <div class="endpoint">
        <span class="method">GET</span>
        <div>
          <a class="path" href="/.well-known/oauth-protected-resource">/.well-known/oauth-protected-resource</a>
          <p class="desc">OAuth Protected Resource Metadata (RFC 9728). The API is open: no authorization is required.</p>
        </div>
      </div>

      <h2>Content negotiation</h2>
      <p>Any HTML page on this site can be requested as Markdown by sending an <code>Accept: text/markdown</code> header. The response uses <code>Content-Type: text/markdown</code> and includes an <code>x-markdown-tokens</code> estimate.</p>

      <h2>Other discovery files</h2>
      <ul>
        <li><a href="/llms.txt">/llms.txt</a> — short summary index for LLM crawlers</li>
        <li><a href="/robots.txt">/robots.txt</a> — crawler rules</li>
        <li><a href="/sitemap.xml">/sitemap.xml</a> — canonical URLs</li>
        <li><a href="/.well-known/security.txt">/.well-known/security.txt</a> — security disclosure contact</li>
      </ul>
    </main>
  </body>
</html>`
})
