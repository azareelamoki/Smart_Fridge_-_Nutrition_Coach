import type { ReactNode } from 'react'
import { Bullet } from './Feedback'
import { Logo } from './Logo'
import { ProgressRing } from './ui/ProgressRing'

export function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-ink-950 lg:grid lg:grid-cols-[57fr_43fr]">
      <section className="relative hidden overflow-hidden bg-ink-900 lg:block">
        <div aria-hidden className="absolute inset-0 bg-brand-500 [clip-path:polygon(0_0,100%_0,100%_25%,0_34.5%)]" />

        <div className="relative mx-auto flex min-h-screen max-w-xl flex-col justify-center px-10 py-16 xl:max-w-2xl xl:pl-16">
          <Logo size="lg" className="self-start" />
          <p className="mt-10 max-w-lg text-lg leading-relaxed text-mint">
            Votre frigo connecté qui compte les calories de chaque plat selon vos objectifs — sans jamais ouvrir une
            appli de plus.
          </p>

          <div className="relative mt-8 ml-28 w-fit">
            <div className="size-72 overflow-hidden rounded-full border-[9px] border-ink-800 shadow-[0_25px_60px_-10px_rgba(0,0,0,0.7)]">
              <img src="/images/carbonara.jpg" alt="Assiette de spaghetti carbonara" className="size-full scale-110 object-cover" />
            </div>
            <div className="absolute -right-10 bottom-2 flex items-center gap-3 rounded-2xl bg-ink-950/95 py-3 pr-5 pl-3 shadow-xl">
              <ProgressRing value={68} size={42} stroke={4} className="text-white" />
              <div className="leading-tight">
                <p className="font-display text-base font-bold">618 kcal</p>
                <p className="text-xs text-white/70">
                  Carbonara détectée ·<br />
                  objectif du jour
                </p>
              </div>
            </div>
          </div>

          <ul className="mt-10 space-y-3 text-mint">
            <Bullet color="brand">Reconnaissance automatique des plats</Bullet>
            <Bullet color="brand">Suivi calorique selon vos objectifs</Bullet>
            <Bullet color="brand">Alertes de péremption en temps réel</Bullet>
          </ul>
        </div>
      </section>

      <section className="flex min-h-screen items-center px-6 py-12 sm:px-10 lg:px-14">
        <div className="mx-auto w-full max-w-sm lg:mx-0 xl:ml-[12%]">
          <Logo size="sm" className="mb-10 lg:hidden" />
          {children}
        </div>
      </section>
    </div>
  )
}
