import { useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { useApiKey } from '@/context/ApiKeyContext'
import styles from './ApiKeyPage.module.css'

export default function ApiKeyPage() {
  const { setApiKey } = useApiKey()
  const navigate = useNavigate()

  const [value, setValue] = useState('')
  const [remember, setRemember] = useState(false)
  const [error, setError] = useState<string | null>(null)

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    const trimmed = value.trim()
    if (!trimmed) {
      setError('Please enter an API key.')
      return
    }
    setError(null)
    setApiKey(trimmed, remember)
    navigate('/account')
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

        <p className={styles.permissions}>
          Required permissions:{' '}
          {['account', 'characters', 'inventories', 'wallet'].map((p) => (
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
          />

          {error && <p className={styles.error}>{error}</p>}

          <label className={styles.rememberLabel}>
            <input
              type="checkbox"
              checked={remember}
              onChange={(e) => setRemember(e.target.checked)}
              className={styles.checkbox}
            />
            Remember this API key
            <span className={styles.rememberNote}>
              (saves to localStorage — leave unchecked for session-only storage)
            </span>
          </label>

          <button type="submit" className={styles.submit}>
            Connect Account
          </button>
        </form>
      </div>
    </div>
  )
}
