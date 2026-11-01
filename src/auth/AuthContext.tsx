import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import { LocalAuthService } from './localAuth'
import type { AuthService, SignUpInput, User } from './types'

interface AuthState {
  user: User | null
  ready: boolean
  profiles: User[]
  signIn(email: string, password: string): Promise<void>
  signUp(input: SignUpInput): Promise<void>
  signOut(): Promise<void>
  forgetProfile(id: string): Promise<void>
}

const defaultService = new LocalAuthService()

const AuthContext = createContext<AuthState | null>(null)

export function AuthProvider({
  service = defaultService,
  children,
}: {
  service?: AuthService
  children: ReactNode
}) {
  const [user, setUser] = useState<User | null>(null)
  const [profiles, setProfiles] = useState<User[]>([])
  const [ready, setReady] = useState(false)

  const refreshProfiles = useCallback(() => service.knownProfiles().then(setProfiles), [service])

  useEffect(() => {
    Promise.all([service.currentUser().then(setUser), refreshProfiles()]).finally(() => setReady(true))
  }, [service, refreshProfiles])

  const value = useMemo<AuthState>(
    () => ({
      user,
      ready,
      profiles,
      async signIn(email, password) {
        setUser(await service.signIn(email, password))
        await refreshProfiles()
      },
      async signUp(input) {
        setUser(await service.signUp(input))
        await refreshProfiles()
      },
      async signOut() {
        await service.signOut()
        setUser(null)
      },
      async forgetProfile(id) {
        await service.forgetProfile(id)
        await refreshProfiles()
      },
    }),
    [user, ready, profiles, service, refreshProfiles],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>')
  return ctx
}
