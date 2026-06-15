import type { Item } from './material'

export interface BankSlot {
  id: number
  count: number
  skin?: number
  upgrades?: number[]
  infusions?: number[]
  binding?: string
  bound_to?: string
}

export interface BankItemWithDetails {
  slot: BankSlot
  item: Item
}
