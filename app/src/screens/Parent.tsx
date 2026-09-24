import { useState, type ReactNode } from 'react'
import { useGame } from '../state/store'
import { go } from '../lib/router'
import { PLACES } from '../data'
import { czk, denaru } from '../lib/format'
import { clearPhotos } from '../state/photos'
import { BackupSection } from './Backup'
import { Coin } from '../components/Ornaments'
import { TopBar } from '../components/UI'

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="card-white" style={{ padding: 16, display: 'flex', flexDirection: 'column', gap: 12 }}>
      <h2 className="kicker brown">{title}</h2>
      {children}
    </section>
  )
}

function Toggle({ on, onChange, label }: { on: boolean; onChange: (v: boolean) => void; label: string }) {
  return (
    <button onClick={() => onChange(!on)} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, minHeight: 44, textAlign: 'left', width: '100%' }} role="switch" aria-checked={on}>
      <span style={{ fontWeight: 700, fontSize: 16 }}>{label}</span>
      <span style={{ width: 54, height: 32, borderRadius: 16, background: on ? 'var(--red)' : 'var(--line)', position: 'relative', transition: 'background .2s', flex: 'none' }}>
        <span style={{ position: 'absolute', top: 3, left: on ? 25 : 3, width: 26, height: 26, borderRadius: '50%', background: '#fff', boxShadow: '0 1px 3px rgba(0,0,0,.3)', transition: 'left .2s' }} />
      </span>
    </button>
  )
}

