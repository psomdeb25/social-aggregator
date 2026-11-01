import { AuthProvider, useAuth } from './auth/AuthContext'
import { SquircleDefs } from './components/Squircle'
import { Home } from './screens/Home'
import { Login } from './screens/Login'

function Screens() {
  const { user, ready } = useAuth()
  if (!ready) return null
  return user ? <Home /> : <Login />
}

export default function App() {
  return (
    <AuthProvider>
      <SquircleDefs />
      <Screens />
    </AuthProvider>
  )
}
