export interface User {
  id: string
  email: string
  username: string
  /** Data URL of a small square avatar, if the user added one. */
  avatar?: string
  createdAt: number
}

export interface SignUpInput {
  email: string
  username: string
  password: string
  avatar?: string
}

/**
 * The auth backend contract. v1 ships `LocalAuthService` (credentials live in
 * this browser only); a server-backed implementation can replace it without
 * touching the UI.
 */
export interface AuthService {
  currentUser(): Promise<User | null>
  signIn(email: string, password: string): Promise<User>
  signUp(input: SignUpInput): Promise<User>
  signOut(): Promise<void>
  /** Profiles that have signed in on this device, most recent first. */
  knownProfiles(): Promise<User[]>
  forgetProfile(id: string): Promise<void>
}

export class AuthError extends Error {}
