import { useEffect, useState } from 'react'
import { useGame } from '../state/store'
import { go } from '../lib/router'
import { ALL_MISSIONS, CHAPTERS, KIND_LABEL, SIDE_WORLDS, findMission, placeById } from '../data'
import { denaru } from '../lib/format'
import { Coin, Divider, Keyhole, Seal } from '../components/Ornaments'
import { LupaSays } from '../components/Illustrations'
import { Feedback, NOTE_LABEL, PhotoButton, QuizOptions, ReadAloud, TopBar } from '../components/UI'

function Timer({ minutes }: { minutes: number }) {
  const [end, setEnd] = useState<number | null>(null)
  const [now, setNow] = useState(Date.now())
  useEffect(() => {
    if (!end) return
    const t = setInterval(() => setNow(Date.now()), 500)
    return () => clearInterval(t)
  }, [end])
  const left = end ? Math.max(0, end - now) : minutes * 60000
  const mm = Math.floor(left / 60000)
  const ss = Math.floor((left % 60000) / 1000)
  return (
    <div className="card-dark" style={{ padding: 16, display: 'flex', alignItems: 'center', gap: 14 }}>
      <div className="cinzel" style={{ fontSize: 40, color: 'var(--gold-hi)', minWidth: 120 }}>{mm}:{String(ss).padStart(2, '0')}</div>
      {end ? (
        <div style={{ fontSize: 15, fontWeight: 700 }}>{left === 0 ? 'Čas vypršel – ale nevadí, splnit to můžete i tak!' : 'Běžte, běžte!'}</div>
      ) : (
        <button className="btn-sand" style={{ flex: 1 }} onClick={() => { setEnd(Date.now() + minutes * 60000); setNow(Date.now()) }}>Spustit čas</button>
      )}
    </div>
  )
}

function CoopClue({ name, text }: { name: string; text: string }) {
  const [open, setOpen] = useState(false)
  return (
    <button
      onClick={() => setOpen(!open)}
      className={open ? 'card-white' : 'card-dark'}
      style={{ padding: 14, textAlign: 'left', minHeight: 88, display: 'flex', flexDirection: 'column', gap: 6, borderRadius: 18 }}
    >
      <span className="kicker" style={{ color: open ? 'var(--red)' : 'var(--sand)' }}>Jen pro: {name}</span>
      <span style={{ fontSize: 15, fontWeight: 700, lineHeight: 1.35 }}>{open ? text : 'Ťukni a čti potichu. Ostatní se nedívají!'}</span>
    </button>
  )
}

