import { gw2Fetch } from './client'
import { ENDPOINTS } from './endpoints'
import type { Character } from './types'

async function fetchCharacterNames(key: string): Promise<string[]> {
  return gw2Fetch<string[]>(ENDPOINTS.characters, key)
}

async function fetchCharacter(name: string, key: string): Promise<Character> {
  return gw2Fetch<Character>(
    `${ENDPOINTS.characters}/${encodeURIComponent(name)}`,
    key
  )
}

export async function fetchAllCharacters(key: string): Promise<Character[]> {
  const names = await fetchCharacterNames(key)
  return Promise.all(names.map((name) => fetchCharacter(name, key)))
}
