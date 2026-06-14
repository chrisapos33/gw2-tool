export interface MaterialEntry {
  id: number
  category: number
  binding?: string
  count: number
}

export interface MaterialCategory {
  id: number
  name: string
  order: number
  items: number[]
}

export interface Item {
  id: number
  name: string
  icon?: string
  rarity: string
  type: string
  description?: string
}

export interface MaterialEntryWithDetails {
  entry: MaterialEntry
  item: Item
  category: MaterialCategory | null
}
