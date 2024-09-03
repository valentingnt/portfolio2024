export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max)
}

export function parseMarkdown(content: string) {
  return content.replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" class="link" target="_blank" rel="noopener noreferrer">$1</a>')
}

export function copyToClipboard(text: string) {
  return navigator.clipboard.writeText(text)
}