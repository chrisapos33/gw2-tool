import { gw2Fetch, ApiError } from './client'
import { ENDPOINTS } from './endpoints'
import { REQUIRED_PERMISSIONS, type TokenInfo } from './types'

export { ApiError }

export class PermissionError extends Error {
  constructor(public readonly missingPermissions: string[]) {
    super(`Missing required permissions: ${missingPermissions.join(', ')}`)
    this.name = 'PermissionError'
  }
}

export async function validateApiKey(key: string): Promise<TokenInfo> {
  const tokenInfo = await gw2Fetch<TokenInfo>(ENDPOINTS.tokeninfo, key)

  const missing = REQUIRED_PERMISSIONS.filter(
    (p) => !tokenInfo.permissions.includes(p)
  )
  if (missing.length > 0) {
    throw new PermissionError(missing)
  }

  return tokenInfo
}