// 06 · Detail mise (+ 08 tipovačka, 09 foto mise)
export function MissionDetail({ id }: { id: string }) {
  const { state, unlocked, complete } = useGame()
  const m = findMission(id)
  const [picked, setPicked] = useState<number | null>(null)
  const [answer, setAnswer] = useState('')
  useEffect(() => { setPicked(null); setAnswer('') }, [id])
  if (!m) return <div className="screen bg-trav"><TopBar /><p style={{ padding: 20 }}>Mise nenalezena.</p></div>

  const chapter = CHAPTERS.find((c) => c.id === m.world)
  const locked = chapter && !unlocked.some((c) => c.id === chapter.id)
  const done = state.done[m.id]
  const place = m.place ? placeById(m.place) : undefined
  const worldName = chapter?.name ?? SIDE_WORLDS.find((w) => w.id === m.world)?.name ?? place?.name ?? ''
  const [a, b] = state.settings.names

  if (locked) {
    return (
      <div className="screen bg-night">
        <TopBar dark />
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 16, padding: 28, textAlign: 'center' }}>
          <Keyhole width={40} height={56} />
          <p style={{ fontSize: 18, fontWeight: 700 }}>Tahle mise je zatím zapečetěná.</p>
          <button className="btn-dark" onClick={() => go('tajemstvi/' + chapter!.id)}>Co je za pečetí?</button>
        </div>
      </div>
    )
  }

  const isTip = m.kind === 'tip'
  const q = m.quiz
  const correct = q && picked === q.correct
  const answered = picked !== null
  const canFinish = !q || (isTip ? answered : correct)

  const finish = () => complete(m.id, m.reward, m.title, KIND_LABEL[m.kind], answer.trim() || undefined)

  const onPick = (i: number) => {
    setPicked(i)
    if (!q || done) return
    if (isTip || i === q.correct) complete(m.id, m.reward, m.title, KIND_LABEL[m.kind])
  }

  const nextMission = ALL_MISSIONS.find((x) => x.world === m.world && x.id !== m.id && !state.done[x.id])

  return (
    <div className="screen bg-trav-c">
      <TopBar />
      <div className="screen-scroll">
        <div style={{ margin: '18px 14px 0', position: 'relative' }}>
          <div className="rod" />
          <div className="parchment" style={{ margin: '-6px 10px 0', padding: '22px 20px 20px', display: 'flex', flexDirection: 'column', gap: 10, alignItems: 'center', textAlign: 'center' }}>
            <div className="kicker">{KIND_LABEL[m.kind]} · {worldName}</div>
            <h1 className="deco" style={{ fontSize: 26, lineHeight: 1.12, textWrap: 'pretty' }}>{m.title}</h1>
            <Divider />
            <p style={{ fontSize: 18, fontWeight: 700, lineHeight: 1.4, textWrap: 'pretty' }}>{m.task}</p>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 4 }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '6px 14px', borderRadius: 99, background: 'var(--bronze)', color: 'var(--parch)', fontWeight: 800 }}>
                <Coin size={18} /> {m.reward} {denaru(m.reward)}
              </span>
              <ReadAloud text={`${m.title}. ${m.task}`} />
            </div>
          </div>
          <div className="rod" style={{ marginTop: -2 }} />
        </div>

        <div style={{ padding: '18px 18px 28px', display: 'flex', flexDirection: 'column', gap: 12 }}>
          {m.coop && !done && (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
              <CoopClue name={a} text={m.coop[0]} />
              <CoopClue name={b} text={m.coop[1]} />
            </div>
          )}
          {m.timer && !done && <Timer minutes={m.timer} />}

          {q && (
            <>
              <QuizOptions quiz={q} picked={done && picked === null ? q.correct : picked} onPick={onPick} />
              {(answered || done) && (
                <Feedback title={isTip ? (correct || (done && !answered) ? `Přesně tak! +${m.reward} ${denaru(m.reward)}` : `Tohle si myslí i spousta dospělých! +${m.reward}`) : correct || (done && !answered) ? `Správně! +${m.reward} ${denaru(m.reward)}` : 'Skoro! Zkuste to ještě jednou.'}>
                  {correct || isTip || done ? q.explain : 'Nápověda: přečtěte si otázku znovu a poraďte se spolu.'}
                </Feedback>
              )}
              {answered && !correct && !isTip && !done && (
                <button className="btn-sand" onClick={() => setPicked(null)}>Další pokus</button>
              )}
              {!answered && !done && <LupaSays size={54}>Poraďte se spolu. Špatně tipnout nevadí!</LupaSays>}
            </>
          )}

          {m.input && !q && (
            done?.answer ? (
              <div className="card-white" style={{ padding: 14 }}>
                <div className="kicker brown">Vaše odpověď</div>
                <div style={{ fontSize: 17, fontWeight: 700, marginTop: 4 }}>{done.answer}</div>
              </div>
            ) : !done ? (
              <label style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                <span style={{ fontSize: 14, fontWeight: 800, color: 'var(--ink-2)' }}>{m.input} <span style={{ fontWeight: 600 }}>(nepovinné)</span></span>
                <textarea className="field" rows={2} value={answer} onChange={(e) => setAnswer(e.target.value)} />
              </label>
            ) : null
          )}

          {m.photo && <PhotoButton photoKey={m.id} label={m.title} />}

          {!q && !done && (
            <button className="btn-primary" onClick={finish} disabled={!canFinish}>
              <Seal size={30} style={{ fontSize: 13 }}>✓</Seal> Splněno!
            </button>
          )}

          {done && (
            <div className="rise" style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {!q && m.fact && (
                <Feedback title={<span style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>Víte, že…? {m.note && <span className={'tag ' + m.note}>{NOTE_LABEL[m.note]}</span>}</span>}>{m.fact}</Feedback>
              )}
              {q && m.note && <span className={'tag ' + m.note} style={{ alignSelf: 'flex-start' }}>{NOTE_LABEL[m.note]}</span>}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, fontWeight: 800, color: 'var(--gold-dk)' }}>
                <Seal size={34} className="stamp" style={{ fontSize: 14 }}>✓</Seal> Mise splněna · +{m.reward} {denaru(m.reward)}
              </div>
              {nextMission ? (
                <button className="btn-dark" onClick={() => go('mise-detail/' + nextMission.id)}>Další mise: {nextMission.title} →</button>
              ) : (
                <button className="btn-dark" onClick={() => go('domov')}>Zpět domů</button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
