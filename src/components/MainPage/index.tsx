import { useState } from 'react'
import { Factor } from '../../types'
import { FactorCard } from '../FactorCard'
import { FACTOR_COLORS } from '../../theme/factorColors'
import styles from './MainPage.module.css'

const FACTORS: Factor[] = [2, 3, 4, 5, 6, 7, 8, 9]
const OPERANDS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]

interface MainPageProps {
  onPractice: () => void
}

export function MainPage({ onPractice }: MainPageProps) {
  const [openFactor, setOpenFactor] = useState<Factor | null>(null)

  return (
    <div className={styles.page}>
      <h1 className={styles.title}>Таблиця множення</h1>
      <p className={styles.subtitle}>Натисни на цифру, щоб побачити таблицю</p>
      <div className={styles.grid}>
        {FACTORS.map((f) => (
          <FactorCard key={f} factor={f} onClick={() => setOpenFactor(f)} />
        ))}
      </div>
      <button className={styles.practiceBtn} onClick={onPractice}>
        Почати!
      </button>

      {openFactor !== null && (
        <div className={styles.overlay} onClick={() => setOpenFactor(null)}>
          <div
            className={styles.modal}
            onClick={(e) => e.stopPropagation()}
          >
            <div
              className={styles.modalHeader}
              style={{ backgroundColor: FACTOR_COLORS[openFactor] }}
            >
              <span className={styles.modalFactor}>{openFactor}</span>
              <button
                className={styles.closeBtn}
                onClick={() => setOpenFactor(null)}
                aria-label="Close"
              >
                ✕
              </button>
            </div>
            <ul className={styles.tableList}>
              {OPERANDS.map((op) => (
                <li key={op} className={styles.tableRow}>
                  <span className={styles.tableLeft}>{openFactor} × {op}</span>
                  <span className={styles.tableSep}>=</span>
                  <span className={styles.tableRight}>{openFactor * op}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  )
}
