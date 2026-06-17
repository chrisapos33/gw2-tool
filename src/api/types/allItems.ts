import type { Item } from './material'

export interface ItemLocation {
  source: 'inventory' | 'bank' | 'materials'
  characterName?: string
  quantity: number
}

export interface MergedItem {
  item: Item
  totalQuantity: number
  locations: ItemLocation[]
}
