import { useState } from 'react'
import { getLaunchPref, openInNewTab, setLaunchPref, type LaunchMode } from '../apps/launch'
import { APPS, type SocialApp } from '../apps/registry'
import { useAuth } from '../auth/AuthContext'
import { AppIcon } from '../components/AppIcon'
import { Avatar } from '../components/Avatar'
import { HubMark } from '../components/icons'
import { InAppView } from '../components/InAppView'
import { LaunchSheet } from '../components/LaunchSheet'
import { Sheet } from '../components/Sheet'

function greeting(date = new Date()) {
  const h = date.getHours()
  return h < 12 ? 'Good morning' : h < 18 ? 'Good afternoon' : 'Good evening'
}

export function Home() {
  const { user, signOut } = useAuth()
  const [choosing, setChoosing] = useState<SocialApp | null>(null)
  const [viewing, setViewing] = useState<SocialApp | null>(null)
  const [menuOpen, setMenuOpen] = useState(false)
  if (!user) return null

  const launch = (app: SocialApp, mode: LaunchMode) => {
    if (mode === 'new-tab') openInNewTab(app)
    else setViewing(app)
  }

  const open = (app: SocialApp) => {
    const pref = getLaunchPref(user.id, app.id)
    if (pref) launch(app, pref)
    else setChoosing(app)
  }

  return (
    <main className="home">
      <header className="home__bar">
        <div className="home__brand">
          <HubMark className="home__mark" />
          <span>Hub</span>
        </div>
        <button className="home__me" aria-label="Account" onClick={() => setMenuOpen(true)}>
          <Avatar src={user.avatar} name={user.username} size={36} />
        </button>
      </header>

      <section className="home__content">
        <h1 className="home__greeting">
          {greeting()}, <span>{user.username}</span>
        </h1>
        <ul className="app-grid">
          {APPS.map((app) => (
            <li key={app.id}>
              <AppIcon app={app} onOpen={() => open(app)} />
            </li>
          ))}
        </ul>
      </section>

      {choosing && (
        <LaunchSheet
          app={choosing}
          onClose={() => setChoosing(null)}
          onChoose={(mode, remember) => {
            if (remember) setLaunchPref(user.id, choosing.id, mode)
            setChoosing(null)
            launch(choosing, mode)
          }}
        />
      )}

      {viewing && <InAppView app={viewing} onClose={() => setViewing(null)} />}

      {menuOpen && (
        <Sheet title="Account" onClose={() => setMenuOpen(false)}>
          <div className="account">
            <Avatar src={user.avatar} name={user.username} size={56} />
            <span>
              <strong>{user.username}</strong>
              <small>{user.email}</small>
            </span>
          </div>
          <button
            className="pill pill--muted"
            onClick={() => {
              APPS.forEach((a) => setLaunchPref(user.id, a.id, undefined))
              setMenuOpen(false)
            }}
          >
            Reset “Always open” choices
          </button>
          <button className="pill pill--outline" onClick={signOut}>
            Log out
          </button>
        </Sheet>
      )}
    </main>
  )
}
