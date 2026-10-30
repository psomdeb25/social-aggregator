import { AuthError, type AuthService, type SignUpInput, type User } from './types'

const USERS_KEY = 'agg.users.v1'
const SESSION_KEY = 'agg.session.v1'
const PROFILES_KEY = 'agg.profiles.v1'
const PBKDF2_ITERATIONS = 210_000

interface StoredUser extends User {
  salt: string
  hash: string
}

function read<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key)
    return raw ? (JSON.parse(raw) as T) : fallback
  } catch {
    return fallback
  }
}

function write(key: string, value: unknown) {
  localStorage.setItem(key, JSON.stringify(value))
}

const toB64 = (buf: ArrayBuffer | Uint8Array) =>
  btoa(String.fromCharCode(...new Uint8Array(buf)))
const fromB64 = (s: string) => Uint8Array.from(atob(s), (c) => c.charCodeAt(0))

async function hashPassword(password: string, salt: Uint8Array): Promise<string> {
  const key = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(password),
    'PBKDF2',
    false,
    ['deriveBits'],
  )
  const bits = await crypto.subtle.deriveBits(
    { name: 'PBKDF2', hash: 'SHA-256', salt: salt as BufferSource, iterations: PBKDF2_ITERATIONS },
    key,
    256,
  )
  return toB64(bits)
}

const normalizeEmail = (email: string) => email.trim().toLowerCase()

function publicUser({ salt: _salt, hash: _hash, ...user }: StoredUser): User {
  return user
}

function rememberProfile(id: string) {
  const ids = read<string[]>(PROFILES_KEY, []).filter((x) => x !== id)
  write(PROFILES_KEY, [id, ...ids])
}

/**
 * Device-local accounts: passwords are salted and hashed with PBKDF2-SHA256
 * via Web Crypto and stored in localStorage. Good enough for a single-device
 * v1; swap for a server implementation of `AuthService` to sync accounts.
 */
export class LocalAuthService implements AuthService {
  private users() {
    return read<StoredUser[]>(USERS_KEY, [])
  }

  async currentUser() {
    const id = read<string | null>(SESSION_KEY, null)
    const user = this.users().find((u) => u.id === id)
    return user ? publicUser(user) : null
  }

  async signIn(email: string, password: string) {
    const user = this.users().find((u) => u.email === normalizeEmail(email))
    if (!user || (await hashPassword(password, fromB64(user.salt))) !== user.hash) {
      throw new AuthError('That email and password don’t match an account on this device.')
    }
    write(SESSION_KEY, user.id)
    rememberProfile(user.id)
    return publicUser(user)
  }

  async signUp({ email, username, password, avatar }: SignUpInput) {
    const users = this.users()
    const normalized = normalizeEmail(email)
    if (users.some((u) => u.email === normalized)) {
      throw new AuthError('An account with that email already exists. Try signing in.')
    }
    const salt = crypto.getRandomValues(new Uint8Array(16))
    const user: StoredUser = {
      id: crypto.randomUUID(),
      email: normalized,
      username: username.trim(),
      avatar,
      createdAt: Date.now(),
      salt: toB64(salt),
      hash: await hashPassword(password, salt),
    }
    write(USERS_KEY, [...users, user])
    write(SESSION_KEY, user.id)
    rememberProfile(user.id)
    return publicUser(user)
  }

  async signOut() {
    localStorage.removeItem(SESSION_KEY)
  }

  async knownProfiles() {
    const users = this.users()
    return read<string[]>(PROFILES_KEY, [])
      .map((id) => users.find((u) => u.id === id))
      .filter((u): u is StoredUser => !!u)
      .map(publicUser)
  }

  async forgetProfile(id: string) {
    write(PROFILES_KEY, read<string[]>(PROFILES_KEY, []).filter((x) => x !== id))
  }
}
