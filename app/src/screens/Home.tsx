import { useGame } from '../state/store'
import { go } from '../lib/router'
import { ALL_MISSIONS, CHAPTERS } from '../data'
import { denaru, todayKey } from '../lib/format'
import { ColumnIcon, CompassIcon, Laurel, Meander, Seal, Star, Coin } from '../components/Ornaments'
import { LupaSays } from '../components/Illustrations'
import { TabBar } from '../components/UI'

// 02 · Domov (v návrhu) / 03 v briefu
export function Home() {
  const { state, total, rank, unlocked, next, pendingReveal } = useGame()
  const [a, b] = state.settings.names

  // Kapitola, ve které se pokračuje: nejvyšší odemčená, kde zbývají mise
  const chapterLeft = (id: string) => ALL_MISSIONS.filter((m) => m.world === id && !state.done[m.id]).length
  const current = [...unlocked].reverse().find((c) => c.id !== 'sifra' && chapterLeft(c.id) > 0) ?? unlocked[unlocked.length - 1]
  // Dokud rodina nedorazila k první památce, je hlavní úkol cesta a letiště
  const onTheWay = chapterLeft('cesta') > 0 && Object.keys(state.visited).length === 0
  const focus = onTheWay ? { id: 'cesta', name: 'Cesta a letiště' } : current
  const focusLeft = focus ? chapterLeft(focus.id) : 0
  const upNext = focus ? ALL_MISSIONS.filter((m) => m.world === focus.id && !state.done[m.id]).slice(0, 3) : []

  const prevAt = next ? [...CHAPTERS].reverse().find((c) => c.unlockAt <= total)?.unlockAt ?? 0 : 0
  const pct = next ? Math.round(((total - prevAt) / (next.unlockAt - prevAt)) * 100) : 100
  const hour = new Date().getHours()
  const bossDone = !!state.boss[todayKey()]
  const finaleOpen = unlocked.some((c) => c.id === 'sifra')

  const lupa = pendingReveal
    ? 'Slyšíte to? Právě se odemklo něco tajného!'
    : state.finale
      ? `Strážci Říma ${a} a ${b}! Město je ve vašich rukou.`
      : finaleOpen
        ? 'Všechny pečetě jsou vaše. Čeká na vás velká šifra!'
        : hour >= 17 && !bossDone
          ? 'Večer přichází. Troufnete si na boss fight?'
          : onTheWay
            ? 'Vzhůru na cestu! Než dorazíme do Říma, zkuste úkoly na letišti.'
            : current?.teaser ?? 'Kam se dnes vydáme?'

  return (
    <div className="screen bg-trav">
      <div className="screen-scroll">
        <div style={{ padding: 'calc(var(--safe-top) + 50px) 20px 0', display: 'flex', alignItems: 'center', gap: 10 }}>
          <button onClick={() => go('hodnosti')} style={{ position: 'relative', width: 74, height: 66, display: 'flex', alignItems: 'center', justifyContent: 'center' }} aria-label="Hodnosti a pečetě">
            <Laurel style={{ position: 'absolute', left: 0, top: 2 }} />
            <Laurel flip style={{ position: 'absolute', right: 0, top: 2 }} />
            <Seal size={46} style={{ fontSize: 17, boxShadow: 'inset 0 0 0 3px var(--red-ring), inset 0 0 0 5px rgba(255,220,200,.35), 0 3px 6px rgba(0,0,0,.25)' }}>{rank.numeral}</Seal>
          </button>
          <button onClick={() => go('hodnosti')} style={{ display: 'flex', flexDirection: 'column', flex: 1, textAlign: 'left' }}>
            <div className="kicker">Hodnost</div>
            <div className="deco" style={{ fontSize: 21 }}>{rank.name}</div>
          </button>
          <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--ink-2)', textAlign: 'right' }}>{a}<br />&amp; {b}</div>
        </div>

        <LupaSays style={{ margin: '14px 18px 0' }}>{lupa}</LupaSays>

        <button onClick={() => go('pokladnice')} style={{ display: 'block', width: 'calc(100% - 36px)', margin: '14px 18px 0', borderRadius: 24, background: 'var(--bronze)', color: 'var(--parch)', position: 'relative', overflow: 'hidden', textAlign: 'left' }}>
          <Meander id="mq-home" />
          <Star style={{ position: 'absolute', right: 26, top: 30 }} className="twinkle" />
          <Star size={8} color="var(--gold-lt)" style={{ position: 'absolute', right: 60, top: 56 }} />
          <div style={{ padding: '16px 20px 18px', display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
              <Coin size={70} label="D" style={{ fontSize: 24, boxShadow: 'inset 0 0 0 3px var(--gold-mid), inset 0 0 0 6px var(--gold-lt), 0 3px 0 var(--gold-deep), 0 0 26px rgba(248,222,147,.35)' }} />
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <div className="kicker gold" style={{ letterSpacing: '.14em' }}>Společná pokladnice</div>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
                  <span className="cinzel" style={{ fontSize: 46, lineHeight: 1 }}>{total}</span>
                  <span style={{ fontSize: 17, fontWeight: 700, color: 'var(--sand)' }}>{denaru(total)}</span>
                </div>
              </div>
            </div>
            {next ? (
              <>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div className="progress" style={{ flex: 1 }}><div style={{ width: pct + '%' }} /></div>
                  <span
                    onClick={(e) => { e.stopPropagation(); go('tajemstvi/' + next.id) }}
                    style={{ width: 30, height: 30, borderRadius: '50%', background: 'var(--bronze-deep)', boxShadow: 'inset 0 0 0 2px var(--gold)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--f-cinzel)', fontWeight: 900, fontSize: 15, color: 'var(--gold)' }}
                  >?</span>
                </div>
                <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--sand)', marginTop: -6 }}>
                  Ještě {next.unlockAt - total} {denaru(next.unlockAt - total)} do tajemství
                </div>
              </>
            ) : (
              <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--sand)' }}>Všechna tajemství jsou odemčená!</div>
            )}
          </div>
        </button>

        <div style={{ padding: '16px 18px 20px', display: 'flex', flexDirection: 'column', gap: 12 }}>
          {pendingReveal ? (
            <button onClick={() => go('tajemstvi/' + pendingReveal.id)} className="shake" style={{ minHeight: 86, borderRadius: 22, background: 'var(--bronze)', boxShadow: 'inset 0 0 0 4px var(--bronze), inset 0 0 0 6px var(--gold-lt), 0 5px 0 var(--bronze-deep)', padding: '0 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: 'var(--gold-hi)', textAlign: 'left' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <span style={{ fontSize: 21, fontWeight: 800 }}>Odemkněte tajemství!</span>
                <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--sand)' }}>Pečeť {pendingReveal.numeral} se otevírá</span>
              </div>
              <Star size={28} className="twinkle" />
            </button>
          ) : finaleOpen && !state.finale ? (
            <button onClick={() => go('finale')} className="btn-primary" style={{ minHeight: 86, borderRadius: 22, justifyContent: 'space-between', padding: '0 24px', textAlign: 'left' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <span style={{ fontSize: 21, fontWeight: 800 }}>Velké finále</span>
                <span style={{ fontSize: 14, fontWeight: 600, color: '#F6CFC4' }}>Rozluštěte římskou šifru</span>
              </div>
              <span style={{ fontSize: 28, color: 'var(--gold-hi)' }}>→</span>
            </button>
          ) : (
            <button onClick={() => go('mise/' + (focus?.id ?? ''))} className="btn-primary" style={{ minHeight: 86, borderRadius: 22, boxShadow: 'inset 0 0 0 4px var(--red), inset 0 0 0 6px var(--gold-lt), 0 5px 0 var(--red-shadow)', justifyContent: 'space-between', padding: '0 24px', textAlign: 'left' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <span style={{ fontSize: 21, fontWeight: 800 }}>Pokračovat v cestě</span>
                <span style={{ fontSize: 14, fontWeight: 600, color: '#F6CFC4' }}>
                  {focus?.name} · {focusLeft} {focusLeft >= 1 && focusLeft <= 4 ? 'mise' : 'misí'}
                </span>
              </div>
              <span style={{ fontSize: 28, fontWeight: 800, color: 'var(--gold-hi)' }}>→</span>
            </button>
          )}

          {upNext.length > 0 && !pendingReveal && !(finaleOpen && !state.finale) && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <div className="divider-title"><span>Na řadě</span></div>
              {upNext.map((m) => (
                <button key={m.id} onClick={() => go('mise-detail/' + m.id)} className="card-white row" style={{ minHeight: 52 }}>
                  <span style={{ flex: 1, fontWeight: 800, fontSize: 16 }}>{m.title}</span>
                  <span className="reward-num" style={{ fontSize: 17 }}><Coin size={16} />+{m.reward}</span>
                </button>
              ))}
            </div>
          )}

          {hour >= 17 && !bossDone && (
            <button onClick={() => go('boss')} className="card-dark row" style={{ borderRadius: 18 }}>
              <Seal size={34} style={{ fontSize: 12 }}>X</Seal>
              <span style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                <span style={{ fontWeight: 800, fontSize: 15 }}>Večerní boss fight</span>
                <span className="row-sub" style={{ color: 'var(--sand)' }}>5 otázek z dnešního dne · až 10 denárů</span>
              </span>
              <span style={{ color: 'var(--gold-hi)', fontWeight: 800 }}>→</span>
            </button>
          )}

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <button onClick={() => go('mista')} className="tile">
              <ColumnIcon />
              <span style={{ fontSize: 18, fontWeight: 800 }}>Památky</span>
            </button>
            <button onClick={() => go('mise')} className="tile">
              <CompassIcon />
              <span style={{ fontSize: 18, fontWeight: 800 }}>Všechny mise</span>
            </button>
          </div>
          {state.finale && (
            <button className="btn-dark" onClick={() => go('certifikat')}><Star size={16} />Certifikát Strážců</button>
          )}
        </div>
      </div>
      <TabBar active="domov" />
    </div>
  )
}
