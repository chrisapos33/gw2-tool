export interface Account {
  id: string
  name: string
  world: number
  guilds: string[]
  guild_leader: string[]
  created: string
  access: string[]
  commander: boolean
  fractal_level: number
  daily_ap: number
  monthly_ap: number
  wvw_rank: number
  last_modified: string
}

export interface TokenInfo {
  id: string
  name: string
  permissions: string[]
}

export const REQUIRED_PERMISSIONS = ['account', 'characters', 'inventories', 'wallet'] as const
export type RequiredPermission = typeof REQUIRED_PERMISSIONS[number]
