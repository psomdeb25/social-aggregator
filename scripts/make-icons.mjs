// Renders public/favicon.svg to the PNG icons the PWA manifest needs.
// Usage: node scripts/make-icons.mjs (requires Playwright + Chromium).
import { readFileSync } from 'node:fs'
import { createRequire } from 'node:module'
const { chromium } = createRequire(import.meta.url)('playwright')

const svg = readFileSync(new URL('../public/favicon.svg', import.meta.url), 'utf8')
const browser = await chromium.launch()
const page = await browser.newPage()

async function render(file, size, { maskable = false } = {}) {
  // Maskable icons need full-bleed background and the glyph inside the 80% safe zone.
  const inner = maskable ? svg.replace('rx="120"', 'rx="0"').replace('<g ', '<g transform="translate(51 51) scale(0.8)" ') : svg
  await page.setViewportSize({ width: size, height: size })
  await page.setContent(
    `<style>html,body{margin:0;background:transparent}svg{display:block;width:${size}px;height:${size}px}</style>${inner}`,
  )
  await page.screenshot({ path: new URL(`../public/${file}`, import.meta.url).pathname, omitBackground: true })
}

await render('pwa-192.png', 192)
await render('pwa-512.png', 512)
await render('pwa-maskable-512.png', 512, { maskable: true })
await render('apple-touch-icon.png', 180, { maskable: true })
await browser.close()
