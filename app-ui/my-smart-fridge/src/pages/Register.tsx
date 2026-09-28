import { useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router'
import { AuthLayout } from '../components/AuthLayout'
import { Button } from '../components/ui/Button'
import { Input } from '../components/ui/Input'
import { useAuth } from '../hooks/useAuth'
import { ApiError } from '../services/api'
import { OrDivider, PasswordToggle } from './Login'

const USERNAME_RE = /^\S{3,30}$/

export default function Register() {
  const { register } = useAuth()
  const navigate = useNavigate()

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [touched, setTouched] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const errors = {
    username: USERNAME_RE.test(username.trim())
      ? null
      : '3 à 30 caractères, sans espace.',
    password: password.length >= 8 ? null : '8 caractères minimum.',
    confirm: confirm === password ? null : 'Les mots de passe ne correspondent pas.',
  }
  const valid = Object.values(errors).every((e) => e === null)

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setTouched(true)
    if (!valid) return
    setError(null)
    setLoading(true)
    try {
      await register(username.trim(), password)
      navigate('/programme', { replace: true })
    } catch (err) {
      setError(
        err instanceof ApiError && err.status >= 500
          ? "Inscription impossible : ce nom d'utilisateur est peut-être déjà pris."
          : err instanceof Error
            ? err.message
            : 'Inscription impossible.',
      )
    } finally {
      setLoading(false)
    }
  }

  const show = (msg: string | null) => (touched ? msg : null)

  return (
    <AuthLayout>
      <p className="text-xs font-semibold tracking-[0.12em] text-leaf-400 uppercase">Nouveau compte</p>
      <h1 className="mt-2 font-display text-4xl font-bold">Inscription</h1>
      <p className="mt-3 leading-relaxed text-mint/90">
        Créez votre compte pour configurer votre programme alimentaire personnalisé.
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
          error={show(errors.username)}
        />
        <Input
          label="Mot de passe"
          type={showPassword ? 'text' : 'password'}
          autoComplete="new-password"
          placeholder="••••••••••"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          error={show(errors.password)}
          hint="8 caractères minimum."
          trailing={<PasswordToggle visible={showPassword} onToggle={() => setShowPassword((v) => !v)} />}
        />
        <Input
          label="Confirmer le mot de passe"
          type={showPassword ? 'text' : 'password'}
          autoComplete="new-password"
          placeholder="••••••••••"
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
          error={show(errors.confirm)}
        />

        {error && (
          <p role="alert" className="text-sm text-red-300">
            {error}
          </p>
        )}

        <Button type="submit" block loading={loading}>
          Créer mon compte
        </Button>
      </form>

      <OrDivider />

      <Link
        to="/login"
        className="flex h-11 w-full items-center justify-center rounded-xl border border-ink-600 bg-ink-800 text-sm font-semibold transition hover:border-leaf-600 hover:bg-ink-700"
      >
        J'ai déjà un compte
      </Link>
    </AuthLayout>
  )
}
