import { fetchAllCharacters } from './characters'
import { fetchItemMap } from './utils'
import type { InventorySlot } from './types'
import type { CharacterInventory } from './types'

const RARITY_ORDER: Record<string, number> = {
  Legendary:  7,
  Ascended:   6,
  Exotic:     5,
  Rare:       4,
  Masterwork: 3,
  Fine:       2,
  Basic:      1,
  Junk:       0,
}

export async function fetchInventory(key: string): Promise<CharacterInventory[]> {
  const characters = await fetchAllCharacters(key)

  // Collect occupied slots per character, preserving order
  const perCharacter = characters.map((char) => {
    const slots: InventorySlot[] = []
    for (const bag of char.bags ?? []) {
      if (!bag) continue
      for (const slot of bag.inventory) {
        if (slot !== null) slots.push(slot)
      }
    }
    return { name: char.name, profession: char.profession, slots }
  })

  // Single fetchItemMap call for all unique IDs across all characters
  const allIds = perCharacter.flatMap((c) => c.slots.map((s) => s.id))
  const itemMap = await fetchItemMap(allIds)

  return perCharacter
    .map(({ name, profession, slots }) => {
      const items = slots
        .filter((slot) => itemMap.has(slot.id))
        .map((slot) => ({ slot, item: itemMap.get(slot.id)! }))

      items.sort((a, b) => {
        const rarityDiff =
          (RARITY_ORDER[b.item.rarity] ?? 0) - (RARITY_ORDER[a.item.rarity] ?? 0)
        if (rarityDiff !== 0) return rarityDiff
        const typeDiff = a.item.type.localeCompare(b.item.type)
        if (typeDiff !== 0) return typeDiff
        return a.item.name.localeCompare(b.item.name)
      })

      return { characterName: name, profession, items }
    })
    .filter((c) => c.items.length > 0)
}
