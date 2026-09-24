import { useState } from 'react'
import { useGame } from '../state/store'
import { go } from '../lib/router'
import { PLACES } from '../data'
import { denaru } from '../lib/format'
import { Coin, Divider, Laurel, Seal } from '../components/Ornaments'
import { TopBar } from '../components/UI'

const fmt = (d: string | number) => new Date(d).toLocaleDateString('cs-CZ', { day: 'numeric', month: 'long', year: 'numeric' })

function tripDates(start: string, end: string, fallback: number | undefined) {
  if (start && end) return `${fmt(start)} – ${fmt(end)}`
  if (start) return fmt(start)
  return fmt(fallback ?? Date.now())
}

// Vykreslení certifikátu do obrázku pro uložení / sdílení
async function renderPng(o: { names: string; total: number; places: string[]; dates: string }) {
  await document.fonts.ready
  const W = 1080, H = 1500
  const c = document.createElement('canvas')
  c.width = W
  c.height = H
  const g = c.getContext('2d')!
  const bg = g.createRadialGradient(W * 0.3, H * 0.2, 50, W * 0.5, H * 0.5, H)
  bg.addColorStop(0, '#FFF8E8')
  bg.addColorStop(1, '#EAD8B0')
  g.fillStyle = bg
  g.fillRect(0, 0, W, H)
  g.strokeStyle = '#C8962E'
  g.lineWidth = 14
  g.strokeRect(40, 40, W - 80, H - 80)
  g.lineWidth = 3
  g.strokeRect(70, 70, W - 140, H - 140)
  g.textAlign = 'center'
  g.fillStyle = '#9E2B25'
  g.font = '800 30px Manrope'
  g.fillText('C E R T I F I K Á T', W / 2, 190)
  g.fillStyle = '#2A1D14'
  g.font = '900 110px "Cinzel Decorative"'
  g.fillText('Strážci', W / 2, 340)
  g.fillText('Říma', W / 2, 460)
  g.fillStyle = '#5A4330'
  g.font = '600 36px Manrope'
  g.fillText('Tímto se potvrzuje, že', W / 2, 560)
  g.fillStyle = '#7A2019'
  g.font = '900 64px Cinzel'
  g.fillText(o.names, W / 2, 650)
  g.fillStyle = '#5A4330'
  g.font = '600 36px Manrope'
  g.fillText('prošli všemi zkouškami a získali titul Strážci Říma.', W / 2, 720)
  // mince
  const cx = W / 2, cy = 880, r = 110
  const coin = g.createRadialGradient(cx - 35, cy - 40, 10, cx, cy, r)
  coin.addColorStop(0, '#F8DE93')
  coin.addColorStop(0.55, '#C8962E')
  coin.addColorStop(1, '#80581A')
  g.fillStyle = coin
  g.beginPath()
  g.arc(cx, cy, r, 0, Math.PI * 2)
  g.fill()
  g.strokeStyle = '#EFCB76'
  g.lineWidth = 8
  g.beginPath()
  g.arc(cx, cy, r - 14, 0, Math.PI * 2)
  g.stroke()
  g.fillStyle = '#5E410F'
  g.font = '900 72px Cinzel'
  g.fillText(String(o.total), cx, cy + 26)
  g.fillStyle = '#2A1D14'
  g.font = '800 38px Manrope'
  g.fillText(`${denaru(o.total)} ve společné pokladnici`, W / 2, 1050)
  g.fillStyle = '#5A4330'
  g.font = '600 30px Manrope'
  const placesLine = o.places.length ? o.places.join(' · ') : '—'
  const words = placesLine.split(' ')
  let line = ''
  let y = 1130
  g.fillText('Objevená místa:', W / 2, y)
  y += 48
  for (const w of words) {
    const test = line ? line + ' ' + w : w
    if (g.measureText(test).width > W - 220) { g.fillText(line, W / 2, y); line = w; y += 42 } else line = test
  }
  if (line) g.fillText(line, W / 2, y)
  g.fillStyle = '#9E2B25'
  g.font = '800 32px Manrope'
  g.fillText(o.dates, W / 2, H - 150)
  g.fillStyle = '#7A5A3A'
  g.font = '900 28px Cinzel'
  g.fillText('SPQR · Senatus Populusque Romanus', W / 2, H - 100)
  return new Promise<Blob>((res) => c.toBlob((b) => res(b!), 'image/png'))
}

