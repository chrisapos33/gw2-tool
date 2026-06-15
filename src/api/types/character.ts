export interface EquipmentItem {
  id: number
  slot: string
  skin?: number
  upgrades?: number[]
  infusions?: number[]
  binding?: string
  bound_to?: string
}

export interface InventorySlot {
  id: number
  count: number
  skin?: number
  upgrades?: number[]
  infusions?: number[]
  binding?: string
  bound_to?: string
}

export interface CharacterBag {
  id: number
  size: number
  inventory: (InventorySlot | null)[]
}

export interface Character {
  name: string
  race: string
  gender: string
  flags: string[]
  profession: string
  level: number
  guild?: string
  age: number
  last_modified: string
  created: string
  deaths: number
  equipment?: EquipmentItem[]
  bags?: (CharacterBag | null)[]
  specializations?: CharacterSpecializations
}

export interface CharacterSpecializations {
  pve: SpecializationSlot[]
  pvp: SpecializationSlot[]
  wvw: SpecializationSlot[]
}

export interface SpecializationSlot {
  id: number | null
  traits: (number | null)[]
}
