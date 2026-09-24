import { useEffect, useRef, useState, type ReactNode } from 'react'
import { useGame } from '../state/store'
import { back, go } from '../lib/router'
import { canSpeak, speak, stopSpeaking } from '../lib/speak'
import { savePhoto, usePhoto, deletePhoto } from '../state/photos'
import { denaru } from '../lib/format'
import type { Quiz } from '../data'
import { Coin, ColumnIcon, Compass, Seal, Star } from './Ornaments'

export function DenarPill({ amount, dark = true }: { amount: ReactNode; dark?: boolean }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 14px', borderRadius: 99, background: dark ? 'var(--bronze)' : 'var(--sand)', color: dark ? 'var(--parch)' : 'var(--ink)', fontWeight: 800, fontSize: 15 }}>
      <Coin size={18} />
      {amount}
    </div>
  )
}

export function TopBar({ right, dark, fallback }: { right?: ReactNode; dark?: boolean; fallback?: string }) {
  const { total } = useGame()
  return (
    <div className="pad-top" style={{ padding: `calc(var(--safe-top) + 44px) 20px 0`, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10, position: 'relative', zIndex: 3 }}>
      <button className={'icon-btn' + (dark ? ' dark' : '')} onClick={() => back(fallback)} aria-label="Zpět">←</button>
      {right ?? (
        <button onClick={() => go('pokladnice')} aria-label="Pokladnice">
          <DenarPill amount={total} />
        </button>
      )}
    </div>
  )
}

export function ReadAloud({ text, dark }: { text: string; dark?: boolean }) {
  const [on, setOn] = useState(false)
  useEffect(() => () => stopSpeaking(), [])
  if (!canSpeak) return null
  return (
    <button
      className={'icon-btn' + (dark ? ' dark' : '')}
      aria-label={on ? 'Zastavit předčítání' : 'Přečíst nahlas'}
      onClick={() => {
        if (on) stopSpeaking()
        else speak(text)
        setOn(!on)
        if (!on) setTimeout(() => setOn(false), Math.min(30000, text.length * 90))
      }}
    >
      <svg width="22" height="22" viewBox="0 0 24 24" aria-hidden>
        <path d="M4 9h4l5-4v14l-5-4H4z" fill="currentColor" />
        {on ? <path d="M16 9l5 6M21 9l-5 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /> : <path d="M16 8.5c1.5 1.8 1.5 5.2 0 7M18.5 6c3 3.2 3 8.8 0 12" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" />}
      </svg>
    </button>
  )
}

const TABS = [
  { id: 'domov', label: 'Domov', icon: (c: string) => <svg width="24" height="24" viewBox="0 0 24 24"><path d="M3 11L12 3l9 8v10h-6v-6H9v6H3z" fill={c} /></svg> },
  { id: 'mapa', label: 'Cesta', icon: () => <Compass size={24} /> },
  { id: 'mise', label: 'Mise', icon: (c: string) => <svg width="24" height="24" viewBox="0 0 24 24"><path d="M5 3h11l3 3v15H5z" fill={c} /><path d="M8 9h8M8 13h8M8 17h5" stroke="var(--bronze)" strokeWidth="1.8" /></svg> },
  { id: 'mista', label: 'Místa', icon: (c: string) => <ColumnIcon size={24} color={c} /> },
  { id: 'pokladnice', label: 'Poklad', icon: () => <Coin size={22} /> },
]

export function TabBar({ active }: { active: string }) {
  return (
    <nav className="tabbar no-print">
      {TABS.map((t) => {
        const on = active === t.id
        return (
          <button key={t.id} className={'tab' + (on ? ' on' : '')} onClick={() => go(t.id)} aria-current={on ? 'page' : undefined}>
            {t.icon(on ? 'var(--gold-hi)' : 'var(--ink-4)')}
            {t.label}
          </button>
        )
      })}
    </nav>
  )
}

// Okamžitá mikroodměna: mince, zvuk, přírůstek pokladnice
export function RewardToast() {
  const { reward, dismissReward } = useGame()
  useEffect(() => {
    if (!reward) return
    const t = setTimeout(dismissReward, 2600)
    return () => clearTimeout(t)
  }, [reward, dismissReward])
  if (!reward) return null
  return (
    <div key={reward.key} className="overlay" onClick={dismissReward} role="status" style={{ background: 'rgba(26,18,12,.55)' }}>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14 }}>
        <div style={{ position: 'relative', animation: 'coin-pop .6s cubic-bezier(.2,.8,.2,1) both' }}>
          <Star size={20} className="twinkle" style={{ position: 'absolute', left: -26, top: 6 }} />
          <Star size={14} className="twinkle" style={{ position: 'absolute', right: -20, top: -8, animationDelay: '.5s' }} />
          <Star size={12} className="twinkle" style={{ position: 'absolute', right: -24, bottom: 10, animationDelay: '1s' }} />
          <Coin size={124} glow label="SPQR" style={{ fontSize: 26, animation: 'coin-spin 1.2s ease-in-out .5s' }} />
        </div>
        <div className="cinzel rise" style={{ fontSize: 46, color: 'var(--gold-hi)', textShadow: '0 3px 0 var(--red-shadow)', animationDelay: '.2s' }}>+{reward.amount}</div>
        <div className="ribbon rise" style={{ animationDelay: '.3s' }}>{denaru(reward.amount)} do pokladnice</div>
      </div>
    </div>
  )
}

