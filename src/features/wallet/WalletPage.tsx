import { useWallet } from './useWallet'
import styles from './WalletPage.module.css'

export default function WalletPage() {
  const { wallet, loading, error } = useWallet()

  return (
    <div className={styles.page}>
      <h1 className={styles.title}>Wallet</h1>

      {loading && (
        <div className={styles.loading}>
          <div className={styles.spinner} />
          <span>Loading wallet…</span>
        </div>
      )}

      {error && (
        <div className={styles.errorBlock}>
          <p className={styles.errorText}>{error}</p>
        </div>
      )}

      {!loading && !error && wallet.length === 0 && (
        <p className={styles.empty}>No currencies found in this wallet.</p>
      )}

      {!loading && !error && wallet.length > 0 && (
        <ul className={styles.list}>
          {wallet.map(({ entry, currency }) => (
            <li key={currency.id} className={styles.row}>
              <div className={styles.iconWrap}>
                {currency.icon
                  ? <img src={currency.icon} alt="" className={styles.icon} />
                  : <div className={styles.iconFallback} />
                }
              </div>

              <div className={styles.info}>
                <span className={styles.name}>{currency.name}</span>
                {currency.description && (
                  <span className={styles.description}>{currency.description}</span>
                )}
              </div>

              <span className={styles.amount}>
                {entry.value.toLocaleString()}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
