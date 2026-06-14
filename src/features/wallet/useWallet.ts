import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useApiKey } from '@/context/ApiKeyContext'
import { fetchWallet } from '@/api/wallet'
import { ApiError } from '@/api/client'
import type { WalletEntryWithCurrency } from '@/api/types'

interface UseWalletResult {
  wallet: WalletEntryWithCurrency[]
  loading: boolean
  error: string | null
}

export function useWallet(): UseWalletResult {
  const { apiKey, clearApiKey } = useApiKey()
  const navigate = useNavigate()
  const [wallet, setWallet] = useState<WalletEntryWithCurrency[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!apiKey) {
      navigate('/apikey')
      return
    }

    let cancelled = false
    setLoading(true)
    setError(null)

    fetchWallet(apiKey)
      .then((data) => {
        if (!cancelled) setWallet(data)
      })
      .catch((err) => {
        if (cancelled) return
        if (err instanceof ApiError && err.status === 401) {
          clearApiKey()
          navigate('/apikey')
        } else if (err instanceof ApiError) {
          setError(`Failed to load wallet (${err.status}). Please try again.`)
        } else {
          setError('Unable to reach the Guild Wars 2 API. Check your connection and try again.')
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [apiKey, clearApiKey, navigate])

  return { wallet, loading, error }
}
