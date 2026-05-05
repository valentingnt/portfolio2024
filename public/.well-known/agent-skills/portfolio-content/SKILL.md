# Fetch Valentin Genest's portfolio as Markdown

This site exposes its content in a machine-readable Markdown form for agents.

## Available pages

- `/` — root (redirects to the visitor's preferred language)
- `/fr` — French version of the portfolio
- `/en` — English version of the portfolio

## How to fetch as Markdown

Send a GET request with the `Accept: text/markdown` header to any of the
HTML pages above. The server will respond with `Content-Type: text/markdown`
and an `x-markdown-tokens` header containing an estimated token count.

```
GET /en HTTP/1.1
Host: valentingenest.fr
Accept: text/markdown
```

If the `Accept` header is omitted, the same URL returns the standard HTML
representation, so browsers continue to work as expected.

## What the Markdown contains

- Front matter (`title`, `description`, `language`, `canonical`)
- The full About content (introduction, recent projects, toolkit, certifications, hobbies)
- A complete skills list with descriptions
- Contact links (LinkedIn, GitHub, Malt)
- Navigation references (sitemap, robots, API catalog, llms.txt)

## Related discovery endpoints

- `/llms.txt` — short summary index for LLM crawlers
- `/.well-known/api-catalog` — RFC 9727 link set for APIs
- `/sitemap.xml` — list of canonical URLs
- `/robots.txt` — crawler rules
