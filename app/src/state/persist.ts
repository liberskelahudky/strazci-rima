// Pojistky proti ztrátě postupu:
// 1) hlavní uložení v localStorage (synchronní, hned při startu),
// 2) druhá kopie v IndexedDB + denní zálohy (posledních 14 dní) + záloha před resetem,
// 3) žádost prohlížeče o trvalé úložiště (ať data nemaže při nedostatku místa),
// 4) ruční export/import zálohy v rodičovském nastavení.

export const LS_KEY = 'strazci-rima:v1'
const DB = 'strazci-rima-save'
const STORE = 'saves'
const KEEP_DAYS = 14

export interface SaveRecord {
  key: string // 'current' | 'day:YYYY-MM-DD' | 'before-reset'
  savedAt: number
  data: unknown
}

function open(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB, 1)
    req.onupgradeneeded = () => req.result.createObjectStore(STORE, { keyPath: 'key' })
    req.onsuccess = () => resolve(req.result)
    req.onerror = () => reject(req.error)
  })
}

async function run<T>(mode: IDBTransactionMode, fn: (s: IDBObjectStore) => IDBRequest<T>): Promise<T> {
  const db = await open()
  return new Promise((resolve, reject) => {
    const req = fn(db.transaction(STORE, mode).objectStore(STORE))
    req.onsuccess = () => resolve(req.result)
    req.onerror = () => reject(req.error)
  })
}

export function readLocal(): { savedAt: number; data: Record<string, unknown> } | null {
  try {
    const raw = localStorage.getItem(LS_KEY)
    if (!raw) return null
    const data = JSON.parse(raw)
    return { savedAt: Number(data.savedAt) || 0, data }
  } catch {
    return null
  }
}

export function writeLocal(data: object) {
  try {
    localStorage.setItem(LS_KEY, JSON.stringify(data))
  } catch {
    /* plné nebo zakázané úložiště – zbývá IndexedDB */
  }
}

const denars = (data: unknown) =>
  ((data as { ledger?: { amount: number }[] })?.ledger ?? []).reduce((s, e) => s + (Number(e.amount) || 0), 0)

const day = (t: number) => {
  const d = new Date(t)
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

export async function writeBackup(data: { savedAt: number }) {
  try {
    await run('readwrite', (s) => s.put({ key: 'current', savedAt: data.savedAt, data } satisfies SaveRecord))
    // Denní záloha se nikdy nepřepíše stavem s menším počtem denárů (ochrana před omylem smazaným postupem)
    const dayKey = 'day:' + day(data.savedAt)
    const prev = await run<SaveRecord | undefined>('readonly', (s) => s.get(dayKey))
    if (!prev || denars(data) >= denars(prev.data)) await run('readwrite', (s) => s.put({ key: dayKey, savedAt: data.savedAt, data } satisfies SaveRecord))
    const keys = (await run<IDBValidKey[]>('readonly', (s) => s.getAllKeys())).map(String).filter((k) => k.startsWith('day:')).sort()
    for (const k of keys.slice(0, Math.max(0, keys.length - KEEP_DAYS))) await run('readwrite', (s) => s.delete(k))
  } catch {
    /* IndexedDB nedostupná – zůstává localStorage */
  }
}

export async function writeNamed(key: string, data: { savedAt: number }) {
  try {
    await run('readwrite', (s) => s.put({ key, savedAt: data.savedAt, data } satisfies SaveRecord))
  } catch {
    /* ignorovat */
  }
}

export async function readBackup(key = 'current'): Promise<SaveRecord | null> {
  try {
    return (await run<SaveRecord | undefined>('readonly', (s) => s.get(key))) ?? null
  } catch {
    return null
  }
}

export async function listBackups(): Promise<SaveRecord[]> {
  try {
    const all = await run<SaveRecord[]>('readonly', (s) => s.getAll())
    return all.filter((r) => r.key !== 'current').sort((a, b) => b.savedAt - a.savedAt)
  } catch {
    return []
  }
}

// Požádat prohlížeč, aby data této hry nikdy sám nemazal.
export async function requestPersistence(): Promise<boolean> {
  try {
    if (!navigator.storage?.persist) return false
    if (await navigator.storage.persisted()) return true
    return await navigator.storage.persist()
  } catch {
    return false
  }
}

export async function isPersisted(): Promise<boolean> {
  try {
    return (await navigator.storage?.persisted?.()) ?? false
  } catch {
    return false
  }
}

// ── Ruční záloha jako text (dá se poslat e-mailem, uložit do poznámek) ──
const PREFIX = 'STRAZCI1:'

export function exportCode(data: object): string {
  const json = JSON.stringify(data)
  return PREFIX + btoa(unescape(encodeURIComponent(json)))
}

export function importCode(code: string): Record<string, unknown> | null {
  try {
    const clean = code.trim().replace(/\s+/g, '')
    const body = clean.startsWith(PREFIX) ? clean.slice(PREFIX.length) : clean
    const data = JSON.parse(decodeURIComponent(escape(atob(body))))
    if (!data || typeof data !== 'object' || !Array.isArray(data.ledger)) return null
    return data
  } catch {
    // zkusit i čistý JSON (soubor zálohy)
    try {
      const data = JSON.parse(code)
      return data && Array.isArray(data.ledger) ? data : null
    } catch {
      return null
    }
  }
}
