import { useEffect, useState } from 'react'

// Fotky z misí ukládáme do IndexedDB v telefonu – nikam se neodesílají.
export interface Photo {
  key: string // id mise nebo "place:<id>"
  label: string
  blob: Blob
  at: number
}

const DB = 'strazci-rima-photos'
const STORE = 'photos'

function open(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB, 1)
    req.onupgradeneeded = () => req.result.createObjectStore(STORE, { keyPath: 'key' })
    req.onsuccess = () => resolve(req.result)
    req.onerror = () => reject(req.error)
  })
}

async function tx<T>(mode: IDBTransactionMode, fn: (s: IDBObjectStore) => IDBRequest<T>): Promise<T> {
  const db = await open()
  return new Promise((resolve, reject) => {
    const req = fn(db.transaction(STORE, mode).objectStore(STORE))
    req.onsuccess = () => resolve(req.result)
    req.onerror = () => reject(req.error)
  })
}

const listeners = new Set<() => void>()
const notify = () => listeners.forEach((l) => l())

// Zmenšit fotku, ať telefon nezaplníme (max 1600 px, JPEG).
async function shrink(file: File): Promise<Blob> {
  try {
    const bmp = await createImageBitmap(file)
    const scale = Math.min(1, 1600 / Math.max(bmp.width, bmp.height))
    const c = document.createElement('canvas')
    c.width = Math.round(bmp.width * scale)
    c.height = Math.round(bmp.height * scale)
    c.getContext('2d')!.drawImage(bmp, 0, 0, c.width, c.height)
    return await new Promise((r) => c.toBlob((b) => r(b ?? file), 'image/jpeg', 0.85))
  } catch {
    return file
  }
}

export async function savePhoto(key: string, label: string, file: File) {
  const blob = await shrink(file)
  await tx('readwrite', (s) => s.put({ key, label, blob, at: Date.now() } satisfies Photo))
  notify()
}

export async function deletePhoto(key: string) {
  await tx('readwrite', (s) => s.delete(key))
  notify()
}

export async function clearPhotos() {
  await tx('readwrite', (s) => s.clear())
  notify()
}

export function usePhotos() {
  const [photos, setPhotos] = useState<(Photo & { url: string })[]>([])
  useEffect(() => {
    let urls: string[] = []
    const refresh = () =>
      tx<Photo[]>('readonly', (s) => s.getAll())
        .then((all) => {
          urls.forEach(URL.revokeObjectURL)
          const withUrls = all.sort((a, b) => b.at - a.at).map((p) => ({ ...p, url: URL.createObjectURL(p.blob) }))
          urls = withUrls.map((p) => p.url)
          setPhotos(withUrls)
        })
        .catch(() => setPhotos([]))
    refresh()
    listeners.add(refresh)
    return () => {
      listeners.delete(refresh)
      urls.forEach(URL.revokeObjectURL)
    }
  }, [])
  return photos
}

export function usePhoto(key: string) {
  return usePhotos().find((p) => p.key === key)
}
