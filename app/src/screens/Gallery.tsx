import { useState } from 'react'
import { usePhotos, deletePhoto } from '../state/photos'
import { findMission, placeById } from '../data'
import { go } from '../lib/router'
import { LupaSays } from '../components/Illustrations'
import { TopBar } from '../components/UI'

const GROUPS: { id: string; label: string; test: (key: string) => boolean }[] = [
  { id: 'vse', label: 'Vše', test: () => true },
  { id: 'mista', label: 'Památky', test: (k) => k.startsWith('place:') || !!findMission(k)?.place },
  { id: 'auta', label: 'Auta', test: (k) => !!findMission(k)?.tags.includes('auta') },
  { id: 'jidlo', label: 'Jídlo', test: (k) => !!findMission(k)?.tags.includes('jidlo') },
  { id: 'symboly', label: 'Symboly', test: (k) => ['vlcice', 'caesar', 'derby'].includes(findMission(k)?.world ?? '') },
  { id: 'vtipne', label: 'Foto lov', test: (k) => findMission(k)?.world === 'fotolov' },
]

// 14 · Galerie úlovků – vzniká automaticky z fotek u misí
export function Gallery() {
  const photos = usePhotos()
  const [group, setGroup] = useState('vse')
  const [open, setOpen] = useState<string | null>(null)
  const g = GROUPS.find((x) => x.id === group)!
  const list = photos.filter((p) => g.test(p.key))
  const big = photos.find((p) => p.key === open)

  return (
    <div className="screen bg-trav-c">
      <TopBar />
      <div className="screen-scroll">
        <div style={{ padding: '16px 20px 6px' }}>
          <div className="kicker">{photos.length} úlovků</div>
          <h1 className="deco" style={{ fontSize: 26 }}>Galerie výpravy</h1>
        </div>
        <div style={{ display: 'flex', gap: 8, overflowX: 'auto', padding: '10px 18px', scrollbarWidth: 'none' }}>
          {GROUPS.map((x) => (
            <button key={x.id} className={'chip' + (group === x.id ? ' on' : '')} onClick={() => setGroup(x.id)}>{x.label}</button>
          ))}
        </div>
        {photos.length === 0 ? (
          <div style={{ padding: '10px 18px' }}>
            <LupaSays>Zatím tu nic není. U foto misí můžete vyfotit úlovek – objeví se tady.</LupaSays>
            <button className="btn-dark" style={{ marginTop: 16 }} onClick={() => go('mise')}>Najít foto misi</button>
          </div>
        ) : (
          <div style={{ padding: '4px 18px 24px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            {list.map((p) => (
              <button key={p.key} onClick={() => setOpen(p.key)} style={{ borderRadius: 16, overflow: 'hidden', background: '#fff', boxShadow: '0 0 0 1px var(--line), 0 3px 0 var(--sand-shadow)', textAlign: 'left' }}>
                <img src={p.url} alt={p.label} style={{ width: '100%', aspectRatio: '1', objectFit: 'cover', display: 'block' }} />
                <div style={{ padding: '8px 10px', fontSize: 13, fontWeight: 800, lineHeight: 1.25 }}>{p.label}</div>
              </button>
            ))}
          </div>
        )}
      </div>
      {big && (
        <div className="overlay" onClick={() => setOpen(null)} style={{ flexDirection: 'column', gap: 14 }}>
          <img src={big.url} alt={big.label} style={{ maxWidth: '100%', maxHeight: '65%', borderRadius: 16, boxShadow: '0 0 0 4px var(--gold-lt)' }} />
          <div className="ribbon">{big.label}</div>
          <div style={{ display: 'flex', gap: 10 }} onClick={(e) => e.stopPropagation()}>
            {(() => {
              const m = findMission(big.key)
              const pl = big.key.startsWith('place:') ? placeById(big.key.slice(6)) : undefined
              const target = m ? 'mise-detail/' + m.id : pl ? 'misto/' + pl.id : null
              return target ? <button className="btn-sand" onClick={() => go(target)}>Otevřít misi</button> : null
            })()}
            <button className="btn-sand" onClick={() => { void deletePhoto(big.key); setOpen(null) }}>Smazat</button>
          </div>
        </div>
      )}
    </div>
  )
}
