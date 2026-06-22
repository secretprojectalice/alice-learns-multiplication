import { useState, useCallback } from 'react'
import { Card, Factor } from '../types'

function buildDeck(factors: Factor[], operandMin: number, operandMax: number): Card[] {
  const cards: Card[] = []
  for (const factor of factors) {
    for (let operand = operandMin; operand <= operandMax; operand++) {
      cards.push({ factor, operand, answer: factor * operand })
    }
  }
  return shuffle(cards)
}

function shuffle<T>(arr: T[]): T[] {
  const copy = [...arr]
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[copy[i], copy[j]] = [copy[j], copy[i]]
  }
  return copy
}

export function useDeck(factors: Factor[], operandMin: number, operandMax: number) {
  const [deck, setDeck] = useState<Card[]>(() =>
    buildDeck(factors, operandMin, operandMax),
  )
  const [index, setIndex] = useState(0)

  const current = deck[index] ?? null
  const isDone = index >= deck.length

  // Correct answer — just move forward.
  const advance = useCallback(() => {
    setIndex((i) => i + 1)
  }, [])

  // Wrong / revealed — insert a copy of the current card later in the deck,
  // then advance. Crucially, the card stays at its current index until we
  // move forward, so the UI can keep showing it (e.g. the revealed answer)
  // without anything disappearing mid-render.
  const requeueAndAdvance = useCallback(() => {
    setDeck((prev) => {
      const copy = [...prev]
      const card = copy[index]
      const offset = Math.floor(Math.random() * 3) + 3
      const insertAt = Math.min(index + offset, copy.length)
      copy.splice(insertAt, 0, card)
      return copy
    })
    setIndex((i) => i + 1)
  }, [index])

  return { current, isDone, advance, requeueAndAdvance }
}
