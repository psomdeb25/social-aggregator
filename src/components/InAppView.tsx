import { useEffect } from 'react'
import { openInAppWindow, openInNewTab } from '../apps/launch'
import type { SocialApp } from '../apps/registry'
import { BackIcon, ExternalIcon, WindowIcon } from './icons'

export function InAppView({ app, onClose }: { app: SocialApp; onClose(): void }) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  return (
    <div className="inapp" role="dialog" aria-label={app.name}>
      <header className="inapp__bar">
        <button className="icon-btn" aria-label="Back to apps" onClick={onClose}>
          <BackIcon width={22} height={22} />
        </button>
        <div className="inapp__title">
          <strong>{app.name}</strong>
          <small>{new URL(app.url).host}</small>
        </div>
        <button className="icon-btn" aria-label={`Open ${app.name} in new tab`} onClick={() => openInNewTab(app)}>
          <ExternalIcon width={20} height={20} />
        </button>
      </header>

      {app.frameable ? (
        <iframe className="inapp__frame" src={app.url} title={app.name} referrerPolicy="strict-origin-when-cross-origin" />
      ) : (
        <div className="inapp__blocked">
          <span className="app-icon__tile inapp__tile" style={{ background: app.tile }}>
            <svg viewBox="0 0 24 24" fill="#fff" aria-hidden="true">
              <path d={app.glyph} />
            </svg>
          </span>
          <h2>{app.name} can’t be shown inside Hub</h2>
          <p>
            {app.name} blocks other sites from embedding it, to protect your login. Open it in its own app window
            instead and sign in there. Your session stays signed in for next time.
          </p>
          <div className="inapp__actions">
            <button className="pill pill--primary" onClick={() => openInAppWindow(app)}>
              <WindowIcon width={20} height={20} /> Open app window
            </button>
            <button className="pill pill--muted" onClick={() => openInNewTab(app)}>
              <ExternalIcon width={20} height={20} /> Open in new tab
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
