import { useEffect, useRef, useState } from 'react'
import { Link, NavLink } from 'react-router'
import { useAuth, useUserData } from '../hooks/useAuth'
import { UserIcon } from './icons'

const LINKS = [
  { to: '/compte', label: 'Mon compte' },
  { to: '/decouvrir', label: 'Découvrir' },
  { to: '/mes-plats', label: 'Mes plats' },
  { to: '/concocter', label: 'Concocter un plat' },
]

export function Navbar() {
  const { session, logout } = useAuth()
  const { menu } = useUserData()
  const [open, setOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    const close = (e: MouseEvent | KeyboardEvent) => {
      if (e instanceof KeyboardEvent ? e.key === 'Escape' : !menuRef.current?.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', close)
    document.addEventListener('keydown', close)
    return () => {
      document.removeEventListener('mousedown', close)
      document.removeEventListener('keydown', close)
    }
  }, [open])

  return (
    <header className="flex items-center gap-4">
      <nav className="scrollbar-none -mx-1 flex min-w-0 flex-1 items-center gap-6 overflow-x-auto px-1 lg:gap-9">
        {LINKS.map(({ to, label }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `relative shrink-0 py-2 font-head text-[0.8rem] font-extrabold tracking-wide uppercase transition-colors ${
                isActive ? 'text-brand-400' : 'text-white hover:text-brand-300'
              }`
            }
          >
            {label}
            {to === '/mes-plats' && menu.length > 0 && (
              <span className="ml-1.5 inline-grid min-w-5 place-items-center rounded-full bg-leaf-500 px-1 text-[0.65rem] text-ink-950">
                {menu.length}
              </span>
            )}
          </NavLink>
        ))}
      </nav>

      <div className="relative" ref={menuRef}>
        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          aria-haspopup="menu"
          aria-expanded={open}
          aria-label="Menu du compte"
          className="grid size-10 cursor-pointer place-items-center rounded-full text-white transition hover:text-brand-300 focus-visible:outline-2 focus-visible:outline-brand-300"
        >
          <UserIcon className="size-8" />
        </button>
        {open && (
          <div
            role="menu"
            className="absolute right-0 z-30 mt-2 w-60 overflow-hidden rounded-xl border border-white/10 bg-ink-850 py-2 shadow-2xl"
          >
            <div className="border-b border-white/10 px-4 pt-1 pb-3">
              <p className="text-xs text-white/50">Connecté en tant que</p>
              <p className="truncate font-semibold">{session?.username}</p>
            </div>
            {[
              { to: '/compte', label: 'Mon compte' },
              { to: '/programme', label: 'Modifier mon programme' },
              { to: '/courses', label: 'Liste de courses' },
              { to: '/historique', label: 'Historique des plats' },
            ].map((item) => (
              <Link
                key={item.to}
                to={item.to}
                role="menuitem"
                onClick={() => setOpen(false)}
                className="block px-4 py-2 text-sm text-white/85 hover:bg-white/5 hover:text-white"
              >
                {item.label}
              </Link>
            ))}
            <button
              type="button"
              role="menuitem"
              onClick={logout}
              className="mt-1 block w-full cursor-pointer border-t border-white/10 px-4 pt-3 pb-1 text-left text-sm text-brand-300 hover:text-brand-400"
            >
              Se déconnecter
            </button>
          </div>
        )}
      </div>
    </header>
  )
}
