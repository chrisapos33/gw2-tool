export interface WalletEntry {
  id: number
  value: number
}

export interface Currency {
  id: number
  name: string
  description: string
  icon: string
  order: number
  deprecated?: boolean
}

export interface WalletEntryWithCurrency {
  entry: WalletEntry
  currency: Currency
}
