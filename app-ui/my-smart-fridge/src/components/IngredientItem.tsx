import { MinusCircleIcon, PlusIcon } from './icons'

interface IngredientItemProps {
  label: string
  selected?: boolean
  onClick: () => void
  onDelete?: () => void
}

export function IngredientItem({ label, selected = false, onClick, onDelete }: IngredientItemProps) {
  return (
    <div className="group flex h-9 w-full max-w-60 items-center rounded-full bg-paper text-ink-950 shadow-[0_2px_0_rgba(0,0,0,0.35)]">
      <button
        type="button"
        onClick={onClick}
        aria-label={selected ? `Retirer ${label}` : `Sélectionner ${label}`}
        className="flex h-full flex-1 cursor-pointer items-center justify-between gap-2 rounded-full pr-2 pl-4 text-[0.95rem] font-medium"
      >
        <span className="truncate">{label}</span>
        {selected ? <MinusCircleIcon className="size-5.5 text-ink-950" /> : <PlusIcon className="size-5.5" strokeWidth={2.4} />}
      </button>
      {onDelete && (
        <button
          type="button"
          onClick={onDelete}
          aria-label={`Supprimer ${label} du frigo`}
          title="Retirer du frigo"
          className="mr-1 hidden size-6 cursor-pointer place-items-center rounded-full text-ink-950/40 hover:bg-ink-950/10 hover:text-red-600 group-hover:grid"
        >
          ×
        </button>
      )}
    </div>
  )
}
