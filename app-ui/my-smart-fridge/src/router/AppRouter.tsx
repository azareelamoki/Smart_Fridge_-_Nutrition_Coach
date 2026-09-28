import { BrowserRouter, Navigate, Outlet, Route, Routes, useLocation } from 'react-router'
import { AppLayout } from '../components/AppLayout'
import { useAuth, useUserData } from '../hooks/useAuth'
import Account from '../pages/Account'
import DailySuggestions from '../pages/DailySuggestions'
import History from '../pages/History'
import IngredientSearch from '../pages/IngredientSearch'
import Login from '../pages/Login'
import MyMeals from '../pages/MyMeals'
import ProgramSetup from '../pages/ProgramSetup'
import Register from '../pages/Register'
import ShoppingList from '../pages/ShoppingList'

/** Réservé aux utilisateurs connectés. */
function RequireAuth() {
  const { session } = useAuth()
  const location = useLocation()
  if (!session) return <Navigate to="/login" replace state={{ from: location.pathname }} />
  return <Outlet />
}

/** Réservé aux utilisateurs ayant configuré leur programme. */
function RequireProfile() {
  const { stored } = useUserData()
  if (!stored) return <Navigate to="/programme" replace />
  return <Outlet />
}

/** Pages de connexion : inutile d'y rester une fois connecté. */
function GuestOnly() {
  const { session } = useAuth()
  const location = useLocation()
  const from = (location.state as { from?: string } | null)?.from
  if (session) return <Navigate to={from ?? '/decouvrir'} replace />
  return <Outlet />
}

export function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<GuestOnly />}>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Route>

        <Route element={<RequireAuth />}>
          <Route path="/programme" element={<ProgramSetup />} />
          <Route element={<RequireProfile />}>
            <Route element={<AppLayout />}>
              <Route path="/decouvrir" element={<DailySuggestions />} />
              <Route path="/concocter" element={<IngredientSearch />} />
              <Route path="/mes-plats" element={<MyMeals />} />
              <Route path="/compte" element={<Account />} />
              <Route path="/courses" element={<ShoppingList />} />
              <Route path="/historique" element={<History />} />
            </Route>
          </Route>
        </Route>

        <Route path="*" element={<Navigate to="/decouvrir" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
