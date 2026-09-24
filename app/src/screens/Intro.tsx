import { useState } from 'react'
import { useGame } from '../state/store'
import { go } from '../lib/router'
import { Coin, Divider, Seal, SealGlyph, Star } from '../components/Ornaments'
import { Lupa, Scene } from '../components/Illustrations'
import { ReadAloud } from '../components/UI'

// 02 · Úvodní příběh – komiks na svitku ve 4 obrazech
export function Intro() {
  const { state, introSeen } = useGame()
  const [a, b] = state.settings.names
  const [i, setI] = useState(0)

  const pages = [
    {
      kicker: 'KAPITOLA PRVNÍ',
      title: 'Řím hledá nové strážce',
      text: 'Před dávnými časy střežili Řím tajemní Strážci. Poslední z nich schoval denáry po celém městě – a pak se ztratil.',
      art: <Scene id="forum" />,
    },
    {
      kicker: 'PRŮVODKYNĚ',
      title: 'Jsem Lupa',
      text: `Jsem vlčice Lupa. Kdysi jsem hlídala Romula a Rema. Teď hledám nové strážce – a vybrala jsem si vás, ${a} a ${b}.`,
      art: (
        <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'radial-gradient(circle,#5A2A1C,#1E140D 70%)' }}>
          <Lupa size={150} />
        </div>
      ),
    },
    {
      kicker: 'ÚKOL',
      title: 'Poznejte město',
      text: 'Řím prozradí svá tajemství jen tomu, kdo se dívá pozorně. Hledejte, tipujte, fotografujte a ochutnávejte.',
      art: <Scene id="koloseum" />,
    },
    {
      kicker: 'JEDEN TÝM',
      title: 'Společná pokladnice',
      text: 'Nesoutěžíte proti sobě. Každý denár jde do jedné pokladnice a s každým se přiblíží další tajná pečeť.',
      art: (
        <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 14, background: 'radial-gradient(circle at 50% 50%,#FFF6DF,#EDE0C6 70%)' }}>
          <Seal size={70}><SealGlyph icon="wolf" size={30} /></Seal>
          <Coin size={96} label="SPQR" glow />
          <Seal size={70}><SealGlyph icon="laurel" size={30} /></Seal>
        </div>
      ),
    },
  ]
  const p = pages[i]
  const last = i === pages.length - 1
  const finish = () => {
    introSeen()
    go('domov')
  }

  return (
    <div className="screen bg-night" style={{ overflow: 'hidden' }}>
      <Star className="twinkle" style={{ position: 'absolute', left: 30, top: 60 }} />
      <Star className="twinkle" size={10} style={{ position: 'absolute', right: 40, top: 110, animationDelay: '1s' }} />
      <div style={{ padding: 'calc(var(--safe-top) + 44px) 20px 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', gap: 8 }}>
          {pages.map((_, k) => (
            <span key={k} style={{ width: k === i ? 26 : 10, height: 10, borderRadius: 5, background: k <= i ? 'var(--gold-lt)' : 'var(--bronze-lt)', transition: 'width .3s' }} />
          ))}
        </div>
        <button onClick={finish} style={{ fontWeight: 700, fontSize: 15, color: 'var(--ink-4)', padding: 8 }}>Přeskočit</button>
      </div>
      <div className="screen-scroll" style={{ padding: '18px 14px 0' }}>
        <div key={i} className="rise">
          <div className="rod" />
          <div className="parchment" style={{ margin: '-6px 10px 0', padding: 14, color: 'var(--ink)', display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div style={{ height: 220, borderRadius: 12, overflow: 'hidden', boxShadow: 'inset 0 0 0 3px var(--gold-mid)' }}>{p.art}</div>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, textAlign: 'center', padding: '0 6px 8px' }}>
              <div className="kicker">{p.kicker}</div>
              <h2 className="deco" style={{ fontSize: 26, lineHeight: 1.12 }}>{p.title}</h2>
              <Divider />
              <p style={{ fontSize: 17, lineHeight: 1.45, fontWeight: 600, color: 'var(--ink-2)' }}>{p.text}</p>
            </div>
          </div>
          <div className="rod" style={{ marginTop: -2 }} />
        </div>
      </div>
      <div style={{ padding: '14px 24px calc(var(--safe-bottom) + 28px)', display: 'flex', gap: 12, alignItems: 'center' }}>
        <ReadAloud text={`${p.title}. ${p.text}`} dark />
        <button className="btn-primary" onClick={() => (last ? finish() : setI(i + 1))}>
          {last ? 'Vyrazit na výpravu' : 'Dál'} <span style={{ color: 'var(--gold-hi)' }}>→</span>
        </button>
      </div>
    </div>
  )
}
