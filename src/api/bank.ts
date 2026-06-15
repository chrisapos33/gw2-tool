import { gw2Fetch } from './client'
import { ENDPOINTS } from './endpoints'
import { chunkArray, publicFetch } from './utils'
import type { BankSlot, BankItemWithDetails, Item } from './types'

const BATCH_SIZE = 200

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

async function fetchBankSlots(key: string): Promise<(BankSlot | null)[]> {
  return gw2Fetch<(BankSlot | null)[]>(ENDPOINTS.bank, key)
}

async function fetchItemDetails(ids: number[]): Promise<Item[]> {
  const chunks = chunkArray(ids, BATCH_SIZE)
  const results = await Promise.all(
    chunks.map((chunk) =>
      publicFetch<Item[]>(`${ENDPOINTS.items}?ids=${chunk.join(',')}`)
    )
  )
  return results.flat()
}

export async function fetchBank(key: string): Promise<BankItemWithDetails[]> {
  const slots = await fetchBankSlots(key)
  const occupied = slots.filter((s): s is BankSlot => s !== null)
  if (occupied.length === 0) return []

  const ids = [...new Set(occupied.map((s) => s.id))]
  const items = await fetchItemDetails(ids)
  const itemMap = new Map(items.map((i) => [i.id, i]))

  const result: BankItemWithDetails[] = occupied
    .filter((slot) => itemMap.has(slot.id))
    .map((slot) => ({ slot, item: itemMap.get(slot.id)! }))

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
