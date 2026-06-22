import { useState, useRef, useEffect } from 'react'
import { Factor } from '../../types'
import { useDeck } from '../../hooks/useDeck'
import { FACTOR_COLORS } from '../../theme/factorColors'
import styles from './FlashcardSession.module.css'

interface FlashcardSessionProps {
  factors: Factor[]
  operandMin: number
  operandMax: number
  onDone: () => void
}

export function FlashcardSession({ factors, operandMin, operandMax, onDone }: FlashcardSessionProps) {
  const { current, isDone, advance, requeueAndAdvance } = useDeck(factors, operandMin, operandMax)
  const [input, setInput] = useState('')
  const [status, setStatus] = useState<'idle' | 'correct' | 'wrong' | 'revealed'>('idle')
  const [gotItEnabled, setGotItEnabled] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  // Reset only when the actual card identity changes, not on every render.
  useEffect(() => {
    if (!isDone) {
      setInput('')
      setStatus('idle')
      inputRef.current?.focus()
    }
  }, [current?.factor, current?.operand, isDone])

  // Delay enabling "Got it" so the child has time to read the answer before
  // accidentally tapping through to the next card.
  useEffect(() => {
    if (status === 'revealed') {
      const t = setTimeout(() => setGotItEnabled(true), 800)
      return () => clearTimeout(t)
    } else {
      setGotItEnabled(false)
    }
  }, [status])

  if (isDone || !current) {
    return (
      <div className={styles.done}>
        <p className={styles.doneEmoji}>🎉</p>
        <h2 className={styles.doneTitle}>Супер!</h2>
        <button className={styles.btn} onClick={onDone}>Назад до меню</button>
      </div>
    )
  }

  const bgColor = FACTOR_COLORS[current.factor]

  function handleCheck() {
    if (Number(input) === current!.answer) {
      setStatus('correct')
      setTimeout(() => advance(), 900)
    } else {
      setStatus('wrong')
    }
  }

  function handleReveal() {
    // Only update UI status here — don't touch the deck yet.
    // The deck mutation + advance happens when the user clicks "Got it".
    setStatus('revealed')
  }

  return (
    <div className={styles.page} style={{ backgroundColor: bgColor }}>
      <button className={styles.exitBtn} onClick={onDone}>← Меню</button>

      <div className={styles.card} key={`${current.factor}-${current.operand}`}>
        <p className={styles.problem}>
          {current.factor} × {current.operand} = ?
        </p>

        {status === 'revealed' && (
          <>
            <p className={styles.answer}>{current.answer}</p>
            <p className={styles.revealedHint}>Запам'ятай це!</p>
            <button
              className={styles.btn}
              onClick={requeueAndAdvance}
              disabled={!gotItEnabled}
            >
              ОК, далі →
            </button>
          </>
        )}

        {(status === 'idle' || status === 'wrong') && (
          <>
            <input
              ref={inputRef}
              className={`${styles.input} ${status === 'wrong' ? styles.inputWrong : ''}`}
              type="number"
              inputMode="numeric"
              value={input}
              onChange={(e) => { setInput(e.target.value); setStatus('idle') }}
              onKeyDown={(e) => e.key === 'Enter' && input !== '' && handleCheck()}
              placeholder="?"
            />
            <div className={styles.actions}>
              <button className={styles.btn} onClick={handleCheck} disabled={input === ''}>
                Перевірити
              </button>
              <button className={`${styles.btn} ${styles.btnSecondary}`} onClick={handleReveal}>
                Показати відповідь
              </button>
            </div>
            {status === 'wrong' && (
              <p className={styles.wrongMsg}>Не зовсім вірно - спробуй ще!</p>
            )}
          </>
        )}

        {status === 'correct' && (
          <p className={styles.correctMsg}>Вірно! 🌟</p>
        )}
      </div>
    </div>
  )
}
