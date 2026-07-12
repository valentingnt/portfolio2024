# CLAUDE.md

Guidance for Claude Code when working in this repository.

## What this project is

Personal portfolio site of Valentin Genest (valentingenest.fr). A **single-page, bilingual (FR/EN) Nuxt 4 app** deployed on Vercel. There is only one real page (the "about" page) plus an error page. The site is SSR'd and the `/fr` and `/en` routes are prerendered at build time.

Stack: **Nuxt 4 + Vue 3 + TypeScript + SCSS**. Package manager is **Yarn 1** (`yarn.lock` — never use npm or pnpm). No test suite exists. Smooth scrolling via `lenis`, analytics via Google Analytics (gtag) + Vercel Analytics/Speed Insights.

## Commands

```bash
yarn install       # install deps (runs `nuxt prepare` postinstall)
yarn dev           # dev server on http://localhost:3000
yarn build         # production build (use this to verify changes compile)
yarn lint          # eslint check
yarn lint:fix      # eslint autofix
```

There are no tests. Verify changes with `yarn lint` and `yarn build`.

## Directory map

| Path | Purpose |
|---|---|
| `app.vue` | Root: boots Lenis smooth scroll (skipped under reduced motion), analytics, renders `<DuckFeet>` + `<NuxtPage>` |
| `pages/index.vue` | `/` → 302 redirect to `/fr` or `/en` based on `lang` cookie |
| `pages/[lang]/index.vue` | The single content page. Validates lang is `fr`/`en` |
| `error.vue` | 404/error page, bilingual via `lang` cookie |
| `components/` | Auto-imported Vue components (see naming rules below) |
| `components/ui/` | Generic UI: `Marquee`, `Tag`, `Toast` — used as `<UiMarquee>`, `<UiTag>`, `<UiToast>` |
| `components/about/` | Page sections: `Header`, `Sections`, `Footer` — used as `<AboutHeader>` etc. |
| `components/DuckFeet.vue` | Large canvas animation: duck footprints wandering the viewport (see below) |
| `composables/` | Auto-imported composables (`useTheme`, `useLanguage`, `watchScroll`, …) |
| `content/about.json` | ALL page text (FR + EN). Edit this to change page copy |
| `content/skills.json` | Skills marquee items (FR + EN) |
| `types/` | TypeScript types for content JSON, SEO, analytics |
| `utils/math.ts` | Auto-imported helpers: `clamp`, `parseMarkdown`, `copyToClipboard` |
| `assets/stylesheets/` | Global SCSS: `globals.scss`, `variables/` (colors, animations, fonts), `resources/` (typography, easeGradient) |
| `public/` | Static: fonts (DM Mono, DM Serif Text), images, CV PDFs, robots.txt, sitemap.xml |
| `nuxt.config.ts` | Head config (font/image preloads, pre-paint theme script), prerender routes |
| `vercel.json` | Immutable cache headers for `/fonts/*` and `/img/*` |

## Key architecture facts

### Content lives in JSON, not in components
Page text comes from `content/about.json` and `content/skills.json`, each with top-level `en` and `fr` keys that MUST stay structurally identical. Types in `types/about.ts` / `types/skills.ts`. To change wording, edit the JSON — do not hardcode copy into components. Small UI strings (button labels, toggle labels) are the exception: they are inline ternaries on `isEnglish` (e.g. `isEnglish ? 'copied!' : 'copié!'`).

Section text supports one markdown feature: `[label](url)` links, converted by `parseMarkdown()` in `utils/math.ts` and rendered with `v-html` (safe because content is local JSON).

### i18n: route param + cookie, no i18n library
- URL is the source of truth: `/fr` and `/en`. `useLanguage()` (composables/useLanguage.ts) syncs `route.params.lang` ↔ a shared `useState('lang')` ↔ the `lang` cookie.
- `pages/index.vue` redirects `/` to the cookie's language (default `fr`).
- Any component needing language calls `useLanguage(useRoute().params.lang as string)` and uses `isEnglish`.
- SEO meta (title, description, JSON-LD, hreflang) is built per-language in `composables/useSEO.ts`.

### Theming: `data-theme` attribute + CSS custom properties
- Palette is defined once in `assets/stylesheets/variables/_colors.scss` as `--color-primary` / `--color-secondary` / `--color-accent` (plus `-rgb` variants), flipped by `[data-theme="dark"]`. **Always use these variables for colors — never hardcode hex values in components.**
- `useTheme()` stores the preference (`light`/`dark`/`system`) in the `theme-preference` cookie and sets `data-theme` on `<html>`.
- An inline script in `nuxt.config.ts` head reads that cookie and sets `data-theme` **before first paint** to avoid a flash. If you change the cookie name or theme logic, update that inline script too.
- Theme color changes transition over 0.5s `cubic-bezier(0.22, 1, 0.36, 1)` (see `globals.scss`); `DuckFeet.vue` replicates this same duration/curve in canvas — keep them in sync.

