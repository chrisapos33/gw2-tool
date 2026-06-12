import styles from './WalletPage.module.css'

export default function WalletPage() {
  return (
    <div className={styles.page}>
      <h1 className={styles.title}>Wallet</h1>
      <p className={styles.placeholder}>Currency balances will appear here.</p>
    </div>
  )
}
