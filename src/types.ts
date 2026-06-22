export type Factor = 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9

export interface Card {
  factor: Factor
  operand: number // 1–10
  answer: number
}

export type AppView = 'main' | 'setup' | 'session'
