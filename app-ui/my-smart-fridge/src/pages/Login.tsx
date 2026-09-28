import { useState, type FormEvent } from 'react'
import { Link, useLocation, useNavigate } from 'react-router'
import { AuthLayout } from '../components/AuthLayout'
import { EyeIcon, EyeOffIcon } from '../components/icons'
import { Button } from '../components/ui/Button'
import { Input } from '../components/ui/Input'
import { useAuth } from '../hooks/useAuth'
import { ApiError } from '../services/api'

export function PasswordToggle({ visible, onToggle }: { visible: boolean; onToggle: () => void }) {
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-label={visible ? 'Masquer le mot de passe' : 'Afficher le mot de passe'}
      className="cursor-pointer rounded p-1 hover:text-white"
    >
      {visible ? <EyeOffIcon className="size-5" /> : <EyeIcon className="size-5" />}
    </button>
  )
}

export function OrDivider() {
  return (
    <div className="my-7 flex items-center gap-3 text-xs text-leaf-400/80">
      <span className="h-px flex-1 bg-ink-600" />
      ou
      <span className="h-px flex-1 bg-ink-600" />
    </div>
  )
}

export default function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const from = (location.state as { from?: string } | null)?.from ?? '/decouvrir'

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [remember, setRemember] = useState(true)
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [info, setInfo] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (!username.trim() || !password) {
      setError("Renseignez votre nom d'utilisateur et votre mot de passe.")
      return
    }
    setError(null)
    setLoading(true)
    try {
      await login(username.trim(), password, remember)
      navigate(from, { replace: true })
    } catch (err) {
      setError(
        err instanceof ApiError && err.status === 401
          ? "Nom d'utilisateur ou mot de passe incorrect."
          : err instanceof Error
            ? err.message
            : 'Connexion impossible.',
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthLayout>
      <p className="text-xs font-semibold tracking-[0.12em] text-leaf-400 uppercase">Bienvenue</p>
      <h1 className="mt-2 font-display text-4xl font-bold">Connexion</h1>
      <p className="mt-3 leading-relaxed text-mint/90">
        Accédez à votre frigo connecté et à votre suivi nutritionnel.
      </p>

      <form onSubmit={handleSubmit} className="mt-9 space-y-5" noValidate>
        <Input
          label="Nom d'utilisateur"
          autoComplete="username"
          autoCapitalize="none"
          spellCheck={false}
          placeholder="votre_pseudo"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <Input
          label="Mot de passe"
          type={showPassword ? 'text' : 'password'}
          autoComplete="current-password"
          placeholder="••••••••••"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          trailing={<PasswordToggle visible={showPassword} onToggle={() => setShowPassword((v) => !v)} />}
        />

        <div className="flex items-center justify-between gap-4 text-sm">
          <label className="flex cursor-pointer items-center gap-2.5 text-white/75">
            <input
              type="checkbox"
              checked={remember}
              onChange={(e) => setRemember(e.target.checked)}
              className="size-4 cursor-pointer rounded accent-brand-400"
            />
            Se souvenir de moi
          </label>
          <button
            type="button"
            onClick={() => setInfo('La réinitialisation du mot de passe arrive bientôt.')}
            className="cursor-pointer text-mint/85 hover:text-white"
          >
            Mot de passe oublié ?
          </button>
        </div>

        {(error || info) && (
          <p role={error ? 'alert' : 'status'} className={`text-sm ${error ? 'text-red-300' : 'text-leaf-300'}`}>
            {error ?? info}
          </p>
        )}

        <Button type="submit" block loading={loading}>
          Se connecter
        </Button>
      </form>

      <OrDivider />

      <Link
        to="/register"
        className="flex h-11 w-full items-center justify-center rounded-xl border border-ink-600 bg-ink-800 text-sm font-semibold transition hover:border-leaf-600 hover:bg-ink-700"
      >
        Créer un compte
      </Link>
    </AuthLayout>
  )
}
