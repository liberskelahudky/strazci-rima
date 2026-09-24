import { useMemo, useState, type ReactNode } from 'react'
import { useGame } from '../state/store'
import { go } from '../lib/router'
import { ALL_MISSIONS, PLACES, type Quiz } from '../data'
import { denaru, todayKey } from '../lib/format'
import { playFanfare } from '../lib/sound'
import { Coin, Divider, Rays, Seal, Star } from '../components/Ornaments'
import { LupaSays } from '../components/Illustrations'
import { Feedback, QuizOptions, TopBar } from '../components/UI'

type Step = { kind: 'quiz'; title: string; question: string; quiz: Quiz } | { kind: 'task'; title: string; task: string }

const GENERAL: Step[] = [
  { kind: 'quiz', title: 'Tajná zkratka', question: 'Co znamená SPQR?', quiz: { options: ['Senát a lid římský', 'Super pizza, quattro rajčata', 'Stráž paláce'], correct: 0, explain: 'Senatus Populusque Romanus – Senát a lid římský.' } },
  { kind: 'quiz', title: 'Římské číslice', question: 'Kolik je XIV?', quiz: { options: ['16', '14', '41'], correct: 1, explain: 'X = 10, IV = 4. Dohromady 14.' } },
  { kind: 'quiz', title: 'Vlčí pověst', question: 'Jak se jmenovala dvojčata z pověsti o založení Říma?', quiz: { options: ['Asterix a Obelix', 'Romulus a Remus', 'Caesar a Augustus'], correct: 1, explain: 'Romulus a Remus. Podle legendy Romulus založil Řím v roce 753 př. n. l.' } },
  { kind: 'task', title: 'Italský pozdrav', task: 'Pozdravte se navzájem třemi různými italskými slovy.' },
  { kind: 'task', title: 'Bez telefonu', task: 'Zavřete oči. Každý popište jednu věc, kterou jste dnes viděli, tak přesně, aby ji druhý poznal.' },
  { kind: 'task', title: 'Gladiátorský pozdrav', task: 'Předveďte spolu souboj gladiátorů – jen jako divadlo, bez zásahů!' },
]