### SSR/hydration rules (important — easy to break)
- The site is SSR'd. **Never render different markup on server vs client.** Patterns used in this repo:
  - `SkillsMarquee.vue` renders skills unshuffled on the server, then shuffles in `onMounted`.
  - `DuckFeet.vue` always renders its `<canvas>` (never `v-if` on a client-only media query); reduced motion just leaves it blank.
- Anything touching `window`/`document` goes in `onMounted` or behind `import.meta.client`.

### Motion and performance conventions
This site is heavily animation-tuned. Follow these rules for any new interactive/animated code:
- **Respect reduced motion**: gate all animation on `useReducedMotion()` (a shared reactive ref that also reacts to runtime OS changes). Lenis, DuckFeet, and Marquee all do this.
- **Use the shared listeners**: `watchScroll(fn, { defer: true })` and `watchWindowResize(fn)` register on shared singleton window listeners; do NOT add your own `window.addEventListener('scroll'|'resize')` in components. `defer: true` batches to one call per animation frame.
- Direct DOM listeners you do add should be `{ passive: true }`; in templates use `@click.passive` etc. (the existing components do this everywhere).
- rAF loops must pause when not needed: disconnect/stop on unmount, when off-screen (IntersectionObserver), or when settled — see `Marquee.vue` for the reference pattern.
- Heavy init is deferred to idle (`requestIdleCallback` with a `setTimeout` fallback for Safari) — see `useAnalytics.ts` and `DuckFeet.vue`.

### DuckFeet.vue
A ~1000-line canvas simulation of duck footprints (wander/flee/idle behaviors, sprite-baked body shadows, theme-fade handling, a frosted-glass mask over the content column via `[data-duck-mask]`). It is performance-critical and dense with tuned constants and explanatory comments. **Do not refactor or "simplify" it unless explicitly asked.** For targeted changes, read its comments first — the non-obvious tricks (shadow-blur instead of ctx.filter, cached mask rect, sprite baking) are all documented inline.

### Analytics
`useAnalytics()` in `app.vue` loads gtag lazily. Track user actions with `trackEvent(name, params)` (exported from `composables/useAnalytics.ts`), e.g. `trackEvent('copy_email', { language: lang.value })`.

## Styling conventions

- SCSS everywhere, `<style scoped lang="scss">` in components.
- Import shared partials with `@use '~/assets/stylesheets/...' as *`.
- Typography via placeholder selectors: `@extend %text-body`, `%text-h1`, `%text-h2`, `%link` (from `resources/_typography.scss`). Fonts are DM Mono (body) and DM Serif Text (h1), self-hosted in `public/fonts/`.
- Entrance animations use the `@include page-transition($delay)` mixin with per-element `$page-transition-*-delay` variables from `variables/_animations.scss`; they activate when `.AboutPage.is-visible` is set by `usePageTransition()`. New page elements should join this system, not invent their own entrance.
- Hover styles go inside `@media (hover: hover)` so touch devices don't get sticky hovers.
- Mobile breakpoint is `640px` (used consistently in SCSS media queries and JS `MOBILE_BREAKPOINT` constants).

## Code conventions

- **Component naming/auto-import**: Nuxt auto-imports components with directory prefixes — `components/ui/Tag.vue` → `<UiTag>`, `components/about/Header.vue` → `<AboutHeader>`, root-level `components/DuckFeet.vue` → `<DuckFeet>`. No manual imports of components, composables, or `utils/` functions — Nuxt auto-imports them all.
- Props via `defineProps<Interface>()` with a named interface (destructure with defaults where needed); emits via `defineEmits<{ eventName: [argType] }>()`.
- Component root element gets a PascalCase class matching the component name (`.Marquee`, `.Tag`, `.AboutPage`) and styles nest under it.
- Constants in `SCREAMING_SNAKE_CASE` at the top of `<script setup>`.
- No semicolons, single quotes, 2-space indent (match surrounding files; there is no prettier config — eslint via `@nuxt/eslint-config` is the only check).
- Always clean up in `onUnmounted`: observers, timeouts, rAF ids, event listeners.
- Comments explain *why* (tuning rationale, browser quirks), not *what*. Keep that standard.

## Gotchas

- `pages/[lang]/index.vue` sets `key: (route) => route.name` in `definePageMeta` so switching FR↔EN reuses the component instance instead of remounting (which would replay the entrance animation). Don't remove it.
- The image and fonts preloaded in `nuxt.config.ts` head must stay in sync with what the page actually uses (`/img/moi.webp`, DM fonts).
- The CV PDFs in `public/` are referenced by exact filename in `pages/[lang]/index.vue` (`handleResumeDownload`), and the displayed file sizes are hardcoded there — update both if the PDFs change.
- `sitemap.xml` and `robots.txt` are static files in `public/`; update the sitemap manually if routes change.
- Prerendered routes are listed in `nitro.prerender.routes` in `nuxt.config.ts` (`/fr`, `/en`) — add new routes there if any are ever created.
