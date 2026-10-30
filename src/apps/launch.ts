import type { SocialApp } from './registry'

export type LaunchMode = 'in-app' | 'new-tab'

const prefsKey = (userId: string) => `agg.launch.${userId}.v1`

export function getLaunchPref(userId: string, appId: string): LaunchMode | undefined {
  try {
    return JSON.parse(localStorage.getItem(prefsKey(userId)) ?? '{}')[appId]
  } catch {
    return undefined
  }
}

export function setLaunchPref(userId: string, appId: string, mode: LaunchMode | undefined) {
  let prefs: Record<string, LaunchMode> = {}
  try {
    prefs = JSON.parse(localStorage.getItem(prefsKey(userId)) ?? '{}')
  } catch {
    /* start fresh */
  }
  if (mode) prefs[appId] = mode
  else delete prefs[appId]
  localStorage.setItem(prefsKey(userId), JSON.stringify(prefs))
}

export function openInNewTab(app: SocialApp) {
  window.open(app.url, '_blank', 'noopener,noreferrer')
}

/**
 * Opens the site in a separate, app-sized popup window. On desktop (and in an
 * installed PWA) this behaves like a dedicated app window; mobile browsers
 * treat it as a new tab.
 */
export function openInAppWindow(app: SocialApp) {
  const width = Math.min(520, screen.availWidth)
  const height = Math.min(900, screen.availHeight)
  const left = Math.max(0, (screen.availWidth - width) / 2)
  const top = Math.max(0, (screen.availHeight - height) / 2)
  const win = window.open(
    app.url,
    `agg-${app.id}`,
    `popup,width=${width},height=${height},left=${left},top=${top}`,
  )
  win?.focus()
}
