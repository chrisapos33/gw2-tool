import { useBank } from './useBank'
import { stripGw2Markup } from '@/utils/gw2Text'
import styles from './BankPage.module.css'

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

export default function BankPage() {
  const { bank, loading, error } = useBank()

  return (
    <div className={styles.page}>
      <h1 className={styles.title}>
        Bank
        {!loading && !error && bank.length > 0 && (
          <span className={styles.count}>{bank.length} items</span>
        )}
      </h1>

      {loading && (
        <div className={styles.loading}>
          <div className={styles.spinner} />
          <span>Loading bank…</span>
        </div>
      )}

      {error && (
        <div className={styles.errorBlock}>
          <p className={styles.errorText}>{error}</p>
        </div>
      )}

      {!loading && !error && bank.length === 0 && (
        <p className={styles.empty}>No items found in the bank.</p>
      )}

      {!loading && !error && bank.length > 0 && (
        <ul className={styles.list}>
          {bank.map(({ slot, item }, index) => {
            const rarityColor = RARITY_COLORS[item.rarity] ?? '#AAA9A9'
            const typeLabel = TYPE_LABELS[item.type] ?? item.type
            const description = item.description
              ? stripGw2Markup(item.description)
              : null

            return (
              <li key={index} className={styles.row}>
                <div className={styles.iconWrap}>
                  {item.icon
                    ? <img src={item.icon} alt="" className={styles.icon} />
                    : <div className={styles.iconFallback} />
                  }
                </div>

                <div className={styles.info}>
                  <span
                    className={styles.name}
                    style={{ color: rarityColor }}
                  >
                    {item.name}
                  </span>
                  {description && (
                    <span className={styles.description}>{description}</span>
                  )}
                </div>

                <span className={styles.type}>{typeLabel}</span>

                <span
                  className={styles.rarity}
                  style={{ color: rarityColor }}
                >
                  {item.rarity}
                </span>

                <span className={styles.quantity}>
                  {slot.count > 1 ? `×${slot.count.toLocaleString()}` : ''}
                </span>
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}
