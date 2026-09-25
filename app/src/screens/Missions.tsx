import { useState, type ReactNode } from 'react'
import { useGame } from '../state/store'
import { go } from '../lib/router'
import { ALL_MISSIONS, CHAPTERS, FILTERS, KIND_LABEL, SIDE_WORLDS, placeById, type Filter, type Mission } from '../data'
import { Keyhole, Seal, SealGlyph } from '../components/Ornaments'
import { RewardBadge, TabBar, TopBar } from '../components/UI'

const clamp2 = { display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' } as const

export function MissionCard({ m, hidePlace }: { m: Mission; hidePlace?: boolean }) {
  const { state } = useGame()
  const done = !!state.done[m.id]
  const place = m.place ? placeById(m.place) : undefined
  return (
    <button onClick={() => go('mise-detail/' + m.id)} className="card-white row" style={{ opacity: done ? 0.6 : 1, alignItems: 'flex-start' }}>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 3 }}>
        <span className="row-title">{m.title}</span>
        <span className="row-sub" style={{ lineHeight: 1.35, ...clamp2 }}>{m.task}</span>
        <span style={{ fontSize: 11, fontWeight: 800, letterSpacing: '.08em', textTransform: 'uppercase', color: 'var(--ink-4)' }}>
          {KIND_LABEL[m.kind]}{place && !hidePlace ? ` · ${place.name}` : ''}
        </span>
      </div>
      <div style={{ paddingTop: 2 }}>
        <RewardBadge amount={m.reward} done={done} />
      </div>
    </button>
  )
}

// Seznam jen s nesplněnými úkoly; splněné se samy schovají do sbalené části dole
export function MissionList({ list, hidePlace, emptyText }: { list: Mission[]; hidePlace?: boolean; emptyText?: string }) {
  const { state } = useGame()
  const [showDone, setShowDone] = useState(false)
  const todo = list.filter((m) => !state.done[m.id])
  const done = list.filter((m) => state.done[m.id])
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      {todo.map((m) => <MissionCard key={m.id} m={m} hidePlace={hidePlace} />)}
      {todo.length === 0 && (
        <div className="card-sand" style={{ padding: 18, fontWeight: 700, textAlign: 'center' }}>{emptyText ?? 'Všechno splněno. Skvělá práce, strážci!'}</div>
      )}
      {done.length > 0 && (
        <button onClick={() => setShowDone(!showDone)} style={{ alignSelf: 'center', padding: '10px 14px', fontSize: 14, fontWeight: 800, color: 'var(--ink-3)' }}>
          ✓ Splněno {done.length} {showDone ? '▴ schovat' : '▾ ukázat'}
        </button>
      )}
      {showDone && done.map((m) => <MissionCard key={m.id} m={m} hidePlace={hidePlace} />)}
    </div>
  )
}

function WorldCard({ id, name, icon }: { id: string; name: string; icon?: ReactNode }) {
  const { state } = useGame()
  const all = ALL_MISSIONS.filter((m) => m.world === id)
  const todo = all.filter((m) => !state.done[m.id])
  const pct = Math.round(((all.length - todo.length) / all.length) * 100)
  return (
    <button onClick={() => go('mise/' + id)} className="card-white row" style={{ alignItems: 'center', gap: 14 }}>
      {icon}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 5, minWidth: 0 }}>
        <span style={{ display: 'flex', justifyContent: 'space-between', gap: 8 }}>
          <span className="row-title">{name}</span>
          <span style={{ fontSize: 13, fontWeight: 800, color: 'var(--ink-3)', whiteSpace: 'nowrap' }}>zbývá {todo.length}</span>
        </span>
        <div className="progress" style={{ height: 8, background: 'var(--line)' }}><div style={{ width: pct + '%' }} /></div>
        {todo[0] && <span className="row-sub" style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>Další: {todo[0].title}</span>}
      </div>
      <span style={{ color: 'var(--gold-dk)', fontWeight: 800, fontSize: 20 }}>›</span>
    </button>
  )
}

