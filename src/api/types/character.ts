export interface EquipmentItem {
  id: number
  slot: string
  skin?: number
  upgrades?: number[]
  infusions?: number[]
  binding?: string
  bound_to?: string
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
