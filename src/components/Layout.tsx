import { Outlet, NavLink, useNavigate } from 'react-router-dom'
import { useApiKey } from '@/context/ApiKeyContext'
import styles from './Layout.module.css'

const NAV_ITEMS = [
  { to: '/account',    label: 'Account' },
  { to: '/characters', label: 'Characters' },
  { to: '/wallet',     label: 'Wallet' },
  { to: '/bank',       label: 'Bank' },
  { to: '/materials',  label: 'Materials' },
]

export default function Layout() {
  const { clearApiKey } = useApiKey()
  const navigate = useNavigate()

  function handleSignOut() {
    clearApiKey()
    navigate('/apikey')
  }

  return (
    <div className={styles.shell}>
      <aside className={styles.sidebar}>
        <div className={styles.logo}>
          <span className={styles.logoMark}>GW2</span>
          <span className={styles.logoText}>Companion</span>
        </div>

        <nav className={styles.nav}>
          {NAV_ITEMS.map(({ to, label }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                [styles.navItem, isActive ? styles.navItemActive : ''].join(' ')
              }
            >
              {label}
            </NavLink>
          ))}
        </nav>

        <button className={styles.signOut} onClick={handleSignOut}>
          Sign out
        </button>
      </aside>

      <main className={styles.main}>
        <Outlet />
      </main>
    </div>
  )
}
