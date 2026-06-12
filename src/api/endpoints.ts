export const GW2_API_BASE = 'https://api.guildwars2.com/v2'

export const ENDPOINTS = {
  tokeninfo:  `${GW2_API_BASE}/tokeninfo`,
  account:    `${GW2_API_BASE}/account`,
  characters: `${GW2_API_BASE}/characters`,
  wallet:     `${GW2_API_BASE}/account/wallet`,
  bank:       `${GW2_API_BASE}/account/bank`,
  materials:  `${GW2_API_BASE}/account/materials`,
} as const
