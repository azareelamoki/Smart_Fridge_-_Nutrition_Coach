import { AuthProvider } from './context/AuthContext'
import { UserDataProvider } from './context/UserDataContext'
import { AppRouter } from './router/AppRouter'

function App() {
  return (
    <AuthProvider>
      <UserDataProvider>
        <AppRouter />
      </UserDataProvider>
    </AuthProvider>
  )
}

export default App
