import { useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { useApiKey } from '@/context/ApiKeyContext'
import { validateApiKey, PermissionError, ApiError } from '@/api/tokeninfo'
import { REQUIRED_PERMISSIONS } from '@/api/types'
import styles from './ApiKeyPage.module.css'

export default function ApiKeyPage() {
  const { setApiKey } = useApiKey()
  const navigate = useNavigate()

  const [value, setValue] = useState('')
  const [remember, setRemember] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [missingPermissions, setMissingPermissions] = useState<string[]>([])

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    const trimmed = value.trim()
    if (!trimmed) {
      setError('Please enter an API key.')
      return
    }

    setError(null)
    setMissingPermissions([])
    setLoading(true)

    try {
      await validateApiKey(trimmed)
      setApiKey(trimmed, remember)
      navigate('/account')
    } catch (err) {
      if (err instanceof PermissionError) {
        setMissingPermissions(err.missingPermissions)
        setError('This key is missing required permissions.')
      } else if (err instanceof ApiError) {
        setError(
          err.status === 401
            ? 'Invalid API key. Please check your key and try again.'
            : `Request failed (${err.status}). Please try again.`
        )
      } else {
        setError('Unable to reach the Guild Wars 2 API. Check your connection and try again.')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <div className={styles.header}>
          <span className={styles.logoMark}>GW2</span>
          <h1 className={styles.title}>Companion</h1>
        </div>

        <p className={styles.description}>
          Enter your Guild Wars 2 API key to get started. You can create one at{' '}
          <a
            href="https://account.arena.net/applications"
            target="_blank"
            rel="noreferrer"
          >
            account.arena.net
          </a>
          .
        </p>

        <p className={styles.permissionsRequired}>
          Required permissions:{' '}
          {REQUIRED_PERMISSIONS.map((p) => (
            <code key={p} className={styles.permission}>{p}</code>
          ))}
        </p>

        <form onSubmit={handleSubmit} className={styles.form}>
          <label htmlFor="apikey" className={styles.label}>
            API Key
          </label>
          <input
            id="apikey"
            type="text"
            className={[styles.input, error ? styles.inputError : ''].join(' ')}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder="XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXXXXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX"
            autoComplete="off"
            spellCheck={false}
            disabled={loading}
          />

          {error && (
            <div className={styles.errorBlock}>
              <p className={styles.error}>{error}</p>
              {missingPermissions.length > 0 && (
                <p className={styles.missingList}>
                  Missing:{' '}
                  {missingPermissions.map((p) => (
                    <code key={p} className={styles.permissionMissing}>{p}</code>
                  ))}
                </p>
              )}
            </div>
          )}

          <label className={styles.rememberLabel}>
            <input
              type="checkbox"
              checked={remember}
              onChange={(e) => setRemember(e.target.checked)}
              className={styles.checkbox}
              disabled={loading}
            />
            Remember this API key
            <span className={styles.rememberNote}>
              (saves to localStorage — leave unchecked for session-only storage)
            </span>
          </label>

          <button type="submit" className={styles.submit} disabled={loading}>
            {loading ? 'Validating…' : 'Connect Account'}
          </button>
        </form>
      </div>
    </div>
  )
}
