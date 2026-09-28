import type { ReactNode } from 'react'
import { Button } from './ui/Button'

export function ErrorBanner({ message, onRetry }: { message: string; onRetry?: () => void }) {
  return (
    <div
      role="alert"
      className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-red-400/30 bg-red-500/10 px-4 py-3 text-sm text-red-200"
    >
      <span>{message}</span>
      {onRetry && (
        <Button variant="danger" size="sm" onClick={onRetry}>
          Réessayer
        </Button>
      )}
    </div>
  )
}

export function EmptyState({ title, children, action }: { title: string; children?: ReactNode; action?: ReactNode }) {
  return (
    <div className="rounded-2xl border border-dashed border-white/15 px-6 py-12 text-center">
      <p className="font-head text-lg font-bold uppercase">{title}</p>
      {children && <p className="mx-auto mt-2 max-w-md text-sm text-white/60">{children}</p>}
      {action && <div className="mt-5 flex justify-center">{action}</div>}
    </div>
  )
}

export function Bullet({ children, color = 'leaf' }: { children: ReactNode; color?: 'leaf' | 'brand' }) {
  return (
    <li className="flex items-start gap-2.5">
      <span className={`mt-[0.55em] size-2 shrink-0 rounded-full ${color === 'leaf' ? 'bg-leaf-400' : 'bg-brand-500'}`} />
      {children}
    </li>
  )
}
