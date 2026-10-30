import { useState } from 'react'
import type { LaunchMode } from '../apps/launch'
import type { SocialApp } from '../apps/registry'
import { ExternalIcon, WindowIcon } from './icons'
import { Sheet } from './Sheet'

export function LaunchSheet({
  app,
  onChoose,
  onClose,
}: {
  app: SocialApp
  onChoose(mode: LaunchMode, remember: boolean): void
  onClose(): void
}) {
  const [remember, setRemember] = useState(false)
  return (
    <Sheet title={`Open ${app.name}`} onClose={onClose}>
      <p className="sheet__text">You’ll sign in on {app.name} itself. Your Hub account never sees that password.</p>
      <div className="launch-options">
        <button className="launch-option" onClick={() => onChoose('in-app', remember)}>
          <WindowIcon width={22} height={22} />
          <span>
            <strong>Open in app</strong>
            <small>Inside Hub, or in its own app window</small>
          </span>
        </button>
        <button className="launch-option" onClick={() => onChoose('new-tab', remember)}>
          <ExternalIcon width={22} height={22} />
          <span>
            <strong>Open in new tab</strong>
            <small>Use your browser’s existing session</small>
          </span>
        </button>
      </div>
      <label className="check">
        <input type="checkbox" checked={remember} onChange={(e) => setRemember(e.target.checked)} />
        <span>Always do this for {app.name}</span>
      </label>
    </Sheet>
  )
}
