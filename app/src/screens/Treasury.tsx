import { useGame } from '../state/store'
import { go } from '../lib/router'
import { CHAPTERS, RANKS } from '../data'
import { czk, denaru } from '../lib/format'
import { Coin, Laurel, Rays, Seal, SealGlyph, Star } from '../components/Ornaments'
import { TabBar, TopBar } from '../components/UI'

// 07 v návrhu / 11 v briefu · Pokladnice
export function Treasury() {
  const { state, total } = useGame()
  const { showCzk, denarValue, budget } = state.settings
  const value = total * denarValue
  const shown = budget > 0 ? Math.min(value, budget) : value

  return (
    <div className="screen" style={{ background: 'radial-gradient(circle at 50% 22%,#FFF6DF,var(--trav) 60%)', overflow: 'hidden' }}>
      <Rays style={{ left: 'calc(50% - 240px)', top: -60 }} />
      <div className="screen-scroll" style={{ position: 'relative' }}>
        <div style={{ padding: 'calc(var(--safe-top) + 50px) 22px 0', textAlign: 'center' }} className="kicker">Společná pokladnice</div>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '14px 0 16px', gap: 4, position: 'relative' }}>
          <Star size={16} color="var(--gold)" className="twinkle" style={{ position: 'absolute', left: 'calc(50% - 125px)', top: 40 }} />
          <Star size={20} color="var(--gold)" className="twinkle" style={{ position: 'absolute', left: 'calc(50% + 95px)', top: 20, animationDelay: '.6s' }} />
          <Star size={10} color="var(--gold)" className="twinkle" style={{ position: 'absolute', left: 'calc(50% + 105px)', top: 130, animationDelay: '1.2s' }} />
          <div style={{ position: 'relative', width: 220, height: 160 }}>
            <Coin size={80} style={{ position: 'absolute', left: 10, top: 78, transform: 'rotate(-14deg)', boxShadow: 'inset 0 0 0 3px var(--gold-mid), inset 0 0 0 6px var(--gold-lt), 0 4px 0 var(--gold-deep)' }} />
            <Coin size={86} style={{ position: 'absolute', right: 8, top: 70, transform: 'rotate(12deg)', boxShadow: 'inset 0 0 0 3px var(--gold-mid), inset 0 0 0 6px var(--gold-lt), 0 4px 0 var(--gold-deep)' }} />
            <Coin size={124} label="SPQR" style={{ position: 'absolute', left: 50, top: 0, fontSize: 26, boxShadow: 'inset 0 0 0 4px var(--gold-mid), inset 0 0 0 8px var(--gold-lt), 0 5px 0 var(--gold-deep), 0 16px 26px rgba(42,29,20,.3), 0 0 40px rgba(248,222,147,.6)' }} />
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Laurel width={30} height={68} />
            <div className="cinzel" style={{ fontSize: 76, lineHeight: 1 }}>{total}</div>
            <Laurel width={30} height={68} flip />
          </div>
          <div style={{ fontSize: 18, fontWeight: 700, color: 'var(--ink-2)' }}>{denaru(total)}</div>
          {showCzk && (
            <div className="ribbon" style={{ marginTop: 6, padding: '6px 26px', clipPath: 'polygon(0 0,100% 0,93% 50%,100% 100%,0 100%,7% 50%)' }}>
              = {czk(shown)} Kč na odměnu{budget > 0 && value > budget ? ' (max.)' : ''}
            </div>
          )}
        </div>

        <div style={{ padding: '0 18px 24px', display: 'flex', flexDirection: 'column', gap: 8 }}>
          <div className="divider-title"><span>Naposledy získané</span></div>
          {state.ledger.length === 0 && (
            <div className="card-white" style={{ padding: 16, textAlign: 'center', fontWeight: 700 }}>Pokladnice čeká na první denár. Splňte misi!</div>
          )}
          {state.ledger.slice(0, 30).map((e) => (
            <div key={e.id + e.at} className="card-white row">
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                <span className="row-title">{e.label}</span>
                <span className="row-sub">{e.sub}</span>
              </div>
              <span className="reward-num" style={e.amount < 0 ? { color: 'var(--ink-3)' } : undefined}>
                <Coin size={18} />{e.amount > 0 ? '+' : ''}{e.amount}
              </span>
            </div>
          ))}
        </div>
      </div>
      <TabBar active="pokladnice" />
    </div>
  )
}

// 12 · Hodnosti a pečetě
export function Ranks() {
  const { state, total, rank, unlocked } = useGame()
  const unlockedIds = new Set(unlocked.map((c) => c.id))
  return (
    <div className="screen bg-trav-c">
      <TopBar />
      <div className="screen-scroll">
        <div style={{ padding: '16px 20px 8px', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
          <div className="kicker">Vaše hodnost</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Laurel width={30} height={68} />
            <Seal size={80} style={{ fontSize: 26 }}>{rank.numeral}</Seal>
            <Laurel width={30} height={68} flip />
          </div>
          <h1 className="deco" style={{ fontSize: 28 }}>{rank.name}</h1>
        </div>

        <div style={{ padding: '8px 18px', display: 'flex', flexDirection: 'column', gap: 8 }}>
          <div className="divider-title"><span>Cesta hodností</span></div>
          {RANKS.map((r, i) => {
            const reached = r.id === 'strazce' ? !!state.finale : total >= r.at
            const isCur = r.id === rank.id
            return (
              <div key={r.id} className="card-white row" style={{ opacity: reached ? 1 : 0.6, boxShadow: isCur ? 'inset 0 0 0 2px var(--gold)' : undefined }}>
                {reached ? <Seal size={40} style={{ fontSize: 14 }}>{r.numeral}</Seal> : <div style={{ width: 40, height: 40, borderRadius: '50%', border: '3px dashed var(--path)', flex: 'none' }} />}
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                  <span className="row-title">{r.singular}</span>
                  <span className="row-sub">{r.id === 'strazce' ? 'po rozluštění velké šifry' : i === 0 ? 'začátek výpravy' : `od ${r.at} ${denaru(r.at)}`}</span>
                </div>
                {isCur && <span className="ribbon sm">VY</span>}
              </div>
            )
          })}
        </div>

        <div style={{ padding: '16px 18px 28px' }}>
          <div className="divider-title" style={{ marginBottom: 12 }}><span>Pečetě</span></div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 14 }}>
            {CHAPTERS.map((c) => {
              const open = unlockedIds.has(c.id) && state.revealed.includes(c.id)
              return (
                <button key={c.id} onClick={() => go(open ? 'mise/' + c.id : 'tajemstvi/' + c.id)} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
                  {open ? (
                    <Seal size={62}><SealGlyph icon={c.icon} size={28} /></Seal>
                  ) : (
                    <div style={{ width: 62, height: 62, borderRadius: '50%', border: '3px dashed var(--path)', background: '#EFE0C0', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--f-cinzel)', fontWeight: 900, color: 'var(--path)' }}>{c.numeral}</div>
                  )}
                  <span style={{ fontSize: 11, fontWeight: 800, textAlign: 'center', lineHeight: 1.2, color: open ? 'var(--ink)' : 'var(--ink-4)' }}>{open ? c.name : '? ? ?'}</span>
                </button>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
