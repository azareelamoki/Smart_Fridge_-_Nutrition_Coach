import type { ComponentType, SVGProps } from 'react'
import { NavLink, Outlet, useLocation } from 'react-router'
import { FridgeArt, GroceryBagArt, HistoryArt } from './illustrations'
import { Logo } from './Logo'
import { Navbar } from './Navbar'

interface SideLink {
  to: string
  first: string
  second: string
  Art: ComponentType<SVGProps<SVGSVGElement>>
}

const SIDE_LINKS: SideLink[] = [
  { to: '/concocter', first: 'Contenu', second: 'du Frigo', Art: FridgeArt },
  { to: '/courses', first: 'Liste de', second: 'Courses', Art: GroceryBagArt },
  { to: '/historique', first: 'Historique', second: 'des Plats', Art: HistoryArt },
]

/** Pages où le bandeau orange reste épuré, comme sur la maquette du tableau de bord. */
const PLAIN_SIDEBAR = ['/decouvrir', '/compte', '/mes-plats']

const glow = '[text-shadow:0_0_14px_rgba(63,197,116,0.95),0_2px_2px_rgba(0,0,0,0.25)]'

export function AppLayout() {
  const { pathname } = useLocation()
  const showSideNav = !PLAIN_SIDEBAR.includes(pathname)

  return (
    <div className="min-h-screen bg-ink-900 lg:grid lg:grid-cols-[minmax(220px,26%)_1fr]">
      <aside className="relative bg-brand-500 lg:sticky lg:top-0 lg:h-screen">
        {/* Pan d'ombre diagonal du bandeau */}
        <div
          aria-hidden
          className={`pointer-events-none absolute inset-0 hidden bg-brand-600/70 [clip-path:polygon(0_62%,100%_18%,100%_100%,0_100%)] ${showSideNav ? 'lg:block' : ''}`}
        />
        <div className="relative flex h-full flex-col gap-6 px-5 py-5 lg:px-6">
          <Logo size="sm" className="self-start" />

          {showSideNav && (
            <nav className="scrollbar-none -mx-5 flex gap-3 overflow-x-auto px-5 lg:mx-0 lg:flex-1 lg:flex-col lg:justify-around lg:overflow-visible lg:px-0 lg:py-4">
              {SIDE_LINKS.map(({ to, first, second, Art }) => (
                <NavLink
                  key={to}
                  to={to}
                  className={({ isActive }) =>
                    `group relative flex shrink-0 items-center gap-3 rounded-2xl px-3 py-2 transition lg:flex-col lg:gap-2 lg:py-3 ${
                      isActive ? 'bg-brand-600/60 lg:bg-transparent' : 'hover:bg-brand-600/40'
                    }`
                  }
                >
                  {({ isActive }) => (
                    <>
                      <Art className="size-12 drop-shadow-[0_6px_6px_rgba(0,0,0,0.25)] transition group-hover:scale-105 lg:size-28 xl:size-32" />
                      <span
                        className={`font-display text-base leading-tight font-bold text-white lg:text-center lg:text-2xl ${glow}`}
                      >
                        {first}
                        <br className="hidden lg:block" /> {second}
                      </span>
                      {isActive && (
                        <span
                          aria-hidden
                          className="absolute top-1/2 -right-12 z-10 hidden h-16 w-6 -translate-y-1/2 bg-brand-500 [clip-path:polygon(0_0,100%_50%,0_100%)] lg:block"
                        />
                      )}
                    </>
                  )}
                </NavLink>
              ))}
            </nav>
          )}
        </div>
      </aside>

      <div className="min-w-0 overflow-x-clip px-5 py-5 sm:px-8 lg:px-10 xl:px-14">
        <Navbar />
        <main className="mx-auto max-w-5xl pt-8 pb-16">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