// Foto je vždy nepovinné – soukromí, baterie, situace
export function PhotoButton({ photoKey, label, compact }: { photoKey: string; label: string; compact?: boolean }) {
  const input = useRef<HTMLInputElement>(null)
  const photo = usePhoto(photoKey)
  const [busy, setBusy] = useState(false)
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      {photo && !compact && (
        <div style={{ position: 'relative', borderRadius: 18, overflow: 'hidden', boxShadow: '0 0 0 3px var(--gold-lt)' }}>
          <img src={photo.url} alt={label} style={{ width: '100%', maxHeight: 260, objectFit: 'cover', display: 'block' }} />
          <button onClick={() => void deletePhoto(photoKey)} className="icon-btn" style={{ position: 'absolute', right: 8, top: 8, width: 38, height: 38, fontSize: 16 }} aria-label="Smazat fotku">✕</button>
        </div>
      )}
      <input
        ref={input}
        type="file"
        accept="image/*"
        capture="environment"
        hidden
        onChange={async (e) => {
          const f = e.target.files?.[0]
          if (!f) return
          setBusy(true)
          try {
            await savePhoto(photoKey, label, f)
          } finally {
            setBusy(false)
            e.target.value = ''
          }
        }}
      />
      <button className="btn-sand" onClick={() => input.current?.click()} disabled={busy}>
        <svg width="22" height="22" viewBox="0 0 24 24" aria-hidden><path d="M4 7h3l2-3h6l2 3h3v13H4z" fill="var(--ink-3)" /><circle cx="12" cy="13" r="4" fill="var(--sand)" /></svg>
        {busy ? 'Ukládám…' : photo ? 'Vyfotit znovu' : 'Vyfotit (nepovinné)'}
      </button>
    </div>
  )
}

// Tipovačka: nic nesvítí červeně, správná odpověď se rozzáří zlatě a přijde vysvětlení
export function QuizOptions({ quiz, picked, onPick }: { quiz: Quiz; picked: number | null; onPick: (i: number) => void }) {
  const answered = picked !== null
  const nums = ['I', 'II', 'III', 'IV']
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      {quiz.options.map((label, i) => {
        const correct = i === quiz.correct
        let bg = '#FFFFFF'
        let shadow = 'var(--line)'
        if (answered && correct) { bg = 'var(--gold-lt)'; shadow = 'var(--gold-mid)' }
        else if (picked === i) { bg = 'var(--sand)'; shadow = 'var(--sand-shadow)' }
        return (
          <button
            key={i}
            disabled={answered}
            onClick={() => onPick(i)}
            style={{ minHeight: 62, borderRadius: 18, padding: '10px 14px', display: 'flex', alignItems: 'center', gap: 14, fontSize: 18, fontWeight: 700, textAlign: 'left', background: bg, color: 'var(--ink)', boxShadow: `0 4px 0 ${shadow}`, transition: 'background .3s' }}
          >
            <Seal size={36} style={{ fontSize: 14, boxShadow: 'inset 0 0 0 2px var(--red-ring)' }}>{nums[i]}</Seal>
            <span style={{ flex: 1 }}>{label}</span>
            {answered && correct && <Star size={18} color="var(--gold-deep)" />}
          </button>
        )
      })}
    </div>
  )
}

export function Feedback({ title, children }: { title: ReactNode; children: ReactNode }) {
  return (
    <div className="card-dark rise" style={{ padding: '16px 18px', display: 'flex', flexDirection: 'column', gap: 6, position: 'relative' }}>
      <Star size={16} style={{ position: 'absolute', right: 16, top: 14 }} />
      <div style={{ fontSize: 18, fontWeight: 800, color: 'var(--gold-hi)', paddingRight: 24 }}>{title}</div>
      <div style={{ fontSize: 15, lineHeight: 1.45, fontWeight: 500 }}>{children}</div>
    </div>
  )
}

export function RewardBadge({ amount, done }: { amount: number; done?: boolean }) {
  return (
    <span className="reward-num" style={done ? { color: 'var(--ink-4)' } : undefined}>
      {done ? <span style={{ fontSize: 16, color: 'var(--gold-mid)' }}>✓</span> : <Coin size={18} />}
      {done ? '' : '+'}{amount}
    </span>
  )
}

export const NOTE_LABEL = { legenda: 'Legenda', fakt: 'Historický fakt', nejistota: 'Nevíme jistě' } as const