// 13 · Večerní boss fight – 5 úkolů z toho, co děti dnes opravdu otevřely
export function Boss() {
  const { state, boss } = useGame()
  const today = todayKey()
  const doneToday = state.boss[today]

  const steps = useMemo<Step[]>(() => {
    const isToday = (at?: number) => !!at && todayKey(new Date(at)) === today
    const quizzes: Step[] = [
      ...ALL_MISSIONS.filter((m) => m.quiz && isToday(state.done[m.id]?.at)).map((m) => ({ kind: 'quiz' as const, title: m.title, question: m.task.replace(/^Tipněte si: /, ''), quiz: m.quiz! })),
      ...PLACES.filter((p) => isToday(state.guessed[p.id]?.at)).map((p) => ({ kind: 'quiz' as const, title: p.name, question: p.guess.question, quiz: p.guess })),
    ]
    const tasks: Step[] = [
      ...PLACES.filter((p) => isToday(state.visited[p.id])).map((p) => ({ kind: 'task' as const, title: p.name, task: `Řekněte bez nápovědy dvě věci, které jste se dnes dozvěděli o místě ${p.name}.` })),
      ...ALL_MISSIONS.filter((m) => !m.quiz && isToday(state.done[m.id]?.at)).map((m) => ({ kind: 'task' as const, title: m.title, task: `Vzpomeňte si: co přesně jste dělali v misi „${m.title}“? Každý řekne jeden detail.` })),
    ]
    const shuffle = <T,>(a: T[]) => a.map((x) => [Math.random(), x] as const).sort((p, q) => p[0] - q[0]).map((x) => x[1])
    const pickedQ = shuffle(quizzes).slice(0, 3)
    const pickedT = shuffle(tasks).slice(0, 5 - pickedQ.length)
    const out = [...pickedQ, ...pickedT]
    for (const g of shuffle(GENERAL)) if (out.length < 5) out.push(g)
    return shuffle(out)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [today])

  const [i, setI] = useState(-1)
  const [score, setScore] = useState(0)
  const [picked, setPicked] = useState<number | null>(null)
  const step = steps[i]
  const reward = score * 2

  const advance = (ok: boolean) => {
    setScore((s) => s + (ok ? 1 : 0))
    setPicked(null)
    setI(i + 1)
  }

  let body
  if (doneToday) {
    body = (
      <Center>
        <Seal size={120} style={{ fontSize: 34 }}>{doneToday.score}/5</Seal>
        <h1 className="deco" style={{ fontSize: 28, textAlign: 'center' }}>Dnešní boss poražen!</h1>
        <p style={{ fontSize: 17, color: 'var(--sand)', textAlign: 'center', lineHeight: 1.45 }}>Zítra večer přijde nový. Teď už jen dobrou noc, strážci.</p>
        <button className="btn-dark" onClick={() => go('domov')}>Domů</button>
      </Center>
    )
  } else if (i === -1) {
    body = (
      <Center>
        <div className="ribbon gold" style={{ padding: '6px 26px', fontSize: 12, letterSpacing: '.2em' }}>VEČERNÍ BOSS FIGHT</div>
        <Seal size={150} style={{ fontSize: 44 }}>V</Seal>
        <h1 className="deco" style={{ fontSize: 28, textAlign: 'center', lineHeight: 1.1 }}>Strážce brány</h1>
        <p style={{ fontSize: 17, color: 'var(--sand)', textAlign: 'center', lineHeight: 1.45 }}>Pět úkolů z toho, co jste dnes zažili. Hrajete jako jeden tým – za každý zvládnutý úkol 2 denáry.</p>
        <button className="btn-primary" onClick={() => setI(0)}>Do boje!</button>
      </Center>
    )
  } else if (step) {
    body = (
      <div style={{ padding: '14px 18px 28px', display: 'flex', flexDirection: 'column', gap: 14 }}>
        <div style={{ display: 'flex', gap: 6, justifyContent: 'center' }}>
          {steps.map((_, k) => <span key={k} style={{ width: 40, height: 8, borderRadius: 4, background: k < i ? 'var(--gold-lt)' : k === i ? 'var(--red-hi)' : 'var(--bronze-lt)' }} />)}
        </div>
        <div key={i} className="rise" style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div className="parchment" style={{ borderRadius: 18, padding: '18px 18px', color: 'var(--ink)', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
            <div className="kicker">Úkol {i + 1} z 5 · {step.title}</div>
            <div className="deco" style={{ fontSize: 22, lineHeight: 1.2 }}>{step.kind === 'quiz' ? step.question : step.task}</div>
            <Divider />
          </div>
          {step.kind === 'quiz' ? (
            <>
              <QuizOptions quiz={step.quiz} picked={picked} onPick={setPicked} />
              {picked !== null && (
                <>
                  <Feedback title={picked === step.quiz.correct ? 'Zásah! Boss vrávorá.' : 'Boss uhnul – ale teď už to víte!'}>{step.quiz.explain}</Feedback>
                  <button className="btn-primary" onClick={() => advance(picked === step.quiz.correct)}>Dál →</button>
                </>
              )}
            </>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
              <button className="btn-sand" onClick={() => advance(false)}>Tohle ne</button>
              <button className="btn-primary" style={{ minHeight: 52, fontSize: 17 }} onClick={() => advance(true)}>Zvládli jsme!</button>
            </div>
          )}
        </div>
      </div>
    )
  } else {
    body = (
      <Center>
        <div style={{ position: 'relative' }}>
          <Rays size={300} color="rgba(248,222,147,.2)" spin style={{ left: -90, top: -90 }} />
          <Coin size={120} glow label={`${score}/5`} style={{ fontSize: 30 }} />
        </div>
        <h1 className="deco" style={{ fontSize: 28, textAlign: 'center' }}>{score >= 4 ? 'Boss poražen!' : score >= 2 ? 'Skvělý souboj!' : 'Boss byl silný!'}</h1>
        <p style={{ fontSize: 17, color: 'var(--sand)', textAlign: 'center' }}>{score} z 5 úkolů týmově · +{reward} {denaru(reward)}</p>
        <button className="btn-primary" onClick={() => { boss(score, reward); if (score >= 4) playFanfare(); go('domov') }}>
          <Coin size={22} /> Vzít odměnu
        </button>
      </Center>
    )
  }

  return (
    <div className="screen bg-night" style={{ overflow: 'hidden' }}>
      <Star className="twinkle" style={{ position: 'absolute', left: 30, top: 90 }} />
      <Star className="twinkle" size={10} style={{ position: 'absolute', right: 40, top: 150, animationDelay: '1s' }} />
      <TopBar dark />
      <div className="screen-scroll">{body}</div>
      {i === -1 && !doneToday && (
        <div style={{ padding: '0 18px calc(var(--safe-bottom) + 20px)' }}>
          <LupaSays size={50}>Nevadí, když něco nevíte. Boss se nezlobí a denáry se neztrácí.</LupaSays>
        </div>
      )}
    </div>
  )
}

function Center({ children }: { children: ReactNode }) {
  return <div style={{ minHeight: '100%', padding: '24px 28px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 18 }}>{children}</div>
}
