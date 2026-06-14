import { useCharacters } from './useCharacters'
import styles from './CharactersPage.module.css'
import type { Character } from '@/api/types'

const PROFESSION_COLORS: Record<string, string> = {
  Elementalist: '#F68A87',
  Engineer:     '#D09C59',
  Guardian:     '#72C1D9',
  Mesmer:       '#B679D5',
  Necromancer:  '#52A76F',
  Ranger:       '#8CDC82',
  Revenant:     '#D16E5A',
  Thief:        '#C08F95',
  Warrior:      '#FFD166',
}

function formatPlaytime(seconds: number): string {
  const hours = Math.floor(seconds / 3600)
  return `${hours.toLocaleString()}h`
}

function CharacterCard({ character: c }: { character: Character }) {
  const profColor = PROFESSION_COLORS[c.profession] ?? '#888'

  return (
    <div
      className={styles.card}
      style={{ '--prof-color': profColor } as React.CSSProperties}
    >
      <div className={styles.cardAccent} />

      <div className={styles.cardBody}>
        <div className={styles.cardHeader}>
          <span className={styles.name}>{c.name}</span>
          <span className={styles.level}>Lv {c.level}</span>
        </div>

        <div className={styles.identity}>
          {c.race} {c.gender} {c.profession}
        </div>

        <div className={styles.stats}>
          <div className={styles.stat}>
            <span className={styles.statLabel}>Deaths</span>
            <span className={styles.statValue}>{c.deaths.toLocaleString()}</span>
          </div>

          <div className={styles.stat}>
            <span className={styles.statLabel}>Playtime</span>
            <span className={styles.statValue}>{formatPlaytime(c.age)}</span>
          </div>

          {c.equipment != null && (
            <div className={styles.stat}>
              <span className={styles.statLabel}>Equipped</span>
              <span className={styles.statValue}>{c.equipment.length} items</span>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default function CharactersPage() {
  const { characters, loading, error } = useCharacters()

  return (
    <div className={styles.page}>
      <h1 className={styles.title}>Characters</h1>

      {loading && (
        <div className={styles.loading}>
          <div className={styles.spinner} />
          <span>Loading characters…</span>
        </div>
      )}

      {error && (
        <div className={styles.errorBlock}>
          <p className={styles.errorText}>{error}</p>
        </div>
      )}

      {!loading && !error && characters.length === 0 && (
        <p className={styles.empty}>No characters found on this account.</p>
      )}

      {!loading && !error && characters.length > 0 && (
        <div className={styles.grid}>
          {characters.map((c) => (
            <CharacterCard key={c.name} character={c} />
          ))}
        </div>
      )}
    </div>
  )
}
