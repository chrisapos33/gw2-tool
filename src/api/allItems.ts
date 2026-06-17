import { fetchAllCharacters } from './characters'
import { fetchBankSlots } from './bank'
import { fetchMaterialEntries } from './materials'
import { fetchItemMap } from './utils'
import type { BankSlot, InventorySlot, Item, MergedItem, ItemLocation } from './types'

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

// locationKey uniquely identifies a source+character combination for merging
// same item in two different inventory slots on the same character → same key → summed
function addToMerge(
  mergeMap: Map<number, { item: Item; locationMap: Map<string, ItemLocation> }>,
  itemMap: Map<number, Item>,
  itemId: number,
  locationKey: string,
  location: ItemLocation,
) {
  if (!itemMap.has(itemId)) return

  if (!mergeMap.has(itemId)) {
    mergeMap.set(itemId, { item: itemMap.get(itemId)!, locationMap: new Map() })
  }

  const { locationMap } = mergeMap.get(itemId)!
  if (locationMap.has(locationKey)) {
    locationMap.get(locationKey)!.quantity += location.quantity
  } else {
    locationMap.set(locationKey, { ...location })
  }
}

export async function fetchAllItems(key: string): Promise<MergedItem[]> {
  // Step 1: fetch all raw data in parallel — no item details yet
  const [characters, rawBankSlots, rawMaterialEntries] = await Promise.all([
    fetchAllCharacters(key),
    fetchBankSlots(key),
    fetchMaterialEntries(key),
  ])

  // Step 2: flatten each source to (itemId, count) pairs
  const inventorySlots: { slot: InventorySlot; characterName: string }[] = []
  for (const char of characters) {
    for (const bag of char.bags ?? []) {
      if (!bag) continue
      for (const slot of bag.inventory) {
        if (slot !== null) inventorySlots.push({ slot, characterName: char.name })
      }
    }
  }

  const bankSlots = rawBankSlots.filter((s): s is BankSlot => s !== null)
  const materialEntries = rawMaterialEntries.filter((e) => e.count > 0)

  // Step 3: single fetchItemMap for all unique IDs across all sources
  const allIds = [
    ...inventorySlots.map((s) => s.slot.id),
    ...bankSlots.map((s) => s.id),
    ...materialEntries.map((e) => e.id),
  ]
  const itemMap = await fetchItemMap(allIds)

  // Step 4: merge into Map<itemId, { item, locationMap }>
  const mergeMap = new Map<number, { item: Item; locationMap: Map<string, ItemLocation> }>()

  for (const { slot, characterName } of inventorySlots) {
    addToMerge(mergeMap, itemMap, slot.id, `inventory:${characterName}`, {
      source: 'inventory',
      characterName,
      quantity: slot.count,
    })
  }

  for (const slot of bankSlots) {
    addToMerge(mergeMap, itemMap, slot.id, 'bank', {
      source: 'bank',
      quantity: slot.count,
    })
  }

  for (const entry of materialEntries) {
    addToMerge(mergeMap, itemMap, entry.id, 'materials', {
      source: 'materials',
      quantity: entry.count,
    })
  }

  // Step 5: convert to MergedItem[] and sort
  const result: MergedItem[] = Array.from(mergeMap.values()).map(({ item, locationMap }) => ({
    item,
    totalQuantity: Array.from(locationMap.values()).reduce((sum, l) => sum + l.quantity, 0),
    locations: Array.from(locationMap.values()),
  }))

  result.sort((a, b) => {
    const rarityDiff =
      (RARITY_ORDER[b.item.rarity] ?? 0) - (RARITY_ORDER[a.item.rarity] ?? 0)
    if (rarityDiff !== 0) return rarityDiff
    const typeDiff = a.item.type.localeCompare(b.item.type)
    if (typeDiff !== 0) return typeDiff
    return a.item.name.localeCompare(b.item.name)
  })

  return result
}
