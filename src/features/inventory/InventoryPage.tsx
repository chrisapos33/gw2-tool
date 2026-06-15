import { useInventory } from './useInventory'
import { stripGw2Markup } from '@/utils/gw2Text'
import styles from './InventoryPage.module.css'
import type { CharacterInventory } from '@/api/types'

const PROFESSION_COLORS: Record<string, string> = {
  Elementalist: '#F68A87',
  Engineer:     '#D09C59',
  Guardian:     '#72C1D9',
  Mesmer:       '#B679D5',
  Necromancer:  '#52A76F',
  Ranger:       '#8CDC82',
  Revenant:     '#D16E5A',
  Thief:        '#C08F95',
  Warrior:      '#FFD166',
}

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

function CharacterSection({ character }: { character: CharacterInventory }) {
  const profColor = PROFESSION_COLORS[character.profession] ?? '#888'

  return (
    <section className={styles.section}>
      <div className={styles.sectionHeader} style={{ '--prof-color': profColor } as React.CSSProperties}>
        <div className={styles.sectionAccent} />
        <div className={styles.sectionMeta}>
          <span className={styles.characterName}>{character.characterName}</span>
          <span className={styles.characterSub}>
            {character.profession} · {character.items.length} items
          </span>
        </div>
      </div>

      <ul className={styles.list}>
        {character.items.map(({ slot, item }, index) => {
          const rarityColor = RARITY_COLORS[item.rarity] ?? '#AAA9A9'
          const typeLabel = TYPE_LABELS[item.type] ?? item.type
          const description = item.description ? stripGw2Markup(item.description) : null

          return (
            <li key={index} className={styles.row}>
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
              </div>

              <span className={styles.type}>{typeLabel}</span>

              <span className={styles.rarity} style={{ color: rarityColor }}>
                {item.rarity}
              </span>

              <span className={styles.quantity}>
                {slot.count > 1 ? `×${slot.count.toLocaleString()}` : ''}
              </span>
            </li>
          )
        })}
      </ul>
    </section>
  )
}

export default function InventoryPage() {
  const { inventory, loading, error } = useInventory()

  const totalItems = inventory.reduce((sum, c) => sum + c.items.length, 0)

  return (
    <div className={styles.page}>
      <h1 className={styles.title}>
        Inventory
        {!loading && !error && totalItems > 0 && (
          <span className={styles.totalCount}>{totalItems} items across {inventory.length} characters</span>
        )}
      </h1>

      {loading && (
        <div className={styles.loading}>
          <div className={styles.spinner} />
          <span>Loading inventory…</span>
        </div>
      )}

      {error && (
        <div className={styles.errorBlock}>
          <p className={styles.errorText}>{error}</p>
        </div>
      )}

      {!loading && !error && inventory.length === 0 && (
        <p className={styles.empty}>No inventory items found across your characters.</p>
      )}

      {!loading && !error && inventory.map((character) => (
        <CharacterSection key={character.characterName} character={character} />
      ))}
    </div>
  )
}