// 16 · Certifikát
export function Certificate() {
  const { state, total } = useGame()
  const [busy, setBusy] = useState(false)
  const [preview, setPreview] = useState<string | null>(null)
  const embedded = window.self !== window.top
  const [a, b] = state.settings.names
  const places = PLACES.filter((p) => state.visited[p.id]).map((p) => p.name)
  const dates = tripDates(state.settings.tripStart, state.settings.tripEnd, state.finale?.at)
  const names = `${a} a ${b}`

  const save = async () => {
    setBusy(true)
    try {
      const blob = await renderPng({ names, total, places, dates })
      const stamp = new Date().toISOString().slice(0, 16).replace(/[-:T]/g, '')
      const file = new File([blob], `certifikat-strazci-rima-${stamp}.png`, { type: 'image/png' })
      if (navigator.canShare?.({ files: [file] })) {
        await navigator.share({ files: [file], title: 'Strážci Říma', text: `${names} jsou Strážci Říma!` })
      } else {
        // Bez sdílení (počítač, vložená stránka): ukázat obrázek, podržením prstu / pravým tlačítkem se uloží
        setPreview(URL.createObjectURL(blob))
      }
    } catch {
      /* sdílení zrušeno */
    } finally {
      setBusy(false)
    }
  }

  if (!state.finale) {
    return (
      <div className="screen bg-trav-c">
        <TopBar />
        <div style={{ padding: 28, textAlign: 'center', display: 'flex', flexDirection: 'column', gap: 16, alignItems: 'center' }}>
          <Seal size={90} style={{ fontSize: 30 }}>?</Seal>
          <p style={{ fontSize: 18, fontWeight: 700 }}>Certifikát dostanou jen skuteční Strážci Říma. Nejdřív rozluštěte velkou šifru.</p>
          <button className="btn-dark" onClick={() => go('mapa')}>Na mapu cesty</button>
        </div>
      </div>
    )
  }

  return (
    <div className="screen bg-bronze">
      <TopBar dark />
      <div className="screen-scroll">
        <div style={{ padding: '18px 14px 0' }}>
          <div className="rod" />
          <div className="parchment" style={{ margin: '-6px 10px 0', padding: '28px 20px', color: 'var(--ink)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10, textAlign: 'center', boxShadow: 'inset 0 0 0 3px var(--gold), inset 0 0 0 8px transparent, inset 0 0 0 9px var(--gold-lt), inset 0 0 20px rgba(122,90,58,.25)' }}>
            <div className="kicker">Certifikát</div>
            <h1 className="deco" style={{ fontSize: 38, lineHeight: 1 }}>Strážci<br />Říma</h1>
            <Divider />
            <p style={{ fontSize: 15, fontWeight: 600, color: 'var(--ink-2)' }}>Tímto se potvrzuje, že</p>
            <div className="cinzel" style={{ fontSize: 26, color: 'var(--red-text)' }}>{names}</div>
            <p style={{ fontSize: 15, fontWeight: 600, color: 'var(--ink-2)', lineHeight: 1.4 }}>prošli všemi zkouškami a získali titul Strážci Říma.</p>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, margin: '6px 0' }}>
              <Laurel width={28} height={62} />
              <Coin size={96} label={total} style={{ fontSize: 30 }} />
              <Laurel width={28} height={62} flip />
            </div>
            <div style={{ fontWeight: 800, fontSize: 16 }}>{denaru(total)} ve společné pokladnici</div>
            <div className="kicker brown" style={{ marginTop: 8 }}>Objevená místa</div>
            <p style={{ fontSize: 14, fontWeight: 700, lineHeight: 1.5 }}>{places.length ? places.join(' · ') : '—'}</p>
            <p style={{ marginTop: 8, fontSize: 15, fontWeight: 800, color: 'var(--red)' }}>{dates}</p>
            <div className="cinzel" style={{ fontSize: 13, color: 'var(--ink-3)' }}>SPQR</div>
          </div>
          <div className="rod" style={{ marginTop: -2 }} />
        </div>
        <div className="no-print" style={{ padding: '18px 18px calc(var(--safe-bottom) + 28px)', display: 'flex', flexDirection: 'column', gap: 10 }}>
          <button className="btn-primary" onClick={save} disabled={busy}>{busy ? 'Připravuji…' : 'Uložit / sdílet obrázek'}</button>
          {!embedded && <button className="btn-dark" onClick={() => window.print()}>Vytisknout</button>}
        </div>
      </div>
      {preview && (
        <div className="overlay" style={{ flexDirection: 'column', gap: 14 }} onClick={() => { URL.revokeObjectURL(preview); setPreview(null) }}>
          <img src={preview} alt="Certifikát Strážci Říma" style={{ maxWidth: '100%', maxHeight: '75%', borderRadius: 8 }} onClick={(e) => e.stopPropagation()} />
          <p style={{ color: 'var(--parch)', fontWeight: 700, textAlign: 'center' }}>Podržte prst na obrázku (nebo pravé tlačítko) a uložte ho. Ťuknutím mimo zavřete.</p>
        </div>
      )}
    </div>
  )
}
