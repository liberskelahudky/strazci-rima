import { createContext, useCallback, useContext, useEffect, useMemo, useReducer, useState, type ReactNode } from 'react'
import { CHAPTERS, nextChapter, rankFor } from '../data'
import { todayKey } from '../lib/format'
import { playCoin } from '../lib/sound'

// Postup se ukládá lokálně – hra funguje offline a bez účtu.
const KEY = 'strazci-rima:v1'

export interface LedgerEntry {
  id: string
  label: string
  sub: string
  amount: number
  at: number
}

export interface Settings {
  names: [string, string]
  denarValue: number
  showCzk: boolean
  budget: number // 0 = bez rozpočtu
  tripStart: string
  tripEnd: string
}

export interface GameState {
  settings: Settings
  introSeen: boolean
  ledger: LedgerEntry[]
  done: Record<string, { at: number; answer?: string }>
  visited: Record<string, number>
  guessed: Record<string, { pick: number; at: number }>
  revealed: string[]
  boss: Record<string, { score: number; at: number }>
  finale: { at: number } | null
}

const initial: GameState = {
  settings: { names: ['Saša', 'Bertík'], denarValue: 10, showCzk: true, budget: 0, tripStart: '', tripEnd: '' },
  introSeen: false,
  ledger: [],
  done: {},
  visited: {},
  guessed: {},
  revealed: ['vlcice'],
  boss: {},
  finale: null,
}

type Action =
  | { t: 'complete'; id: string; reward: number; label: string; sub: string; answer?: string }
  | { t: 'visit'; place: string; reward: number; label: string }
  | { t: 'unvisit'; place: string }
  | { t: 'guess'; place: string; pick: number; reward: number; label: string }
  | { t: 'reveal'; chapter: string }
  | { t: 'boss'; score: number; reward: number }
  | { t: 'finale' }
  | { t: 'adjust'; amount: number; note: string }
  | { t: 'settings'; patch: Partial<Settings> }
  | { t: 'introSeen' }
  | { t: 'reset' }

const entry = (label: string, sub: string, amount: number, id = label): LedgerEntry => ({ id, label, sub, amount, at: Date.now() })

function reducer(s: GameState, a: Action): GameState {
  switch (a.t) {
    case 'complete':
      if (s.done[a.id]) return s
      return { ...s, done: { ...s.done, [a.id]: { at: Date.now(), answer: a.answer } }, ledger: [entry(a.label, a.sub, a.reward, a.id), ...s.ledger] }
    case 'visit':
      if (s.visited[a.place]) return s
      return { ...s, visited: { ...s.visited, [a.place]: Date.now() }, ledger: a.reward ? [entry(a.label, 'Jsme tady!', a.reward, 'visit:' + a.place), ...s.ledger] : s.ledger }
    case 'unvisit': {
      const visited = { ...s.visited }
      delete visited[a.place]
      return { ...s, visited }
    }
    case 'guess':
      if (s.guessed[a.place]) return s
      return { ...s, guessed: { ...s.guessed, [a.place]: { pick: a.pick, at: Date.now() } }, ledger: [entry(a.label, 'Tipovačka', a.reward, 'guess:' + a.place), ...s.ledger] }
    case 'reveal':
      return s.revealed.includes(a.chapter) ? s : { ...s, revealed: [...s.revealed, a.chapter] }
    case 'boss': {
      const k = todayKey()
      if (s.boss[k]) return s
      return { ...s, boss: { ...s.boss, [k]: { score: a.score, at: Date.now() } }, ledger: [entry('Večerní boss fight', `${a.score} z 5 úkolů týmově`, a.reward, 'boss:' + k), ...s.ledger] }
    }
    case 'finale':
      return { ...s, finale: s.finale ?? { at: Date.now() } }
    case 'adjust':
      return { ...s, ledger: [entry(a.note || 'Úprava od rodičů', 'Rodičovská korekce', a.amount, 'adj:' + Date.now()), ...s.ledger] }
    case 'settings':
      return { ...s, settings: { ...s.settings, ...a.patch } }
    case 'introSeen':
      return { ...s, introSeen: true }
    case 'reset':
      return { ...initial, settings: s.settings }
  }
}

function load(): GameState {
  try {
    const raw = localStorage.getItem(KEY)
    if (raw) {
      const parsed = JSON.parse(raw)
      return { ...initial, ...parsed, settings: { ...initial.settings, ...parsed.settings } }
    }
  } catch {
    /* poškozená data → začít znovu */
  }
  return initial
}

interface Reward {
  amount: number
  label: string
  key: number
}

function useGameValue() {
  const [state, dispatch] = useReducer(reducer, undefined, load)
  const [reward, setReward] = useState<Reward | null>(null)

  useEffect(() => {
    try {
      localStorage.setItem(KEY, JSON.stringify(state))
    } catch {
      /* úložiště plné nebo zakázané */
    }
  }, [state])

  const total = Math.max(0, state.ledger.reduce((sum, e) => sum + e.amount, 0))
  const rank = rankFor(total, !!state.finale)
  const unlocked = CHAPTERS.filter((c) => total >= c.unlockAt || state.revealed.includes(c.id))
  const next = nextChapter(total)
  const pendingReveal = unlocked.find((c) => !state.revealed.includes(c.id))

  const celebrate = useCallback((amount: number, label: string) => {
    if (amount <= 0) return
    playCoin(Math.ceil(amount / 3))
    setReward({ amount, label, key: Date.now() })
  }, [])

  const actions = useMemo(
    () => ({
      complete: (id: string, reward: number, label: string, sub: string, answer?: string) => {
        dispatch({ t: 'complete', id, reward, label, sub, answer })
        celebrate(reward, label)
      },
      visit: (place: string, reward: number, label: string) => {
        dispatch({ t: 'visit', place, reward, label })
        celebrate(reward, label)
      },
      guess: (place: string, pick: number, reward: number, label: string) => {
        dispatch({ t: 'guess', place, pick, reward, label })
        celebrate(reward, label)
      },
      boss: (score: number, reward: number) => {
        dispatch({ t: 'boss', score, reward })
        celebrate(reward, 'Večerní boss fight')
      },
      reveal: (chapter: string) => dispatch({ t: 'reveal', chapter }),
      finale: () => dispatch({ t: 'finale' }),
      adjust: (amount: number, note: string) => dispatch({ t: 'adjust', amount, note }),
      unvisit: (place: string) => dispatch({ t: 'unvisit', place }),
      settings: (patch: Partial<Settings>) => dispatch({ t: 'settings', patch }),
      introSeen: () => dispatch({ t: 'introSeen' }),
      reset: () => dispatch({ t: 'reset' }),
      dismissReward: () => setReward(null),
    }),
    [celebrate],
  )

  return { state, total, rank, unlocked, next, pendingReveal, reward, ...actions }
}

type Game = ReturnType<typeof useGameValue>
const Ctx = createContext<Game | null>(null)

export function GameProvider({ children }: { children: ReactNode }) {
  const value = useGameValue()
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>
}

export function useGame() {
  const g = useContext(Ctx)
  if (!g) throw new Error('useGame mimo GameProvider')
  return g
}
