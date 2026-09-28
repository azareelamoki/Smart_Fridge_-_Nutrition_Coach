import { Link } from 'react-router'
import { ErrorBanner } from '../components/Feedback'
import { MacroProgress } from '../components/MacroProgress'
import { MACRO_ROWS, toIntake } from '../utils/macros'
import { Card } from '../components/ui/Card'
import { ProgressRing } from '../components/ui/ProgressRing'
import { useAuth, useUserData } from '../hooks/useAuth'
import { useFetch } from '../hooks/useFetch'
import { api } from '../services/api'
import { ACTIVITY_LABELS, GOAL_LABELS } from '../types/User'
import { fmt, percent } from '../utils/format'
import { todayKey } from '../utils/storage'

function Stat({ label, value, unit }: { label: string; value: number | undefined; unit: string }) {
  return (
    <div className="rounded-xl bg-paper px-4 py-3 text-ink-950">
      <p className="text-xs text-ink-950/65">{label}</p>
      <p className="mt-0.5 text-xl font-bold">
        {fmt(value)} <span className="text-sm font-semibold text-ink-950/60">{unit}</span>
      </p>
    </div>
  )
}

export default function Account() {
  const { session } = useAuth()
  const { stored, history } = useUserData()
  const profile = stored?.profile
  const plan = stored?.plan

  const consumed = history
    .filter((m) => m.eatenAt && todayKey(new Date(m.eatenAt)) === todayKey())
    .map(toIntake)

  const statusKey = profile ? `status:${JSON.stringify([profile, consumed])}` : null
  const { data: status, error, reload } = useFetch(statusKey, () => api.nutritionStatus(profile!, consumed))

  if (!profile) return null

  return (
    <>
      <h1 className="font-serif text-3xl leading-tight font-bold sm:text-[2.1rem]">
        Mon compte,
        <br />
        {session?.username}.
      </h1>

      <div className="mt-8 grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
        <section className="rounded-2xl border border-white/10 bg-ink-850 p-6">
          <div className="flex items-center justify-between gap-4">
            <h2 className="font-head text-sm font-extrabold tracking-wide uppercase">Mon programme</h2>
            <Link to="/programme" className="text-sm font-semibold text-brand-300 hover:text-brand-400">
              Modifier
            </Link>
          </div>
          <dl className="mt-5 grid grid-cols-2 gap-x-6 gap-y-4 text-sm">
            {[
              ['Poids', `${profile.weight_kg} kg`],
              ['Taille', `${(profile.height_cm / 100).toFixed(2).replace('.', ',')} m`],
              ['Âge', `${profile.age} ans`],
              ['Genre', profile.gender],
              ['Activité', ACTIVITY_LABELS[profile.activity_level]],
              ['Repas par jour', String(stored.mealsPerDay)],
            ].map(([label, value]) => (
              <div key={label}>
                <dt className="font-head text-[0.7rem] font-bold tracking-wide text-white/50 uppercase">{label}</dt>
                <dd className="mt-0.5 font-semibold">{value}</dd>
              </div>
            ))}
          </dl>
          <div className="mt-5 rounded-xl bg-mint px-4 py-3 text-ink-950">
            <p className="text-xs font-semibold tracking-wide uppercase opacity-70">Objectif</p>
            <p className="font-display text-lg font-bold">{GOAL_LABELS[profile.goal]}</p>
          </div>
        </section>

        <section className="rounded-2xl border border-white/10 bg-ink-850 p-6">
          <h2 className="font-head text-sm font-extrabold tracking-wide uppercase">Mes besoins</h2>
          <div className="mt-5 grid grid-cols-2 gap-3">
            <Stat label="Métabolisme de base" value={plan?.bmr ?? status?.bmr} unit="kcal" />
            <Stat label="Dépense journalière" value={plan?.tdee ?? status?.tdee} unit="kcal" />
          </div>
          {plan && (
            <div className="mt-5 overflow-hidden rounded-xl border border-white/10">
              <table className="w-full text-sm">
                <thead className="bg-white/5 text-left text-xs text-white/55">
                  <tr>
                    <th className="px-4 py-2 font-semibold">Cible</th>
                    <th className="px-4 py-2 text-right font-semibold">Par jour</th>
                    <th className="px-4 py-2 text-right font-semibold">Par repas</th>
                  </tr>
                </thead>
                <tbody>
                  {MACRO_ROWS.map(({ key, label, unit }) => (
                    <tr key={key} className="border-t border-white/5">
                      <td className="px-4 py-2">{label}</td>
                      <td className="px-4 py-2 text-right font-semibold">
                        {fmt(plan.daily_targets[key])} {unit}
                      </td>
                      <td className="px-4 py-2 text-right text-white/70">
                        {fmt(plan.per_meal_targets[key])} {unit}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>

      <Card tone="panel" className="mt-6 p-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="font-head text-sm font-extrabold tracking-wide uppercase">Suivi du jour</h2>
            <p className="mt-1 text-xs text-white/50">
              {consumed.length} plat{consumed.length > 1 ? 's' : ''} mangé{consumed.length > 1 ? 's' : ''} aujourd'hui
            </p>
          </div>
          {status && (
            <div className="flex items-center gap-3">
              <ProgressRing value={percent(status.consumed.calories, status.targets.calories)} size={56} stroke={5} />
              <div className="text-sm leading-tight">
                <p className="font-bold">{fmt(Math.max(0, status.remaining.calories))} kcal</p>
                <p className="text-white/55">restantes</p>
              </div>
            </div>
          )}
        </div>
        <div className="mt-6">
          {error ? (
            <ErrorBanner message={error} onRetry={reload} />
          ) : status ? (
            <MacroProgress value={status.consumed} target={status.targets} />
          ) : (
            <div className="h-40 animate-pulse rounded-xl bg-white/5" />
          )}
        </div>
      </Card>
    </>
  )
}
