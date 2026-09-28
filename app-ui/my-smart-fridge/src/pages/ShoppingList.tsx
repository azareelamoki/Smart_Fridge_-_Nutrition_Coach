import { useState, type FormEvent } from 'react'
import { Bullet, EmptyState } from '../components/Feedback'
import { CheckIcon, PlusIcon, TrashIcon } from '../components/icons'
import { toIngredient } from '../data/ingredients'
import { useUserData } from '../hooks/useAuth'

export default function ShoppingList() {
  const { shopping, addToShopping, toggleShopping, removeShopping, clearShoppingDone, addToFridge } = useUserData()
  const [text, setText] = useState('')
  const done = shopping.filter((i) => i.done)

  function handleAdd(e: FormEvent) {
    e.preventDefault()
    addToShopping(text.split(','))
    setText('')
  }

  function storeInFridge() {
    done.forEach((i) => addToFridge(toIngredient(i.label)))
    clearShoppingDone()
  }

  return (
    <>
      <h1 className="font-head text-3xl leading-[1.12] font-bold uppercase sm:text-[2.2rem]">Liste de courses</h1>
      <ul className="mt-4 text-lg text-white/85">
        <Bullet>Cochez vos achats puis rangez-les dans votre frigo</Bullet>
      </ul>

      <div className="mx-auto mt-7 max-w-2xl">
        <form onSubmit={handleAdd} className="flex gap-3">
          <label htmlFor="shopping-input" className="sr-only">
            Ajouter un article
          </label>
          <input
            id="shopping-input"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Ajoutez un article (p. ex., lait, carottes…)"
            className="h-12 min-w-0 flex-1 rounded-xl border border-brand-500 bg-transparent px-4 text-white outline-none placeholder:text-white/60 focus:ring-2 focus:ring-brand-400/40"
          />
          <button
            type="submit"
            disabled={!text.trim()}
            aria-label="Ajouter"
            className="grid size-12 shrink-0 cursor-pointer place-items-center rounded-xl bg-brand-500 text-ink-950 hover:bg-brand-400 disabled:opacity-50"
          >
            <PlusIcon className="size-5" strokeWidth={2.6} />
          </button>
        </form>

        <div className="mt-7">
          {shopping.length === 0 ? (
            <EmptyState title="Rien à acheter">
              Ajoutez des articles ici, ou depuis la fiche d'un plat pour récupérer les ingrédients manquants.
            </EmptyState>
          ) : (
            <ul className="space-y-2.5">
              {shopping.map((item) => (
                <li
                  key={item.id}
                  className="group flex items-center gap-3 rounded-full bg-paper py-1.5 pr-2 pl-2 text-ink-950 shadow-[0_2px_0_rgba(0,0,0,0.35)]"
                >
                  <button
                    type="button"
                    onClick={() => toggleShopping(item.id)}
                    aria-pressed={item.done}
                    aria-label={item.done ? `Décocher ${item.label}` : `Cocher ${item.label}`}
                    className={`grid size-7 shrink-0 cursor-pointer place-items-center rounded-full border-2 transition ${
                      item.done ? 'border-leaf-500 bg-leaf-500 text-white' : 'border-ink-950/30 hover:border-leaf-500'
                    }`}
                  >
                    {item.done && <CheckIcon className="size-4" strokeWidth={3} />}
                  </button>
                  <span className={`flex-1 truncate font-medium ${item.done ? 'text-ink-950/45 line-through' : ''}`}>
                    {item.label}
                  </span>
                  <button
                    type="button"
                    onClick={() => removeShopping(item.id)}
                    aria-label={`Supprimer ${item.label}`}
                    className="grid size-8 cursor-pointer place-items-center rounded-full text-ink-950/40 hover:bg-ink-950/10 hover:text-red-600"
                  >
                    <TrashIcon className="size-4" />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        {done.length > 0 && (
          <div className="mt-7 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={storeInFridge}
              className="h-12 flex-1 cursor-pointer rounded-xl bg-brand-500 font-head text-sm font-bold tracking-wide text-ink-950 uppercase hover:bg-brand-400"
            >
              Ranger {done.length} article{done.length > 1 ? 's' : ''} dans le frigo
            </button>
            <button
              type="button"
              onClick={clearShoppingDone}
              className="h-12 cursor-pointer rounded-xl border border-ink-600 bg-ink-800 px-5 text-sm font-semibold hover:bg-ink-700"
            >
              Supprimer les articles cochés
            </button>
          </div>
        )}
      </div>
    </>
  )
}
