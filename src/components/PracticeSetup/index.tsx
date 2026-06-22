import { useState } from 'react'
import { Factor } from '../../types'
import { FactorCard } from '../FactorCard'
import styles from './PracticeSetup.module.css'

const FACTORS: Factor[] = [2, 3, 4, 5, 6, 7, 8, 9]

interface PracticeSetupProps {
  onStart: (factors: Factor[]) => void
  onBack: () => void
}

export function PracticeSetup({ onStart, onBack }: PracticeSetupProps) {
  const [selected, setSelected] = useState<Factor[]>([])

  function toggleFactor(f: Factor) {
    setSelected((prev) =>
      prev.includes(f) ? prev.filter((x) => x !== f) : [...prev, f],
    )
  }

  return (
    <div className={styles.page}>
      <button className={styles.back} onClick={onBack}>← Назад</button>
      <h2 className={styles.title}>Вибери множник</h2>

      <div className={styles.chips}>
        {FACTORS.map((f) => (
          <FactorCard
            key={f}
            factor={f}
            selected={selected.includes(f)}
            onClick={() => toggleFactor(f)}
          />
        ))}
      </div>

      <button
        className={styles.startBtn}
        disabled={selected.length === 0}
        onClick={() => onStart(selected)}
      >
        Старт!
      </button>
    </div>
  )
}
