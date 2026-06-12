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
