import { useMaterials } from './useMaterials'
import styles from './MaterialsPage.module.css'
import type { MaterialEntryWithDetails } from '@/api/types'
import { stripGw2Markup } from '@/utils/gw2Text'

const RARITY_COLORS: Record<string, string> = {
  Junk:        '#AAA9A9',
  Basic:       '#AAA9A9',
  Fine:        '#62A4DA',
  Masterwork:  '#1a9306',
  Rare:        '#fcd00b',
  Exotic:      '#ffa405',
  Ascended:    '#fb3e8d',
  Legendary:   '#4C139D',
}

function groupByCategory(
  materials: MaterialEntryWithDetails[]
): { label: string; items: MaterialEntryWithDetails[] }[] {
  const groups = new Map<string, MaterialEntryWithDetails[]>()

  for (const m of materials) {
    const label = m.category?.name ?? 'Other'
    if (!groups.has(label)) groups.set(label, [])
    groups.get(label)!.push(m)
  }

  return Array.from(groups.entries()).map(([label, items]) => ({ label, items }))
}

function MaterialRow({ m }: { m: MaterialEntryWithDetails }) {
  const rarityColor = RARITY_COLORS[m.item.rarity] ?? '#AAA9A9'

  return (
    <li className={styles.row}>
      <div className={styles.iconWrap}>
        {m.item.icon
          ? <img src={m.item.icon} alt="" className={styles.icon} />
          : <div className={styles.iconFallback} />
        }
      </div>

      <div className={styles.info}>
        <span className={styles.itemName}>{m.item.name}</span>
        {m.item.description && (
          <span className={styles.itemDesc}>{stripGw2Markup(m.item.description)}</span>
        )}
      </div>

      <span
        className={styles.rarity}
        style={{ color: rarityColor }}
      >
        {m.item.rarity}
      </span>

      <span className={styles.count}>{m.entry.count.toLocaleString()}</span>
    </li>
  )
}

export default function MaterialsPage() {
  const { materials, loading, error } = useMaterials()
  const groups = groupByCategory(materials)

  return (
    <div className={styles.page}>
      <h1 className={styles.title}>Materials</h1>

      {loading && (
        <div className={styles.loading}>
          <div className={styles.spinner} />
          <span>Loading materials…</span>
        </div>
      )}

      {error && (
        <div className={styles.errorBlock}>
          <p className={styles.errorText}>{error}</p>
        </div>
      )}

      {!loading && !error && materials.length === 0 && (
        <p className={styles.empty}>No materials found in storage.</p>
      )}

      {!loading && !error && groups.map(({ label, items }) => (
        <section key={label} className={styles.section}>
          <h2 className={styles.categoryLabel}>{label}</h2>
          <ul className={styles.list}>
            {items.map((m) => (
              <MaterialRow key={m.entry.id} m={m} />
            ))}
          </ul>
        </section>
      ))}
    </div>
  )
}
