# CLAUDE.md

This file gives Claude Code context for working in this repository.

## Project Overview

A bright, playful web app for a 2nd-grade child to **learn and memorize the
multiplication table** (factors 2–9) through interactive flashcard practice
sessions. Built as a summer learning project assigned by her teacher.

This is a **learning tool, not a quiz/scoring app**. The MVP has no scores,
no accounts, no persistence — the focus is purely on repeated, low-pressure
exposure to multiplication facts until they stick.

## Tech Stack

- **TypeScript** + **React** + **Vite**
- Plain CSS (CSS Modules) — no UI component library, so visual design stays
  fully custom and playful
- No backend, no database, no auth — everything lives in React state for
  this MVP
- No state management library needed (useState/useReducer is sufficient at
  this scope)

## Core User Flow

1. **Main Page** — grid of 8 colorful factor cards (2–9, no "1" — too easy).
   Tapping a card toggles it as a quick-select for Practice. A prominent
   **Practice** button starts setup.
2. **Practice Setup** — multi-select chips for factors (pre-filled from Main
   Page selection, editable) + a range filter for the second operand (e.g.
   1–9). "Start" generates a session deck.
3. **Flashcard Session** — one problem at a time: `N × M = ?` with a numeric
   text input.
   - Correct answer → light celebratory feedback, advance.
   - Wrong answer → gentle feedback, allow retry.
   - "Show Answer" / "I don't know" → reveals the result directly.
   - End of deck → friendly "All done!" screen. No score shown.

## Key Product Rules (don't lose these when implementing)

- **Full cross-product, not random sampling.** A session deck must contain
  *every* combination of selected factors × selected operand range — shuffle
  the order, but never skip pairs. The goal is complete coverage of the
  table being practiced.
- **Missed/revealed cards get requeued.** If a card was answered wrong or
  revealed via "Show Answer", re-insert it later in the same session's deck
  (not immediately next) so the child sees the correct fact again before the
  session ends. This is the main "memorization" mechanic for MVP — no formal
  spaced-repetition algorithm needed, just a simple requeue.
- **Consistent color per factor.** Each factor (2–9) gets one fixed color
  used everywhere it appears: Main Page card, Practice Setup chip, and the
  flashcard background during a session. This builds visual pattern
  association over repeated use — don't let it drift between components.
- **No scoring, no auth, no persistence** in this MVP. Don't add these
  speculatively.

## Non-Functional Requirements

- **Must work well on mobile and tablet, portrait and landscape.** Avoid
  fixed-breakpoint-only layouts; prefer fluid techniques:
  - CSS Grid with `auto-fit`/`minmax()` for card grids
  - `clamp()` for font sizing instead of fixed px steps
  - Touch targets should be generously large (~60px+) since the end user is
    a 2nd grader
- Visual theme: **colorful, playful, cartoonish** — big rounded shapes, bold
  type, satisfying micro-animations (e.g. card flip on reveal).

## Project Structure (suggested starting point)

```
src/
  components/
    MainPage/
    PracticeSetup/
    FlashcardSession/
    FactorCard/        (shared between Main Page + Setup chips)
  hooks/
    useDeck.ts          (deck generation + requeue logic)
  theme/
    factorColors.ts     (single source of truth for per-factor color mapping)
  types.ts
  App.tsx
  main.tsx
```

## Development Commands

(Fill in once the Vite project is scaffolded, e.g.:)
- `npm run dev` — start dev server
- `npm run build` — production build
- `npm run lint` — lint check

## Out of Scope for MVP (don't build unless asked)

- Score tracking / stats / progress over time
- User accounts, login, multiple profiles
- Backend API or database
- Sound effects (nice-to-have, not required)
- Factors 1, 10+, or division
