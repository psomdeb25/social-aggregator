import { useState, type FormEvent } from 'react'
import { useAuth } from '../auth/AuthContext'
import { AuthError, type User } from '../auth/types'
import { Avatar } from '../components/Avatar'
import { BackIcon, GearIcon, HubMark } from '../components/icons'
import { Sheet } from '../components/Sheet'

type View =
  | { kind: 'profile' }
  | { kind: 'password'; profile: User }
  | { kind: 'signin' }
  | { kind: 'signup' }

export function Login() {
  const { profiles } = useAuth()
  const [view, setView] = useState<View>({ kind: 'profile' })
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const profile = profiles.find((p) => p.id === selectedId) ?? profiles[0]
  const back = () => setView({ kind: 'profile' })

  return (
    <main className="login">
      {view.kind === 'profile' && (
        <ProfileView
          profile={profile}
          others={profiles.filter((p) => p !== profile)}
          onSelect={(p) => setSelectedId(p.id)}
          onContinue={() => setView(profile ? { kind: 'password', profile } : { kind: 'signin' })}
          onAnother={() => setView({ kind: 'signin' })}
          onCreate={() => setView({ kind: 'signup' })}
        />
      )}
      {view.kind === 'password' && <SignInForm onBack={back} profile={view.profile} />}
      {view.kind === 'signin' && <SignInForm onBack={back} onCreate={() => setView({ kind: 'signup' })} />}
      {view.kind === 'signup' && <SignUpForm onBack={back} />}
      <Footer />
    </main>
  )
}

function Footer() {
  return (
    <footer className="login__footer">
      <HubMark className="login__mark" />
      <span>Hub</span>
    </footer>
  )
}

