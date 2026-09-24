import { useState } from 'react'
import { useGame } from '../state/store'
import { go } from '../lib/router'
import { ALL_MISSIONS, CHAPTERS, FILTERS, KIND_LABEL, SIDE_WORLDS, placeById, type Filter, type Mission } from '../data'
import { Keyhole, Seal, SealGlyph } from '../components/Ornaments'
import { RewardBadge, TabBar, TopBar } from '../components/UI'

export function MissionCard({ m, hidePlace }: { m: Mission; hidePlace?: boolean }) {
  const { state } = useGame()
  const done = !!state.done[m.id]
  const place = m.place ? placeById(m.place) : undefined
  return (
    <button onClick={() => go('mise-detail/' + m.id)} className="card-white row" style={{ opacity: done ? 0.72 : 1, alignItems: 'flex-start' }}>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 4 }}>
        <span style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          <span className="tag">{KIND_LABEL[m.kind]}</span>
          {place && !hidePlace && <span className="tag">{place.name}</span>}
        </span>
        <span className="row-title">{m.title}</span>
        <span className="row-sub" style={{ lineHeight: 1.35 }}>{m.task}</span>
      </div>
      <div style={{ paddingTop: 2 }}>
        <RewardBadge amount={m.reward} done={done} />
      </div>
    </button>
  )
}

// 05 · Knihovna misí (+ výpis jedné kapitoly, když přijde ?svet)
export function Missions({ world }: { world?: string }) {
  const { state, unlocked } = useGame()
  const [filter, setFilter] = useState<Filter | null>(null)
  const [hideDone, setHideDone] = useState(false)
  const openWorlds = new Set([...unlocked.map((c) => c.id), ...SIDE_WORLDS.map((w) => w.id), 'misto'])
  const chapter = CHAPTERS.find((c) => c.id === world)
  const side = SIDE_WORLDS.find((w) => w.id === world)

  let list = ALL_MISSIONS.filter((m) => openWorlds.has(m.world))
  if (world) list = list.filter((m) => m.world === world)
  if (filter) list = list.filter((m) => m.tags.includes(filter))
  if (hideDone) list = list.filter((m) => !state.done[m.id])
  list = [...list].sort((a, b) => Number(!!state.done[a.id]) - Number(!!state.done[b.id]))

  const lockedCount = ALL_MISSIONS.filter((m) => !openWorlds.has(m.world)).length
  const doneCount = ALL_MISSIONS.filter((m) => state.done[m.id]).length

  return (
    <div className="screen bg-trav-c">
      <TopBar fallback="domov" />
      <div className="screen-scroll">
        <div style={{ padding: '16px 20px 4px', display: 'flex', alignItems: 'center', gap: 14 }}>
          {chapter && <Seal size={56}><SealGlyph icon={chapter.icon} size={26} /></Seal>}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <div className="kicker">{chapter ? `Kapitola ${chapter.numeral}` : side ? 'Side quest' : `Splněno ${doneCount} z ${ALL_MISSIONS.length}`}</div>
            <h1 className="deco" style={{ fontSize: 26, lineHeight: 1.1 }}>{chapter?.name ?? side?.name ?? 'Knihovna misí'}</h1>
          </div>
        </div>

        {!world && (
          <div style={{ display: 'flex', gap: 8, overflowX: 'auto', padding: '12px 18px 6px', scrollbarWidth: 'none' }}>
            <button className={'chip' + (filter === null ? ' on' : '')} onClick={() => setFilter(null)}>Vše</button>
            {FILTERS.map((f) => (
              <button key={f.id} className={'chip' + (filter === f.id ? ' on' : '')} onClick={() => setFilter(filter === f.id ? null : f.id)}>{f.label}</button>
            ))}
          </div>
        )}
        {world === undefined && (
          <div style={{ display: 'flex', gap: 8, overflowX: 'auto', padding: '6px 18px 4px', scrollbarWidth: 'none' }}>
            {[...unlocked.filter((c) => c.id !== 'sifra'), ...SIDE_WORLDS].map((w) => (
              <button key={w.id} className="chip" style={{ background: 'var(--sand)', boxShadow: 'none' }} onClick={() => go('mise/' + w.id)}>{w.name}</button>
            ))}
          </div>
        )}

        <div style={{ padding: '10px 18px 0', display: 'flex', justifyContent: 'flex-end' }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 14, fontWeight: 700, color: 'var(--ink-2)' }}>
            <input type="checkbox" checked={hideDone} onChange={(e) => setHideDone(e.target.checked)} style={{ width: 20, height: 20, accentColor: 'var(--red)' }} />
            Skrýt splněné
          </label>
        </div>

        <div style={{ padding: '10px 18px 24px', display: 'flex', flexDirection: 'column', gap: 8 }}>
          {list.map((m) => <MissionCard key={m.id} m={m} />)}
          {list.length === 0 && (
            <div className="card-sand" style={{ padding: 18, fontWeight: 700, textAlign: 'center' }}>Tady je všechno splněno. Skvělá práce, strážci!</div>
          )}
          {!world && lockedCount > 0 && (
            <button onClick={() => go('mapa')} className="card-dark row" style={{ marginTop: 8 }}>
              <Keyhole width={16} height={22} />
              <span style={{ flex: 1, fontWeight: 700, fontSize: 15 }}>Dalších {lockedCount} misí čeká za tajnými pečetěmi</span>
              <span style={{ color: 'var(--gold-hi)', fontWeight: 800 }}>→</span>
            </button>
          )}
        </div>
      </div>
      <TabBar active="mise" />
    </div>
  )
}
