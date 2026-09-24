import { useState, type ReactNode } from 'react'
import { useGame } from '../state/store'
import { go } from '../lib/router'
import { CHAPTERS, FINALE_WORD } from '../data'
import { toRoman } from '../lib/format'
import { playCoin, playFanfare } from '../lib/sound'
import { Coin, Divider, Keyhole, Laurel, Rays, Seal, SealGlyph, Star } from '../components/Ornaments'
import { Feedback, QuizOptions, TopBar } from '../components/UI'

const SEALS = CHAPTERS.filter((c) => c.letter)
const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('')
const SECRET = 'ROMA'

function Panel({ step, title, children }: { step: number; title: string; children: ReactNode }) {
  return (
    <div className="rise" style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      <div className="parchment" style={{ borderRadius: 18, padding: 18, color: 'var(--ink)', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
        <div className="kicker">Šifra {toRoman(step)} ze III</div>
        <div className="deco" style={{ fontSize: 22, lineHeight: 1.2 }}>{title}</div>
        <Divider />
      </div>
      {children}
    </div>
  )
}

// 15 · Velké finále – šifra z pečetí a poznatků z cesty, pak proměna na Strážce Říma
export function Finale() {
  const { state, unlocked, finale } = useGame()
  const [step, setStep] = useState(state.finale ? 4 : 1)
  const [order, setOrder] = useState<string[]>([])
  const [meaning, setMeaning] = useState<number | null>(null)
  const [word, setWord] = useState('')
  const [wordTried, setWordTried] = useState(false)
  const [oath, setOath] = useState<number | null>(null)

  if (!unlocked.some((c) => c.id === 'sifra')) {
    return (
      <div className="screen bg-night">
        <TopBar dark />
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 16, padding: 28, textAlign: 'center' }}>
          <Keyhole width={40} height={56} />
          <p style={{ fontSize: 18, fontWeight: 700 }}>Velká šifra se otevře, až budete mít všechny pečetě.</p>
          <button className="btn-dark" onClick={() => go('mapa')}>Na mapu cesty</button>
        </div>
      </div>
    )
  }

  const spelled = order.map((id) => SEALS.find((s) => s.id === id)!.letter).join('')
  const orderOk = spelled === FINALE_WORD
  const wordOk = word.trim().toUpperCase() === SECRET
  const shuffled = [...SEALS].sort((a, b) => a.icon.localeCompare(b.icon))

  const win = () => {
    playFanfare()
    finale()
    setStep(4)
  }

  return (
    <div className="screen bg-night" style={{ overflow: 'hidden' }}>
      <Rays size={520} color="rgba(248,222,147,.12)" spin style={{ left: 'calc(50% - 260px)', top: 40 }} />
      <Star className="twinkle" style={{ position: 'absolute', left: 30, top: 100 }} />
      <Star className="twinkle" size={18} style={{ position: 'absolute', right: 50, top: 140, animationDelay: '.6s' }} />
      <TopBar dark />
      <div className="screen-scroll" style={{ position: 'relative' }}>
        <div style={{ padding: '14px 18px 28px', display: 'flex', flexDirection: 'column', gap: 14 }}>
          {step === 1 && (
            <Panel step={1} title="Seřaďte pečetě podle cesty">
              <p style={{ textAlign: 'center', color: 'var(--sand)', fontWeight: 600, lineHeight: 1.45 }}>Ťukejte na pečetě ve stejném pořadí, v jakém jste je na cestě lámali. Na rubu každé je písmeno.</p>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 14, justifyItems: 'center' }}>
                {shuffled.map((c) => {
                  const used = order.includes(c.id)
                  return (
                    <button key={c.id} disabled={used || order.length >= SEALS.length} onClick={() => { setOrder([...order, c.id]); playCoin() }} style={{ opacity: used ? 0.3 : 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                      <Seal size={64}><SealGlyph icon={c.icon} size={30} /></Seal>
                    </button>
                  )
                })}
              </div>
              <div style={{ display: 'flex', justifyContent: 'center', gap: 6 }}>
                {SEALS.map((_, k) => (
                  <span key={k} className="cinzel" style={{ width: 40, height: 50, borderRadius: 10, background: 'var(--bronze-mid)', boxShadow: 'inset 0 0 0 2px var(--gold)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 26, color: 'var(--gold-hi)' }}>{spelled[k] ?? ''}</span>
                ))}
              </div>
              {order.length === SEALS.length && !orderOk && (
                <>
                  <Feedback title="Tohle slovo nedává smysl…">Zkuste si vzpomenout na mapu cesty: vlčice, Caesar, aréna, Galie, auta, fotbal.</Feedback>
                  <button className="btn-sand" onClick={() => setOrder([])}>Zkusit znovu</button>
                </>
              )}
              {orderOk && (
                <>
                  <p className="cinzel" style={{ textAlign: 'center', fontSize: 20, color: 'var(--gold-hi)' }}>{FINALE_WORD}! Co to znamená latinsky?</p>
                  <QuizOptions quiz={{ options: ['Orel', 'Voda', 'Vlk'], correct: 0, explain: '' }} picked={meaning} onPick={setMeaning} />
                  {meaning !== null && (
                    <>
                      <Feedback title={meaning === 0 ? 'Orel!' : 'Je to orel!'}>Aquila byl stříbrný nebo zlatý orel, kterého legie nosila do boje. Byl to její největší poklad.</Feedback>
                      <button className="btn-primary" onClick={() => setStep(2)}>Další šifra →</button>
                    </>
                  )}
                </>
              )}
            </Panel>
          )}

          {step === 2 && (
            <Panel step={2} title="Rozluštěte římské číslice">
              <div className="cinzel" style={{ textAlign: 'center', fontSize: 30, color: 'var(--gold-hi)', letterSpacing: '.06em' }}>
                {SECRET.split('').map((ch) => toRoman(ch.charCodeAt(0) - 64)).join(' · ')}
              </div>
              <p style={{ textAlign: 'center', color: 'var(--sand)', fontWeight: 600, lineHeight: 1.45 }}>Každé písmeno je číslo podle pořadí v abecedě. A = I, B = II, C = III…</p>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6,1fr)', gap: 6 }}>
                {ALPHABET.map((ch, k) => (
                  <div key={ch} style={{ borderRadius: 8, background: 'var(--bronze-mid)', padding: '4px 0', textAlign: 'center' }}>
                    <div style={{ fontWeight: 800, fontSize: 15 }}>{ch}</div>
                    <div className="cinzel" style={{ fontSize: 10, color: 'var(--gold-lt)' }}>{toRoman(k + 1)}</div>
                  </div>
                ))}
              </div>
              <input className="field" value={word} onChange={(e) => { setWord(e.target.value); setWordTried(false) }} placeholder="Tajné slovo…" style={{ textAlign: 'center', fontSize: 22, fontWeight: 800, letterSpacing: '.2em', textTransform: 'uppercase' }} />
              {wordTried && !wordOk && <Feedback title="Ještě ne!">Poraďte se: kolikáté písmeno abecedy je XVIII? Počítejte na prstech.</Feedback>}
              {wordOk ? (
                <>
                  <Feedback title="ROMA!">Tak se Řím jmenuje latinsky i italsky. A pozpátku? AMOR – láska!</Feedback>
                  <button className="btn-primary" onClick={() => setStep(3)}>Poslední šifra →</button>
                </>
              ) : (
                <button className="btn-primary" onClick={() => setWordTried(true)} disabled={!word.trim()}>Ověřit</button>
              )}
            </Panel>
          )}

          {step === 3 && (
            <Panel step={3} title="Přísaha strážců: co znamená SPQR?">
              <QuizOptions quiz={{ options: ['Senát a lid římský', 'Síla, poklad, quest, radost', 'Strážci paláce a quirinálu'], correct: 0, explain: '' }} picked={oath} onPick={setOath} />
              {oath !== null && oath !== 0 && (
                <>
                  <Feedback title="Vzpomeňte si na kanálové poklopy…">Senatus Populusque Romanus. Našli jste to hned první den!</Feedback>
                  <button className="btn-sand" onClick={() => setOath(null)}>Ještě jednou</button>
                </>
              )}
              {oath === 0 && <button className="btn-primary" onClick={win}>Složit přísahu!</button>}
            </Panel>
          )}

          {step === 4 && (
            <div style={{ minHeight: 560, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 18, textAlign: 'center' }}>
              {Array.from({ length: 14 }, (_, k) => (
                <Coin key={k} size={14 + (k % 3) * 6} style={{ position: 'absolute', left: `${(k * 37) % 100}%`, top: -30, animation: `fall ${3 + (k % 4)}s linear ${k * 0.25}s infinite` }} />
              ))}
              <div className="ribbon gold" style={{ padding: '6px 26px', fontSize: 12, letterSpacing: '.2em' }}>PROMĚNA DOKONČENA</div>
              <div className="stamp" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <Laurel width={50} height={112} color="var(--gold-lt)" leaves={8} />
                <Coin size={150} glow label="SPQR" style={{ fontSize: 32 }} />
                <Laurel width={50} height={112} color="var(--gold-lt)" leaves={8} flip />
              </div>
              <h1 className="deco rise" style={{ fontSize: 40, lineHeight: 1, color: '#FFF3D6', textShadow: '0 3px 0 #5E1713, 0 0 24px rgba(248,222,147,.5)' }}>Strážci<br />Říma</h1>
              <p className="rise" style={{ fontSize: 17, color: 'var(--sand)', lineHeight: 1.45, animationDelay: '.2s' }}>
                {state.settings.names[0]} a {state.settings.names[1]}, Řím vám svěřuje svá tajemství. Pokladnice je vaše – je čas ji utratit!
              </p>
              <button className="btn-primary" onClick={() => go('certifikat')}>Převzít certifikát</button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
