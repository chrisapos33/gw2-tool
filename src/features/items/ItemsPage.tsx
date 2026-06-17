import { useAllItems } from './useAllItems'
import { stripGw2Markup } from '@/utils/gw2Text'
import styles from './ItemsPage.module.css'
import type { MergedItem, ItemLocation } from '@/api/types'

const RARITY_COLORS: Record<string, string> = {
  Junk:       '#AAA9A9',
  Basic:      '#AAA9A9',
  Fine:       '#62A4DA',
  Masterwork: '#1a9306',
  Rare:       '#fcd00b',
  Exotic:     '#ffa405',
  Ascended:   '#fb3e8d',
  Legendary:  '#4C139D',
}

const TYPE_LABELS: Record<string, string> = {
  Armor:            'Armor',
  Back:             'Back Item',
  Bag:              'Bag',
  Consumable:       'Consumable',
  Container:        'Container',
  CraftingMaterial: 'Crafting Material',
  Gizmo:            'Gizmo',
  Key:              'Key',
  MiniPet:          'Mini',
  Tool:             'Tool',
  Trait:            'Trait',
  Trophy:           'Trophy',
  UpgradeComponent: 'Upgrade',
  Weapon:           'Weapon',
}

const SOURCE_LABELS: Record<string, string> = {
  inventory: 'Inventory',
  bank:      'Bank',
  materials: 'Materials',
}

function LocationBadge({ loc }: { loc: ItemLocation }) {
  const label = loc.source === 'inventory' && loc.characterName
    ? loc.characterName
    : SOURCE_LABELS[loc.source]

  return (
    <span className={styles.locationBadge} data-source={loc.source}>
      {label}
      {loc.quantity > 1 && <span className={styles.locationQty}>×{loc.quantity.toLocaleString()}</span>}
    </span>
  )
}

function ItemRow({ mergedItem }: { mergedItem: MergedItem }) {
  const { item, totalQuantity, locations } = mergedItem
  const rarityColor = RARITY_COLORS[item.rarity] ?? '#AAA9A9'
  const typeLabel = TYPE_LABELS[item.type] ?? item.type
  const description = item.description ? stripGw2Markup(item.description) : null

  return (
    <li className={styles.row}>
      <div className={styles.iconWrap}>
        {item.icon
          ? <img src={item.icon} alt="" className={styles.icon} />
          : <div className={styles.iconFallback} />
        }
      </div>

      <div className={styles.info}>
        <span className={styles.itemName} style={{ color: rarityColor }}>
          {item.name}
        </span>
        {description && (
          <span className={styles.description}>{description}</span>
        )}
        <div className={styles.locations}>
          {locations.map((loc, i) => (
            <LocationBadge key={i} loc={loc} />
          ))}
        </div>
      </div>

      <span className={styles.type}>{typeLabel}</span>

      <span className={styles.rarity} style={{ color: rarityColor }}>
        {item.rarity}
      </span>

      <span className={styles.total}>
        {totalQuantity.toLocaleString()}
      </span>
    </li>
  )
}

export default function ItemsPage() {
  const { items, loading, error } = useAllItems()

  const totalQuantity = items.reduce((sum, i) => sum + i.totalQuantity, 0)

  return (
    <div className={styles.page}>
      <h1 className={styles.title}>
        All Items
        {!loading && !error && items.length > 0 && (
          <span className={styles.summary}>
            {items.length.toLocaleString()} unique · {totalQuantity.toLocaleString()} total
          </span>
        )}
      </h1>

      {loading && (
        <div className={styles.loading}>
          <div className={styles.spinner} />
          <span>Loading all items…</span>
        </div>
      )}

      {error && (
        <div className={styles.errorBlock}>
          <p className={styles.errorText}>{error}</p>
        </div>
      )}

      {!loading && !error && items.length === 0 && (
        <p className={styles.empty}>No items found across your account.</p>
      )}

      {!loading && !error && items.length > 0 && (
        <ul className={styles.list}>
          {items.map((mergedItem) => (
            <ItemRow key={mergedItem.item.id} mergedItem={mergedItem} />
          ))}
        </ul>
      )}
    </div>
  )
}