// Nenápadná brána, aby se děti do nastavení nedostaly omylem
function Gate({ onPass }: { onPass: () => void }) {
  const [v, setV] = useState('')
  const ok = v.trim() === '56'
  return (
    <div style={{ padding: '24px 22px', display: 'flex', flexDirection: 'column', gap: 14 }}>
      <h1 className="deco" style={{ fontSize: 26 }}>Pro rodiče</h1>
      <p style={{ fontSize: 16, fontWeight: 600, color: 'var(--ink-2)', lineHeight: 1.45 }}>Nastavení ekonomiky hry a ruční korekce. Pro vstup vyřešte příklad:</p>
      <label style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        <span style={{ fontSize: 22, fontWeight: 800 }}>7 × 8 = ?</span>
        <input className="field" inputMode="numeric" value={v} onChange={(e) => setV(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && ok && onPass()} autoFocus />
      </label>
      <button className="btn-primary" disabled={!ok} onClick={onPass}>Vstoupit</button>
    </div>
  )
}

// 17 · Rodičovské nastavení
export function Parent() {
  const { state, total, settings, adjust, visit, unvisit, reset } = useGame()
  const [pass, setPass] = useState(false)
  const [amount, setAmount] = useState(5)
  const [note, setNote] = useState('')
  const [confirmReset, setConfirmReset] = useState(0)
  const s = state.settings

  if (!pass) {
    return (
      <div className="screen bg-trav-c">
        <TopBar right={<span />} fallback="" />
        <Gate onPass={() => setPass(true)} />
      </div>
    )
  }

  return (
    <div className="screen bg-trav-c">
      <TopBar right={<span className="kicker brown">Rodičovské nastavení</span>} />
      <div className="screen-scroll">
        <div style={{ padding: '16px 18px 32px', display: 'flex', flexDirection: 'column', gap: 14 }}>
          <Section title="Jména průzkumníků">
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
              {[0, 1].map((k) => (
                <input key={k} className="field" value={s.names[k]} onChange={(e) => {
                  const names = [...s.names] as [string, string]
                  names[k] = e.target.value
                  settings({ names })
                }} />
              ))}
            </div>
          </Section>

          <Section title="Ekonomika hry">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10 }}>
              <span style={{ fontWeight: 700, fontSize: 16 }}>1 denár =</span>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <button className="icon-btn" onClick={() => settings({ denarValue: Math.max(1, s.denarValue - 1) })}>−</button>
                <input className="field" inputMode="numeric" value={s.denarValue} onChange={(e) => settings({ denarValue: Math.max(1, Math.min(1000, Number(e.target.value.replace(/\D/g, '')) || 1)) })} style={{ width: 70, textAlign: 'center', fontWeight: 800 }} />
                <button className="icon-btn" onClick={() => settings({ denarValue: Math.min(1000, s.denarValue + 1) })}>+</button>
                <span style={{ fontWeight: 700 }}>Kč</span>
              </div>
            </div>
            <Toggle on={s.showCzk} onChange={(v) => settings({ showCzk: v })} label="Ukazovat dětem přepočet na Kč" />
            <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10 }}>
              <span style={{ fontWeight: 700, fontSize: 16 }}>Rozpočet (max. Kč, 0 = bez limitu)</span>
              <input className="field" inputMode="numeric" value={s.budget} onChange={(e) => settings({ budget: Number(e.target.value.replace(/\D/g, '')) || 0 })} style={{ width: 100, textAlign: 'center', fontWeight: 800 }} />
            </label>
            <p style={{ fontSize: 14, color: 'var(--ink-2)', fontWeight: 600 }}>
              Teď v pokladnici: <b>{total} {denaru(total)}</b> = {czk(total * s.denarValue)} Kč{s.budget > 0 && total * s.denarValue > s.budget ? ` (vyplatí se max. ${czk(s.budget)} Kč)` : ''}
            </p>
          </Section>

          <Section title="Ruční úprava denárů">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10 }}>
              <button className="icon-btn" onClick={() => setAmount(amount - 1)}>−</button>
              <span className="cinzel" style={{ fontSize: 34, minWidth: 80, textAlign: 'center' }}>{amount > 0 ? '+' : ''}{amount}</span>
              <button className="icon-btn" onClick={() => setAmount(amount + 1)}>+</button>
            </div>
            <input className="field" placeholder="Důvod (uvidí děti v pokladnici)" value={note} onChange={(e) => setNote(e.target.value)} />
            <button className="btn-dark" disabled={amount === 0} onClick={() => { adjust(amount, note.trim() || (amount > 0 ? 'Bonus od rodičů' : 'Oprava od rodičů')); setNote('') }}>
              <Coin size={18} /> {amount >= 0 ? 'Přidat' : 'Odebrat'} {Math.abs(amount)} {denaru(amount)}
            </button>
          </Section>

          <Section title="Navštívená místa">
            <p style={{ fontSize: 14, color: 'var(--ink-2)', fontWeight: 600 }}>Označení tady nepřidává denáry. Děti je dostanou tlačítkem „Jsme tady“.</p>
            {PLACES.map((p) => (
              <Toggle key={p.id} on={!!state.visited[p.id]} onChange={(v) => (v ? visit(p.id, 0, p.name) : unvisit(p.id))} label={p.name} />
            ))}
          </Section>

          <Section title="Datum výpravy (na certifikát)">
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
              <input className="field" type="date" value={s.tripStart} onChange={(e) => settings({ tripStart: e.target.value })} />
              <input className="field" type="date" value={s.tripEnd} onChange={(e) => settings({ tripEnd: e.target.value })} />
            </div>
          </Section>

          <Section title="Instalace do telefonu">
            <p style={{ fontSize: 14, color: 'var(--ink-2)', fontWeight: 600, lineHeight: 1.5 }}>
              iPhone: v Safari tlačítko Sdílet → „Přidat na plochu“. Android: v Chrome menu ⋮ → „Nainstalovat aplikaci“. Hra pak funguje i bez internetu a postup zůstává v telefonu.
            </p>
          </Section>

          <BackupSection />

          <Section title="Začít znovu">
            <p style={{ fontSize: 14, color: 'var(--ink-2)', fontWeight: 600 }}>Smaže denáry, splněné mise, pečetě a fotky. Nastavení zůstane. Stav před resetem se uloží do zálohy, takže jde vrátit.</p>
            <button
              className="btn-sand"
              style={confirmReset ? { background: 'var(--red)', color: '#fff', boxShadow: '0 4px 0 var(--red-shadow)' } : undefined}
              onClick={async () => {
                if (!confirmReset) return setConfirmReset(1)
                reset(state)
                await clearPhotos().catch(() => {})
                setConfirmReset(0)
                go('')
              }}
            >
              {confirmReset ? 'Opravdu smazat celý postup?' : 'Resetovat hru'}
            </button>
            {confirmReset > 0 && <button className="btn-link" onClick={() => setConfirmReset(0)}>Ne, nechat být</button>}
          </Section>
        </div>
      </div>
    </div>
  )
}