// 05 · Knihovna misí: přehled okruhů, nebo výpis jednoho okruhu (#/mise/<id>)
export function Missions({ world }: { world?: string }) {
  const { state, unlocked } = useGame()
  const [filter, setFilter] = useState<Filter | null>(null)
  const chapter = CHAPTERS.find((c) => c.id === world)
  const side = SIDE_WORLDS.find((w) => w.id === world)
  const openWorlds = new Set([...unlocked.map((c) => c.id), ...SIDE_WORLDS.map((w) => w.id)])
  const left = (id: string) => ALL_MISSIONS.filter((m) => m.world === id && !state.done[m.id]).length
  const lockedCount = ALL_MISSIONS.filter((m) => m.world !== 'misto' && !openWorlds.has(m.world)).length

  if (world) {
    const list = ALL_MISSIONS.filter((m) => m.world === world)
    const nextWorld = [...unlocked.filter((c) => c.id !== 'sifra'), ...SIDE_WORLDS].find((w) => w.id !== world && left(w.id) > 0)
    return (
      <div className="screen bg-trav-c">
        <TopBar fallback="mise" />
        <div className="screen-scroll">
          <div style={{ padding: '16px 20px 12px', display: 'flex', alignItems: 'center', gap: 14 }}>
            {chapter && <Seal size={56}><SealGlyph icon={chapter.icon} size={26} /></Seal>}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <div className="kicker">{chapter ? `Kapitola ${chapter.numeral}` : 'Side quest'} · zbývá {left(world)}</div>
              <h1 className="deco" style={{ fontSize: 26, lineHeight: 1.1 }}>{chapter?.name ?? side?.name ?? 'Mise'}</h1>
            </div>
          </div>
          <div style={{ padding: '0 18px 24px' }}>
            <MissionList list={list} />
            {left(world) === 0 && nextWorld && (
              <button className="btn-dark" style={{ marginTop: 12 }} onClick={() => go('mise/' + nextWorld.id)}>Pokračovat: {nextWorld.name} →</button>
            )}
          </div>
        </div>
        <TabBar active="mise" />
      </div>
    )
  }

  const chapters = [...unlocked].reverse().filter((c) => c.id !== 'sifra')
  const activeWorlds = [...chapters, ...SIDE_WORLDS].filter((w) => left(w.id) > 0)
  const finishedWorlds = [...chapters, ...SIDE_WORLDS].filter((w) => left(w.id) === 0)
  const filtered = filter ? ALL_MISSIONS.filter((m) => openWorlds.has(m.world) && m.tags.includes(filter)) : []

  return (
    <div className="screen bg-trav-c">
      <TopBar fallback="domov" />
      <div className="screen-scroll">
        <div style={{ padding: '16px 20px 4px' }}>
          <div className="kicker">Vyberte si, co teď</div>
          <h1 className="deco" style={{ fontSize: 26, lineHeight: 1.1 }}>Knihovna misí</h1>
        </div>

        <div style={{ display: 'flex', gap: 8, overflowX: 'auto', padding: '12px 18px 6px', scrollbarWidth: 'none' }}>
          <button className={'chip' + (filter === null ? ' on' : '')} onClick={() => setFilter(null)}>Okruhy</button>
          {FILTERS.map((f) => (
            <button key={f.id} className={'chip' + (filter === f.id ? ' on' : '')} onClick={() => setFilter(filter === f.id ? null : f.id)}>{f.label}</button>
          ))}
        </div>

        <div style={{ padding: '10px 18px 24px', display: 'flex', flexDirection: 'column', gap: 8 }}>
          {filter ? (
            <MissionList list={filtered} emptyText="V tomhle filtru je všechno splněno." />
          ) : (
            <>
              {activeWorlds.map((w) => {
                const ch = CHAPTERS.find((c) => c.id === w.id)
                return <WorldCard key={w.id} id={w.id} name={w.name} icon={ch ? <Seal size={40}><SealGlyph icon={ch.icon} size={20} /></Seal> : undefined} />
              })}
              {lockedCount > 0 && (
                <button onClick={() => go('mapa')} className="card-dark row" style={{ marginTop: 4 }}>
                  <Keyhole width={16} height={22} />
                  <span style={{ flex: 1, fontWeight: 700, fontSize: 15 }}>Další mise čekají za tajnými pečetěmi</span>
                  <span style={{ color: 'var(--gold-hi)', fontWeight: 800 }}>→</span>
                </button>
              )}
              {finishedWorlds.length > 0 && (
                <p style={{ textAlign: 'center', fontSize: 14, fontWeight: 700, color: 'var(--ink-3)', marginTop: 6 }}>
                  ✓ Dokončeno: {finishedWorlds.map((w) => w.name).join(', ')}
                </p>
              )}
            </>
          )}
        </div>
      </div>
      <TabBar active="mise" />
    </div>
  )
}
