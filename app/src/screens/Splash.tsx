import { useGame } from '../state/store'
import { go } from '../lib/router'
import { Coin, Laurel, Star } from '../components/Ornaments'
import { SplashHero } from '../components/Illustrations'

// 01 · Splash – přesně podle návrhu v2
export function Splash() {
  const { state } = useGame()
  return (
    <div className="screen" style={{ background: 'linear-gradient(180deg,#1E140D 0%,#3A1A14 38%,#8A3A1E 62%,#D9A24A 78%,#2A1D14 78.2%,#2A1D14 100%)', overflow: 'hidden' }}>
      <div style={{ position: 'relative', width: 370, height: '100%', minHeight: 640, margin: '0 auto' }}>
        <Star className="twinkle" style={{ position: 'absolute', left: 34, top: 70 }} />
        <Star className="twinkle" size={20} style={{ position: 'absolute', left: 310, top: 92, animationDelay: '.8s' }} />
        <Star className="twinkle" size={9} color="var(--gold-lt)" style={{ position: 'absolute', left: 80, top: 150, animationDelay: '1.4s' }} />
        <Star className="twinkle" size={10} color="var(--gold-lt)" style={{ position: 'absolute', left: 336, top: 210, animationDelay: '.3s' }} />
        <Star className="twinkle" size={12} style={{ position: 'absolute', left: 24, top: 260, animationDelay: '2s' }} />
        <div style={{ position: 'absolute', left: 95, top: 'calc(var(--safe-top) + 60px)', width: 180, height: 300, borderRadius: '180px 180px 18px 18px', padding: 5, background: 'linear-gradient(var(--gold-hi), var(--gold-mid))', boxShadow: '0 0 50px rgba(248,222,147,.35)' }}>
          <div style={{ width: '100%', height: '100%', borderRadius: '175px 175px 14px 14px', overflow: 'hidden', position: 'relative', boxShadow: 'inset 0 0 0 3px var(--gold-deep)' }}>
            <SplashHero />
          </div>
        </div>
        <Laurel width={46} height={104} color="var(--gold-lt)" leaves={8} style={{ position: 'absolute', left: 48, top: 'calc(var(--safe-top) + 230px)' }} />
        <Laurel width={46} height={104} color="var(--gold-lt)" leaves={8} flip style={{ position: 'absolute', left: 276, top: 'calc(var(--safe-top) + 230px)' }} />
        <svg className="splash-skyline" style={{ position: 'absolute', left: 0, bottom: '23%' }} width="370" height="130" viewBox="0 0 370 130" aria-hidden>
          <g fill="#2A1D14">
            <rect x="0" y="92" width="370" height="40" />
            <path d="M10 130V70H70V130Z" />
            <rect x="14" y="60" width="52" height="10" />
            <path d="M120 130V74H132A46 46 0 0 1 224 74H236V130Z" />
            <rect x="176" y="18" width="4" height="14" />
            <rect x="250" y="54" width="110" height="76" rx="4" />
            <rect x="84" y="50" width="10" height="80" />
            <rect x="100" y="50" width="10" height="80" />
            <rect x="80" y="44" width="34" height="8" />
          </g>
          <g fill="#D9A24A">
            {[262, 284, 306, 328].flatMap((x) => [66, 96].map((y) => <rect key={x + '-' + y} x={x} y={y} width="12" height="18" rx="6" />))}
          </g>
        </svg>
        <div style={{ position: 'absolute', left: 0, right: 0, top: 'calc(var(--safe-top) + 380px)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10 }}>
          <h1 className="deco" style={{ fontSize: 46, lineHeight: 0.95, color: '#FFF3D6', textAlign: 'center', textShadow: '0 3px 0 #5E1713, 0 0 24px rgba(248,222,147,.5)' }}>
            Strážci<br />Říma
          </h1>
          <div className="ribbon">Tajemství ztracených denárů</div>
        </div>
      </div>
      <div style={{ position: 'absolute', left: 24, right: 24, bottom: 'calc(var(--safe-bottom) + 28px)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, maxWidth: 342, margin: '0 auto' }}>
        <button className="btn-primary" onClick={() => go(state.introSeen ? 'domov' : 'pribeh')}>
          <Coin size={22} />
          {state.introSeen ? 'Pokračovat ve výpravě' : 'Začít výpravu'}
        </button>
        <button onClick={() => go('rodice')} style={{ fontSize: 14, fontWeight: 600, color: 'var(--ink-4)', padding: 10 }}>Pro rodiče</button>
      </div>
    </div>
  )
}
