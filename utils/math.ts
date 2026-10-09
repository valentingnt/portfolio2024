export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max)
}

export function parseMarkdown(content: string) {
  return content.replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" class="link" target="_blank" rel="noopener noreferrer">$1</a>')
}

const HTML_ESCAPES: Record<string, string> = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }

export function escapeHtml(text: string) {
  return text.replace(/[&<>"]/g, (char) => HTML_ESCAPES[char] ?? char)
}

// Wraps every visible character of an HTML string in <span class="ch"> for
// useCharRipple(). Only text nodes are touched (tags and attributes pass
// through), an entity counts as one character, and whitespace stays bare text
// so justification and line breaking behave as before. A pure string
// transform, so server and client render identical markup.
export function splitChars(html: string) {
  return html.replace(/(^|>)([^<]+)/g, (_, open: string, text: string) =>
    open + text.replace(/&#?\w+;|\S/g, (char) => `<span class="ch">${char}</span>`)
  )
}

export function copyToClipboard(text: string) {
  return navigator.clipboard.writeText(text)
}