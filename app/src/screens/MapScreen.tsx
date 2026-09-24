import type { ReactNode } from 'react'
import { useGame } from '../state/store'
import { go } from '../lib/router'
import { CHAPTERS } from '../data'
import { denaru } from '../lib/format'
import { Coin, Compass, Keyhole, Laurel, Seal, Star } from '../components/Ornaments'
import { TabBar } from '../components/UI'

const W = 334
const STEP = 95
const xs = [100, 240]

// 03 · Mapa putování – svitek s pečetěmi, ne geografická mapa
export function MapScreen() {
  const { state, total, unlocked } = useGame()
  const unlockedIds = new Set(unlocked.map((c) => c.id))
  const current = unlocked[unlocked.length - 1]
  const firstLocked = CHAPTERS.find((c) => !unlockedIds.has(c.id))

  const nodes = CHAPTERS.map((c, i) => ({ c, x: xs[i % 2], y: 50 + i * STEP }))
  const finalY = 50 + CHAPTERS.length * STEP + 10
  const pts = [...nodes.map((n) => [n.x, n.y]), [167, finalY]]
  const d = pts.reduce((acc, [x, y], i) => {
    if (i === 0) return `M${x} ${y}`
    const [px, py] = pts[i - 1]
    const my = (py + y) / 2
    return `${acc} C ${px} ${my}, ${x} ${my}, ${x} ${y}`
  }, '')
  const height = finalY + 110

  const label = (x: number, y: number, r: number, children: ReactNode, opacity = 1) =>
    x < W / 2 ? (
      <div style={{ position: 'absolute', left: x + r + 12, top: y - 20, right: 8, display: 'flex', flexDirection: 'column', opacity }}>{children}</div>
    ) : (
      <div style={{ position: 'absolute', left: 8, width: x - r - 20, top: y - 20, textAlign: 'right', display: 'flex', flexDirection: 'column', alignItems: 'flex-end', opacity }}>{children}</div>
    )

  return (
    <div className="screen bg-bronze">
      <div style={{ padding: 'calc(var(--safe-top) + 50px) 22px 14px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <div className="kicker gold">Svitek výpravy</div>
          <h1 className="deco" style={{ fontSize: 26 }}>Cesta Strážců</h1>
        </div>
        <Compass />
      </div>
      <div className="rod" style={{ height: 22, margin: '0 8px', borderRadius: 11, boxShadow: '0 3px 6px rgba(0,0,0,.4)', zIndex: 2 }} />
      <div className="screen-scroll" style={{ margin: '-8px 18px', background: 'radial-gradient(circle at 30% 30%,#FBF1DA,#E9D7B2 80%)', boxShadow: 'inset 0 0 30px rgba(122,90,58,.35)', color: 'var(--ink)' }}>
        <div style={{ position: 'relative', width: W, height, margin: '0 auto' }}>
          <svg style={{ position: 'absolute', left: 0, top: 0 }} width={W} height={height} aria-hidden>
            <path d={d} fill="none" stroke="var(--path)" strokeWidth="3.5" strokeDasharray="2 9" strokeLinecap="round" />
          </svg>
          <Star size={14} color="var(--gold)" style={{ position: 'absolute', left: 280, top: 40 }} />
          <Star size={10} color="var(--gold)" style={{ position: 'absolute', left: 30, top: 330 }} />
          <Star size={12} color="var(--gold)" style={{ position: 'absolute', left: 290, top: 600 }} />

          {nodes.map(({ c, x, y }) => {
            const isOpen = unlockedIds.has(c.id)
            if (isOpen && c.id === current.id) {
              return (
                <div key={c.id}>
                  <div aria-hidden className="rays-spin" style={{ position: 'absolute', left: x - 48, top: y - 48, width: 96, height: 96, borderRadius: '50%', background: 'repeating-conic-gradient(rgba(248,222,147,.7) 0 8deg, transparent 8deg 30deg)', WebkitMask: 'radial-gradient(circle, transparent 38%, #000 40%)', mask: 'radial-gradient(circle, transparent 38%, #000 40%)', opacity: 0.8 }} />
                  <button onClick={() => go(c.id === 'sifra' ? 'finale' : 'mise/' + c.id)} style={{ position: 'absolute', left: x - 40, top: y - 40 }} aria-label={c.name}>
                    <Coin size={80} label={c.numeral} style={{ fontSize: 22, boxShadow: 'inset 0 0 0 4px var(--gold-mid), inset 0 0 0 7px var(--gold-lt), 0 0 0 6px rgba(200,150,46,.3), 0 4px 0 var(--gold-deep)' }} />
                  </button>
                  {label(x, y + 10, 40, (
                    <>
                      <span className="ribbon sm" style={{ alignSelf: x < W / 2 ? 'flex-start' : 'flex-end', marginBottom: 4 }}>JSTE TADY</span>
                      <span style={{ fontSize: 17, fontWeight: 800, color: 'var(--red-text)' }}>{c.name}</span>
                    </>
                  ))}
                </div>
              )
            }
            if (isOpen) {
              return (
                <div key={c.id}>
                  <button onClick={() => go('mise/' + c.id)} style={{ position: 'absolute', left: x - 30, top: y - 30 }} aria-label={c.name}>
                    <Seal size={60}>{c.numeral}</Seal>
                  </button>
                  {label(x, y + 10, 30, (
                    <>
                      <span style={{ fontSize: 16, fontWeight: 800 }}>{c.name}</span>
                      <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--ink-3)' }}>zpečetěno</span>
                    </>
                  ))}
                </div>
              )
            }
            if (c.id === firstLocked?.id) {
              return (
                <div key={c.id}>
                  <button onClick={() => go('tajemstvi/' + c.id)} style={{ position: 'absolute', left: x - 34, top: y - 34, width: 68, height: 68, borderRadius: '50%', background: 'var(--bronze)', boxShadow: 'inset 0 0 0 3px var(--gold), 0 0 20px rgba(200,150,46,.45)', display: 'flex', alignItems: 'center', justifyContent: 'center' }} aria-label="Tajná mise">
                    <Keyhole />
                  </button>
                  {label(x, y + 8, 34, (
                    <>
                      <span style={{ fontSize: 16, fontWeight: 800 }}>Tajná mise</span>
                      <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--ink-3)' }}>za {c.unlockAt} {denaru(c.unlockAt)}</span>
                    </>
                  ))}
                </div>
              )
            }
            return (
              <div key={c.id}>
                <button onClick={() => go('tajemstvi/' + c.id)} style={{ position: 'absolute', left: x - 26, top: y - 26, width: 52, height: 52, borderRadius: '50%', border: '3px dashed var(--path)', background: '#EFE0C0' }} aria-label="Neznámá pečeť" />
                {label(x, y + 6, 26, (
                  <>
                    <span style={{ fontSize: 16, fontWeight: 800, letterSpacing: '.2em' }}>? ? ?</span>
                    <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--ink-3)' }}>{c.unlockAt} {denaru(c.unlockAt)}</span>
                  </>
                ), 0.7)}
              </div>
            )
          })}

          <button onClick={() => go(state.finale ? 'certifikat' : unlockedIds.has('sifra') ? 'finale' : 'hodnosti')} style={{ position: 'absolute', left: 107, top: finalY - 40, width: 120, height: 80, display: 'flex', alignItems: 'center', justifyContent: 'center' }} aria-label="Finále">
            <Laurel width={34} height={76} style={{ position: 'absolute', left: 4, top: 0 }} />
            <Laurel width={34} height={76} flip style={{ position: 'absolute', right: 4, top: 0 }} />
            {state.finale ? (
              <Coin size={56} label="SPQR" style={{ fontSize: 13 }} />
            ) : (
              <div style={{ width: 56, height: 56, borderRadius: '50%', border: '3px dashed var(--path)', background: '#EFE0C0', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--f-cinzel)', fontWeight: 900, fontSize: 13, color: 'var(--path)' }}>SPQR</div>
            )}
          </button>
          <div className="deco" style={{ position: 'absolute', left: 0, right: 0, top: finalY + 46, textAlign: 'center', fontSize: 15, color: 'var(--ink-3)' }}>Strážci Říma</div>
          <div style={{ position: 'absolute', left: 0, right: 0, top: finalY + 70, textAlign: 'center', fontSize: 13, fontWeight: 700, color: 'var(--ink-3)' }}>{total} {denaru(total)} v pokladnici</div>
        </div>
      </div>
      <div className="rod" style={{ height: 22, margin: '0 8px 10px', borderRadius: 11, boxShadow: '0 -3px 6px rgba(0,0,0,.3)', zIndex: 2 }} />
      <TabBar active="mapa" />
    </div>
  )
}
