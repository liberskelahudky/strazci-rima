import { useState } from 'react'
import { useGame } from '../state/store'
import { go } from '../lib/router'
import { PLACES, placeById } from '../data'
import { denaru } from '../lib/format'
import { Coin, Laurel, Seal, Star } from '../components/Ornaments'
import { PlaceImage } from '../components/Illustrations'
import { Feedback, PhotoButton, QuizOptions, ReadAloud, RewardBadge, TabBar, TopBar } from '../components/UI'
import { MissionList } from './Missions'

// Seznam památek – rodina otevře kartu ručně, bez GPS
export function Places() {
  const { state } = useGame()
  const visited = PLACES.filter((p) => state.visited[p.id]).length
  return (
    <div className="screen bg-trav-c">
      <TopBar fallback="domov" />
      <div className="screen-scroll">
        <div style={{ padding: '16px 20px 6px' }}>
          <div className="kicker">Objeveno {visited} z {PLACES.length}</div>
          <h1 className="deco" style={{ fontSize: 26 }}>Památky Říma</h1>
          <p className="muted" style={{ fontSize: 15, fontWeight: 600, marginTop: 4 }}>Až k některé dorazíte, otevřete její kartu.</p>
        </div>
        <div style={{ padding: '10px 18px 24px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          {PLACES.map((p) => {
            const v = !!state.visited[p.id]
            return (
              <button key={p.id} onClick={() => go('misto/' + p.id)} style={{ borderRadius: 20, overflow: 'hidden', background: '#fff', boxShadow: v ? '0 0 0 3px var(--gold-lt), 0 4px 0 var(--gold-mid)' : '0 0 0 1px var(--line), 0 4px 0 var(--sand-shadow)', textAlign: 'left', display: 'flex', flexDirection: 'column' }}>
                <div style={{ height: 104, position: 'relative' }}>
                  <PlaceImage place={p.id} scene={p.scene} />
                  {v && <Seal size={34} className="stamp" style={{ position: 'absolute', right: 8, top: 8, fontSize: 14 }}>✓</Seal>}
                </div>
                <div style={{ padding: '10px 12px 12px', display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <span style={{ fontWeight: 800, fontSize: 16, lineHeight: 1.2 }}>{p.name}</span>
                  <span style={{ fontSize: 11, fontWeight: 800, letterSpacing: '.08em', color: 'var(--ink-3)' }}>{v ? 'OBJEVENO' : p.kicker}</span>
                </div>
              </button>
            )
          })}
        </div>
      </div>
      <TabBar active="mista" />
    </div>
  )
}

// 05 v návrhu / 07 v briefu · Objevené místo – nejdřív tip, až potom fakta
export function PlaceCard({ id }: { id: string }) {
  const { state, visit, guess } = useGame()
  const p = placeById(id)
  const [picked, setPicked] = useState<number | null>(null)
  if (!p) return null
  const visited = !!state.visited[p.id]
  const g = state.guessed[p.id]
  const pick = picked ?? g?.pick ?? null
  const guessed = pick !== null
  const missionsReward = p.missions.reduce((s, m) => s + m.reward, 0)

  return (
    <div className="screen bg-trav-c" style={{ background: 'radial-gradient(circle at 50% 40%,var(--trav-hi),var(--trav) 70%)' }}>
      <div className="screen-scroll">
        <div style={{ height: 300, position: 'relative', clipPath: 'polygon(0 0,100% 0,100% 92%,92% 96%,84% 92%,74% 97%,63% 93%,52% 98%,41% 93%,30% 97%,20% 92%,10% 96%,0 93%)' }}>
          <PlaceImage place={p.id} scene={p.scene} />
          <div style={{ position: 'absolute', inset: 0, boxShadow: 'inset 0 -60px 60px rgba(42,29,20,.25)', pointerEvents: 'none' }} />
          <div style={{ position: 'absolute', left: 0, right: 0, top: 0 }}><TopBar /></div>
        </div>
        <div style={{ marginTop: -38, display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative', gap: 2 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <Laurel width={26} height={58} leaves={4} />
            <h1 className="deco" style={{ padding: '10px 40px', background: 'var(--red)', clipPath: 'polygon(0 0,100% 0,92% 50%,100% 100%,0 100%,8% 50%)', fontSize: p.name.length > 12 ? 20 : 28, color: '#FFF3D6', textAlign: 'center', maxWidth: 280 }}>{p.name}</h1>
            <Laurel width={26} height={58} leaves={4} flip />
          </div>
          <div className="kicker brown">{p.kicker}</div>
        </div>

        <div style={{ padding: '14px 18px 28px', display: 'flex', flexDirection: 'column', gap: 12 }}>
          {/* 2) Jsme tady */}
          {visited ? (
            <div style={{ height: 56, borderRadius: 18, background: 'var(--gold-lt)', boxShadow: 'inset 0 0 0 2px var(--gold-mid)', color: 'var(--gold-deep)', fontWeight: 800, fontSize: 17, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10 }}>
              <Seal size={30} className="stamp" style={{ fontSize: 13 }}>✓</Seal> Byli jsme tady!
            </div>
          ) : (
            <button className="btn-dark" onClick={() => visit(p.id, p.visitReward, p.name)}>
              <Star size={16} />Jsme tady!<span style={{ fontSize: 14, color: 'var(--sand)', fontWeight: 700 }}>+{p.visitReward}</span>
            </button>
          )}

          {/* 3) Tipovačka před vysvětlením */}
          <div className="card-sand" style={{ padding: '14px 16px', display: 'flex', flexDirection: 'column', gap: 10 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div className="kicker" style={{ color: 'var(--red-text)' }}>Tipněte</div>
              {!guessed && <RewardBadge amount={p.guess.reward} />}
            </div>
            <div style={{ fontSize: 18, fontWeight: 800, lineHeight: 1.3 }}>{p.guess.question}</div>
            {p.guess.options.length === 3 && p.guess.options.every((o) => o.length < 10) ? (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 8 }}>
                {p.guess.options.map((o, i) => {
                  const right = guessed && i === p.guess.correct
                  return (
                    <button
                      key={o}
                      disabled={guessed}
                      onClick={() => { setPicked(i); guess(p.id, i, p.guess.reward, p.name + ': tipovačka') }}
                      style={{ height: 46, borderRadius: 14, background: right ? 'var(--gold-lt)' : pick === i ? 'var(--sand-hi)' : 'var(--trav-hi)', boxShadow: `0 3px 0 ${right ? 'var(--gold-mid)' : 'var(--sand-shadow)'}`, fontWeight: 800, fontSize: 16 }}
                    >{o}</button>
                  )
                })}
              </div>
            ) : (
              <QuizOptions quiz={p.guess} picked={pick} onPick={(i) => { setPicked(i); guess(p.id, i, p.guess.reward, p.name + ': tipovačka') }} />
            )}
          </div>

          {guessed ? (
            <>
              <Feedback title={pick === p.guess.correct ? 'Přesně tak!' : 'Dobrý tip! Tady je odpověď:'}>{p.guess.explain}</Feedback>

              {/* 4) Příběh */}
              <div className="card-white" style={{ padding: '16px 16px 14px', display: 'flex', flexDirection: 'column', gap: 8 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div className="kicker brown">Příběh místa</div>
                  <ReadAloud text={p.story.join(' ')} />
                </div>
                {p.story.map((s) => <p key={s} style={{ fontSize: 16, lineHeight: 1.5, fontWeight: 600 }}>{s}</p>)}
              </div>

              {/* 5) + 6) Mise na místě s odměnou */}
              <div className="divider-title"><span>Mise na místě · až {missionsReward} {denaru(missionsReward)}</span></div>
              <MissionList list={p.missions} hidePlace emptyText="Všechny mise tady jsou splněné!" />

              {/* 7) Tohle řekni doma */}
              <div className="card-dark" style={{ padding: '16px 18px', display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                <Coin size={34} label="!" style={{ fontSize: 16 }} />
                <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                  <div className="kicker gold">Tohle řekněte doma</div>
                  <p style={{ fontSize: 16, lineHeight: 1.45, fontWeight: 600 }}>{p.tellHome}</p>
                </div>
              </div>

              {/* 8) Uložit fotografii */}
              <div className="divider-title"><span>Vaše fotka místa</span></div>
              <PhotoButton photoKey={'place:' + p.id} label={p.name} compact />
              <p style={{ fontSize: 13, fontWeight: 600, color: 'var(--ink-3)', textAlign: 'center' }}>Fotka se objeví nahoře na kartě a v galerii.</p>
            </>
          ) : (
            <p style={{ textAlign: 'center', fontSize: 15, fontWeight: 700, color: 'var(--ink-3)', padding: '4px 20px' }}>Nejdřív tipněte. Příběh místa a mise se odemknou potom.</p>
          )}
        </div>
      </div>
    </div>
  )
}
