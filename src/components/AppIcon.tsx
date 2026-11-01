import type { SocialApp } from '../apps/registry'

export function AppIcon({ app, badge, onOpen }: { app: SocialApp; badge?: number; onOpen(): void }) {
  return (
    <button className="app-icon" onClick={onOpen} aria-label={`Open ${app.name}`}>
      <span className="app-icon__tile" style={{ background: app.tile }}>
        <svg viewBox="0 0 24 24" fill="#fff" aria-hidden="true">
          <path d={app.glyph} />
        </svg>
      </span>
      {/* Reserved for unread counts in a later version. */}
      {!!badge && <span className="app-icon__badge">{badge > 99 ? '99+' : badge}</span>}
      <span className="app-icon__label">{app.name}</span>
    </button>
  )
}