function ProfileView({
  profile,
  others,
  onSelect,
  onContinue,
  onAnother,
  onCreate,
}: {
  profile?: User
  others: User[]
  onSelect(p: User): void
  onContinue(): void
  onAnother(): void
  onCreate(): void
}) {
  const { forgetProfile } = useAuth()
  const [settingsOpen, setSettingsOpen] = useState(false)

  return (
    <>
      <div className="login__top">
        <button className="icon-btn" aria-label="Settings" onClick={() => setSettingsOpen(true)}>
          <GearIcon width={24} height={24} />
        </button>
      </div>
      <section className="login__body">
        <Avatar src={profile?.avatar} name={profile?.username} size="var(--avatar-size)" />
        <h1 className="login__name">{profile ? profile.username : 'Welcome'}</h1>
        <div className="login__actions">
          <button className="pill pill--primary" onClick={onContinue} autoFocus>
            Continue
          </button>
          <button className="pill pill--muted" onClick={onAnother}>
            Use another profile
          </button>
        </div>
        <button className="pill pill--outline login__create" onClick={onCreate}>
          Create new account
        </button>
      </section>

      {settingsOpen && (
        <Sheet title="Profiles on this device" onClose={() => setSettingsOpen(false)}>
          {others.length > 0 && (
            <ul className="profile-list">
              {others.map((p) => (
                <li key={p.id}>
                  <button
                    className="profile-list__item"
                    onClick={() => {
                      onSelect(p)
                      setSettingsOpen(false)
                    }}
                  >
                    <Avatar src={p.avatar} name={p.username} size={40} />
                    <span>
                      <strong>{p.username}</strong>
                      <small>{p.email}</small>
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          )}
          {profile ? (
            <button
              className="pill pill--muted"
              onClick={() => {
                forgetProfile(profile.id)
                setSettingsOpen(false)
              }}
            >
              Remove {profile.username} from this device
            </button>
          ) : (
            <p className="sheet__text">No profiles yet. Create an account to get started.</p>
          )}
          <p className="sheet__text sheet__text--small">
            Accounts in v1 are stored only in this browser, with passwords salted and hashed.
          </p>
        </Sheet>
      )}
    </>
  )
}

function useSubmit(action: () => Promise<void>) {
  const [error, setError] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)
  const onSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setBusy(true)
    setError(null)
    try {
      await action()
    } catch (err) {
      setError(err instanceof AuthError ? err.message : 'Something went wrong. Please try again.')
      setBusy(false)
    }
  }
  return { error, busy, onSubmit }
}

function FormHeader({ title, onBack }: { title: string; onBack(): void }) {
  return (
    <div className="login__top login__top--form">
      <button className="icon-btn" aria-label="Back" onClick={onBack}>
        <BackIcon width={24} height={24} />
      </button>
      <h1 className="login__title">{title}</h1>
    </div>
  )
}

function SignInForm({ profile, onBack, onCreate }: { profile?: User; onBack(): void; onCreate?(): void }) {
  const { signIn } = useAuth()
  const [email, setEmail] = useState(profile?.email ?? '')
  const [password, setPassword] = useState('')
  const { error, busy, onSubmit } = useSubmit(() => signIn(email, password))

  return (
    <>
      <FormHeader title={profile ? 'Enter your password' : 'Log in'} onBack={onBack} />
      <form className="login__body login__form" onSubmit={onSubmit}>
        {profile && (
          <div className="login__who">
            <Avatar src={profile.avatar} name={profile.username} size={72} />
            <strong>{profile.username}</strong>
          </div>
        )}
        {!profile && (
          <label className="field">
            <span>Email</span>
            <input type="email" autoComplete="email" required value={email} onChange={(e) => setEmail(e.target.value)} autoFocus />
          </label>
        )}
        <label className="field">
          <span>Password</span>
          <input
            type="password"
            autoComplete="current-password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoFocus={!!profile}
          />
        </label>
        {error && <p className="form-error" role="alert">{error}</p>}
        <button className="pill pill--primary" disabled={busy}>
          {busy ? 'Logging in…' : 'Log in'}
        </button>
        {onCreate && (
          <button type="button" className="pill pill--outline" onClick={onCreate}>
            Create new account
          </button>
        )}
      </form>
    </>
  )
}

async function resizeImage(file: File, size = 256): Promise<string> {
  const bitmap = await createImageBitmap(file)
  const side = Math.min(bitmap.width, bitmap.height)
  const canvas = document.createElement('canvas')
  canvas.width = canvas.height = size
  canvas
    .getContext('2d')!
    .drawImage(bitmap, (bitmap.width - side) / 2, (bitmap.height - side) / 2, side, side, 0, 0, size, size)
  return canvas.toDataURL('image/jpeg', 0.85)
}

function SignUpForm({ onBack }: { onBack(): void }) {
  const { signUp } = useAuth()
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [avatar, setAvatar] = useState<string>()
  const { error, busy, onSubmit } = useSubmit(async () => {
    if (password.length < 8) throw new AuthError('Use at least 8 characters for your password.')
    await signUp({ username, email, password, avatar })
  })

  return (
    <>
      <FormHeader title="Create account" onBack={onBack} />
      <form className="login__body login__form" onSubmit={onSubmit}>
        <label className="avatar-picker">
          <Avatar src={avatar} name={username} size={96} />
          <span>{avatar ? 'Change photo' : 'Add photo'}</span>
          <input
            type="file"
            accept="image/*"
            onChange={async (e) => {
              const file = e.target.files?.[0]
              if (file) setAvatar(await resizeImage(file))
            }}
          />
        </label>
        <label className="field">
          <span>Username</span>
          <input
            autoComplete="username"
            required
            maxLength={30}
            placeholder="curious.seeker"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            autoFocus
          />
        </label>
        <label className="field">
          <span>Email</span>
          <input type="email" autoComplete="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
        </label>
        <label className="field">
          <span>Password</span>
          <input
            type="password"
            autoComplete="new-password"
            required
            minLength={8}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </label>
        {error && <p className="form-error" role="alert">{error}</p>}
        <button className="pill pill--primary" disabled={busy}>
          {busy ? 'Creating…' : 'Create account'}
        </button>
      </form>
    </>
  )
}
