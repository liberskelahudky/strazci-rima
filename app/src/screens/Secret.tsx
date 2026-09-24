import { useState } from 'react'
import { useGame } from '../state/store'
import { go } from '../lib/router'
import { CHAPTERS } from '../data'
import { denaru } from '../lib/format'
import { playFanfare } from '../lib/sound'
import { Keyhole, Rays, SealGlyph, Star } from '../components/Ornaments'
import { TopBar } from '../components/UI'

const BIG_SEAL = {
  width: 190,
  height: 190,
  borderRadius: '50%',
  background: 'radial-gradient(circle at 35% 30%,var(--red-hi),var(--red) 55%,var(--red-shadow))',
  boxShadow: 'inset 0 0 0 8px var(--red-ring), inset 0 0 0 12px rgba(255,220,200,.25), 0 0 0 14px rgba(158,43,37,.2), 0 0 60px rgba(248,222,147,.35), 0 20px 40px rgba(0,0,0,.5)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
} as const

// 06 v návrhu / 10 v briefu · Tajná mise – zamčeno, nebo dramatický reveal
export function Secret({ id }: { id: string }) {
  const { total, state, unlocked, next, reveal } = useGame()
  const [breaking, setBreaking] = useState(false)
  const c = CHAPTERS.find((x) => x.id === id)
  if (!c) return null
  const isUnlocked = unlocked.some((x) => x.id === c.id)
  const isRevealed = state.revealed.includes(c.id)
  const isNext = next?.id === c.id
  const pct = Math.min(100, Math.round((total / c.unlockAt) * 100))

  const open = () => {
    setBreaking(true)
    playFanfare()
    setTimeout(() => reveal(c.id), 900)
  }

  return (
    <div className="screen bg-night" style={{ overflow: 'hidden' }}>
      <Rays size={500} color="rgba(248,222,147,.13)" spin={isUnlocked} style={{ left: 'calc(50% - 250px)', top: 30 }} />
      <Star className="twinkle" style={{ position: 'absolute', left: 40, top: 80 }} />
      <Star className="twinkle" size={18} style={{ position: 'absolute', right: 70, top: 130, animationDelay: '.7s' }} />
      <Star className="twinkle" size={10} color="var(--gold-lt)" style={{ position: 'absolute', left: 70, top: 420, animationDelay: '1.3s' }} />
      <Star className="twinkle" size={12} color="var(--gold-lt)" style={{ position: 'absolute', right: 60, top: 380, animationDelay: '.2s' }} />
      <TopBar dark fallback="mapa" />
      <div className="screen-scroll" style={{ position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '0 28px' }}>
        <div style={{ height: 24, flex: 'none' }} />
        <div className="ribbon gold" style={{ padding: '6px 26px', fontSize: 12, letterSpacing: '.2em' }}>
          {isRevealed ? `PEČEŤ ${c.numeral} ZLOMENA` : 'PŘÍSNĚ TAJNÉ'}
        </div>

        {isRevealed ? (
          <>
            <div className="stamp" style={{ ...BIG_SEAL, marginTop: 40, background: 'var(--coin)', boxShadow: 'inset 0 0 0 8px var(--gold-mid), inset 0 0 0 12px var(--gold-lt), 0 0 0 14px rgba(200,150,46,.25), 0 0 80px rgba(248,222,147,.6), 0 20px 40px rgba(0,0,0,.5)' }}>
              <SealGlyph icon={c.icon} size={90} color="var(--gold-deep)" />
            </div>
            <h1 className="deco rise" style={{ marginTop: 36, fontSize: 30, textAlign: 'center', lineHeight: 1.1, textShadow: '0 0 20px rgba(248,222,147,.35)' }}>{c.name}</h1>
            <p className="rise" style={{ marginTop: 12, fontSize: 17, fontWeight: 500, lineHeight: 1.45, textAlign: 'center', color: 'var(--sand)', textWrap: 'pretty', animationDelay: '.15s' }}>{c.reveal}</p>
            {c.letter && (
              <p className="rise" style={{ marginTop: 16, fontSize: 14, fontWeight: 700, color: 'var(--gold-lt)', textAlign: 'center', animationDelay: '.3s' }}>
                Na rubu pečeti je vyryté písmeno <span className="cinzel" style={{ fontSize: 22, color: 'var(--gold-hi)' }}>{c.letter}</span>. Zapamatujte si ho!
              </p>
            )}
            <div style={{ flex: 1, minHeight: 24 }} />
            <button className="btn-primary" style={{ margin: '0 0 calc(var(--safe-bottom) + 36px)' }} onClick={() => go(c.id === 'sifra' ? 'finale' : 'mise/' + c.id)}>
              {c.id === 'sifra' ? 'Na velkou šifru' : 'Otevřít mise'} <span style={{ color: 'var(--gold-hi)' }}>→</span>
            </button>
          </>
        ) : (
          <>
            <div className={breaking ? 'shake' : undefined} style={{ ...BIG_SEAL, marginTop: 44, transition: 'transform .8s, opacity .8s', ...(breaking ? { transform: 'scale(1.3)', opacity: 0 } : null) }}>
              <Keyhole width={54} height={80} color="#3A0E0B" />
            </div>
            <h1 className="deco" style={{ marginTop: 40, fontSize: 30, textAlign: 'center', lineHeight: 1.1, textShadow: '0 0 20px rgba(248,222,147,.35)' }}>
              {isNext || isUnlocked ? c.name : '? ? ?'}
            </h1>
            <p style={{ marginTop: 12, fontSize: 17, fontWeight: 500, lineHeight: 1.45, textAlign: 'center', color: 'var(--sand)', textWrap: 'pretty' }}>
              {isNext || isUnlocked ? c.teaser : 'Tohle tajemství je ještě hluboko pod pečetí. Nejdřív odemkněte to předchozí.'}
            </p>
            <div style={{ flex: 1, minHeight: 32 }} />
            {isUnlocked ? (
              <button className="btn-primary" style={{ margin: '0 0 calc(var(--safe-bottom) + 36px)' }} onClick={open} disabled={breaking}>
                Zlomit pečeť!
              </button>
            ) : (
              <>
                <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 8 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 15, fontWeight: 700, color: 'var(--sand)' }}>
                    <span>{total} z {c.unlockAt} {denaru(c.unlockAt)}</span>
                    <span>chybí {c.unlockAt - total}</span>
                  </div>
                  <div className="progress" style={{ background: 'var(--bronze-mid)' }}><div style={{ width: pct + '%' }} /></div>
                </div>
                <div style={{ margin: '22px 0 calc(var(--safe-bottom) + 44px)', width: '100%', minHeight: 64, borderRadius: 18, background: 'var(--bronze-mid)', boxShadow: 'inset 0 0 0 2px var(--ink-2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, fontWeight: 800, color: 'var(--ink-4)' }}>
                  Odemkne se za {c.unlockAt} {denaru(c.unlockAt)}
                </div>
              </>
            )}
          </>
        )}
      </div>
    </div>
  )
}
