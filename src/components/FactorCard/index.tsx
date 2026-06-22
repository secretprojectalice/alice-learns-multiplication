import { Factor } from '../../types'
import { FACTOR_COLORS } from '../../theme/factorColors'
import styles from './FactorCard.module.css'

interface FactorCardProps {
  factor: Factor
  selected?: boolean
  onClick?: () => void
}

export function FactorCard({ factor, selected = false, onClick }: FactorCardProps) {
  return (
    <button
      className={`${styles.card} ${selected ? styles.selected : ''}`}
      style={{ backgroundColor: FACTOR_COLORS[factor] }}
      onClick={onClick}
      aria-pressed={selected}
    >
      {factor}
    </button>
  )
}
