import { useState, type FormEvent, type ReactNode } from 'react'
import { useNavigate } from 'react-router'
import { Bullet } from '../components/Feedback'
import { AgeIcon, HeightIcon, WeightIcon } from '../components/icons'
import { Logo } from '../components/Logo'
import { Button } from '../components/ui/Button'
import { Input } from '../components/ui/Input'
import { Select } from '../components/ui/Select'
import { useAuth, useUserData } from '../hooks/useAuth'
import { api } from '../services/api'
import {
  ACTIVITY_LABELS,
  GOAL_LABELS,
  type ActivityLevel,
  type Gender,
  type Goal,
  type UserProfile,
} from '../types/User'

const Label = ({ main, sub }: { main: string; sub?: string }) => (
  <>
    {main}
    {sub && <span className="ml-1 font-sans font-normal normal-case tracking-normal text-white/85">({sub})</span>}
  </>
)

const toOptions = (labels: Record<string, string>) =>
  Object.entries(labels).map(([value, label]) => ({ value, label }))

const parseNumber = (text: string) => Number(text.replace(',', '.').replace(/[^\d.]/g, ''))

function Field({ children }: { children: ReactNode }) {
  return <div className="min-w-0">{children}</div>
}

export default function ProgramSetup() {
  const { logout } = useAuth()
  const { stored, saveProfile } = useUserData()
  const navigate = useNavigate()
  const initial = stored?.profile

  const [weight, setWeight] = useState(initial ? String(initial.weight_kg) : '')
  const [age, setAge] = useState(initial ? String(initial.age) : '')
  const [height, setHeight] = useState(initial ? (initial.height_cm / 100).toFixed(2) : '')
  const [activity, setActivity] = useState<ActivityLevel>(initial?.activity_level ?? 'modere')
  const [gender, setGender] = useState<Gender>(initial?.gender ?? 'Homme')
  const [goal, setGoal] = useState<Goal>(initial?.goal ?? 'Maintien')
  const [mealsPerDay, setMealsPerDay] = useState(stored?.mealsPerDay ?? 3)
  const [touched, setTouched] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const weightKg = parseNumber(weight)
  const ageYears = parseNumber(age)
  const rawHeight = parseNumber(height)
  // On accepte « 1,80 » (mètres) comme « 180 » (centimètres).
  const heightCm = Math.round(rawHeight > 0 && rawHeight < 3 ? rawHeight * 100 : rawHeight)

  const errors = {
    weight: weightKg > 20 && weightKg < 300 ? null : 'Entre 20 et 300 kg',
    age: Number.isInteger(ageYears) && ageYears > 10 && ageYears < 120 ? null : 'Entre 11 et 119 ans',
    height: heightCm > 100 && heightCm < 250 ? null : 'Ex. 1,80 m',
  }
  const show = (msg: string | null) => (touched ? msg : null)

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setTouched(true)
    if (Object.values(errors).some(Boolean)) return

    const profile: UserProfile = {
      weight_kg: Math.round(weightKg),
      height_cm: heightCm,
      age: ageYears,
      gender,
      activity_level: activity,
      goal,
    }
    setError(null)
    setLoading(true)
    try {
      const plan = await api.mealPlan(profile, mealsPerDay)
      saveProfile({ profile, mealsPerDay, plan })
      navigate(initial ? '/compte' : '/decouvrir')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Impossible de créer le programme.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-ink-900 lg:bg-brand-500">
      <div
        aria-hidden
        className="absolute inset-0 hidden bg-ink-900 [clip-path:polygon(50%_0,100%_0,100%_100%,40%_100%)] lg:block"
      />

      <div className="relative mx-auto grid min-h-screen max-w-7xl lg:grid-cols-2">
        {/* Colonne orange */}
        <section className="flex flex-col bg-brand-500 px-6 py-8 sm:px-12 lg:bg-transparent lg:py-12">
          <Logo size="md" className="self-start" />

          <div className="mx-auto mt-10 hidden w-[82%] -rotate-3 overflow-hidden rounded-[2rem] shadow-[0_20px_45px_-12px_rgba(0,0,0,0.55)] [clip-path:polygon(9%_0,100%_0,91%_100%,0_100%)] lg:block">
            <img
              src="/images/eggs-benedict.jpg"
              alt="Oeuf poché sur toast"
              className="aspect-[16/10] w-full scale-110 object-cover"
            />
          </div>

          <h2 className="mt-8 max-w-sm font-head text-2xl leading-[1.1] font-black text-ink-950 uppercase xl:text-[1.8rem] lg:mt-auto">
            Configurez votre parcours nutritionnel
          </h2>
          <ul className="mt-5 space-y-1.5 text-sm text-ink-950">
            <Bullet>Définissez vos objectifs</Bullet>
            <Bullet>Suivez votre progrès</Bullet>
            <Bullet>Obtenez des recommandations personnalisées</Bullet>
          </ul>
        </section>

        {/* Formulaire */}
        <section className="flex items-center px-6 py-12 sm:px-12 lg:pl-[16%]">
          <form onSubmit={handleSubmit} noValidate className="w-full max-w-md">
            <p className="font-head text-xs font-bold tracking-wide text-leaf-400 uppercase">Votre programme</p>
            <h1 className="mt-3 font-head text-2xl leading-[1.12] font-extrabold text-white uppercase sm:text-[1.7rem]">
              Remplissez le formulaire pour une bonne création de votre programme alimentaire
            </h1>

            <div className="mt-7 grid grid-cols-2 gap-x-5 gap-y-5">
              <Field>
                <Input
                  tone="compact"
                  label={<Label main="Poids" />}
                  inputMode="decimal"
                  placeholder="75 kg"
                  value={weight}
                  onChange={(e) => setWeight(e.target.value)}
                  error={show(errors.weight)}
                  trailing={<WeightIcon className="size-4.5" />}
                />
              </Field>
              <Field>
                <Input
                  tone="compact"
                  label={<Label main="Âge" />}
                  inputMode="numeric"
                  placeholder="34"
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                  error={show(errors.age)}
                  trailing={<AgeIcon className="size-4.5" />}
                />
              </Field>
              <Field>
                <Select
                  label={<Label main="Activité" sub="Niveau" />}
                  value={activity}
                  onChange={(e) => setActivity(e.target.value as ActivityLevel)}
                  options={toOptions(ACTIVITY_LABELS)}
                />
              </Field>
              <Field>
                <Input
                  tone="compact"
                  label={<Label main="Taille" />}
                  inputMode="decimal"
                  placeholder="1,80 m"
                  value={height}
                  onChange={(e) => setHeight(e.target.value)}
                  error={show(errors.height)}
                  trailing={<HeightIcon className="size-4.5" />}
                />
              </Field>
              <Field>
                <Select
                  label={<Label main="Genre" sub="Sexe" />}
                  value={gender}
                  onChange={(e) => setGender(e.target.value as Gender)}
                  options={[
                    { value: 'Homme', label: 'Homme' },
                    { value: 'Femme', label: 'Femme' },
                  ]}
                />
              </Field>
              <Field>
                <Select
                  label={<Label main="Repas" sub="par jour" />}
                  value={String(mealsPerDay)}
                  onChange={(e) => setMealsPerDay(Number(e.target.value))}
                  options={[1, 2, 3, 4, 5, 6].map((n) => ({ value: String(n), label: `${n} repas` }))}
                />
              </Field>
            </div>

            <Select
              className="mt-5"
              label={<Label main="Goal / Objectif" sub="Votre objectif principal" />}
              value={goal}
              onChange={(e) => setGoal(e.target.value as Goal)}
              options={toOptions(GOAL_LABELS)}
            />

            {error && (
              <p role="alert" className="mt-5 text-sm text-red-300">
                {error}
              </p>
            )}

            <Button type="submit" block loading={loading} className="mt-7 bg-brand-500 hover:bg-brand-400">
              {initial ? 'Mettre à jour mon programme' : 'Créer mon programme'}
            </Button>

            <div className="mt-4 flex items-center justify-center gap-6 text-sm">
              {initial && (
                <button type="button" onClick={() => navigate(-1)} className="cursor-pointer text-white/70 hover:text-white">
                  Annuler
                </button>
              )}
              <button type="button" onClick={logout} className="cursor-pointer text-white hover:text-brand-300">
                Se déconnecter ?
              </button>
            </div>
          </form>
        </section>
      </div>
    </div>
  )
}
