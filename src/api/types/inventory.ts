import type { InventorySlot } from './character'
import type { Item } from './material'

export interface InventoryItemWithDetails {
  slot: InventorySlot
  item: Item
}

export interface CharacterInventory {
  characterName: string
  profession: string
  items: InventoryItemWithDetails[]
}
