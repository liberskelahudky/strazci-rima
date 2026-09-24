import type { CSSProperties, ReactNode } from 'react'
import type { Scene as SceneId } from '../data'
import { usePhoto } from '../state/photos'

// Průvodkyně vlčice Lupa – knižní portrét v kulatém rámu
export function LupaFace({ style }: { style?: CSSProperties }) {
  return (
    <svg viewBox="0 0 100 100" width="100%" height="100%" style={{ display: 'block', ...style }} aria-label="Vlčice Lupa">
      <defs>
        <radialGradient id="lupa-bg" cx=".4" cy=".3" r=".8"><stop offset="0" stopColor="#FFF3D6" /><stop offset="1" stopColor="#E3C99A" /></radialGradient>
        <linearGradient id="lupa-fur" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#9A8672" /><stop offset="1" stopColor="#6E5A48" /></linearGradient>
      </defs>
      <rect width="100" height="100" fill="url(#lupa-bg)" />
      <path d="M50 96 C30 96 18 90 18 100 H82 C82 90 70 96 50 96Z" fill="#9E2B25" />
      <path d="M22 8 L40 34 L20 44Z" fill="#6E5A48" />
      <path d="M78 8 L60 34 L80 44Z" fill="#6E5A48" />
      <path d="M26 16 L37 33 L25 39Z" fill="#E8B9A0" />
      <path d="M74 16 L63 33 L75 39Z" fill="#E8B9A0" />
      <path d="M50 26 C30 26 20 42 22 58 C24 72 38 84 50 92 C62 84 76 72 78 58 C80 42 70 26 50 26Z" fill="url(#lupa-fur)" />
      <path d="M50 50 C40 50 30 58 32 68 C34 78 44 86 50 88 C56 86 66 78 68 68 C70 58 60 50 50 50Z" fill="#EFE3CE" />
      <path d="M34 44 C38 40 44 41 46 46" stroke="#4A3626" strokeWidth="2.2" fill="none" strokeLinecap="round" />
      <path d="M66 44 C62 40 56 41 54 46" stroke="#4A3626" strokeWidth="2.2" fill="none" strokeLinecap="round" />
      <circle cx="40" cy="52" r="4.2" fill="#2A1D14" />
      <circle cx="60" cy="52" r="4.2" fill="#2A1D14" />
      <circle cx="41.4" cy="50.6" r="1.4" fill="#fff" />
      <circle cx="61.4" cy="50.6" r="1.4" fill="#fff" />
      <ellipse cx="50" cy="64" rx="6" ry="4.2" fill="#2A1D14" />
      <path d="M50 68 V73 M43 74 C46 78 54 78 57 74" stroke="#2A1D14" strokeWidth="2" fill="none" strokeLinecap="round" />
      <circle cx="50" cy="93" r="4" fill="#EFCB76" stroke="#A77A22" strokeWidth="1.2" />
    </svg>
  )
}

export function Lupa({ size = 58 }: { size?: number }) {
  return (
    <div style={{ width: size, height: size, flex: 'none', borderRadius: '50%', padding: 3, background: 'linear-gradient(var(--gold-lt), var(--gold-mid))' }}>
      <div style={{ width: '100%', height: '100%', borderRadius: '50%', overflow: 'hidden' }}>
        <LupaFace />
      </div>
    </div>
  )
}

export function LupaSays({ children, size = 58, style }: { children: ReactNode; size?: number; style?: CSSProperties }) {
  return (
    <div style={{ display: 'flex', alignItems: 'flex-end', gap: 10, ...style }}>
      <Lupa size={size} />
      <div className="speech">{children}</div>
    </div>
  )
}

// Titulní ilustrace: Saša a Bertík s Lupou před arénou při západu slunce
export function SplashHero() {
  return (
    <svg viewBox="0 0 170 290" width="100%" height="100%" preserveAspectRatio="xMidYMid slice" style={{ display: 'block' }} aria-label="Saša a Bertík s vlčicí Lupou před Koloseem">
      <defs>
        <linearGradient id="sh-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#3A1A14" /><stop offset=".45" stopColor="#8A3A1E" /><stop offset=".75" stopColor="#E0A14A" /><stop offset="1" stopColor="#F8DE93" />
        </linearGradient>
        <radialGradient id="sh-sun" cx=".5" cy=".5" r=".5"><stop offset="0" stopColor="#FFF3D6" /><stop offset=".6" stopColor="#F8DE93" /><stop offset="1" stopColor="#F8DE93" stopOpacity="0" /></radialGradient>
      </defs>
      <rect width="170" height="290" fill="url(#sh-sky)" />
      <circle cx="85" cy="176" r="46" fill="url(#sh-sun)" />
      <g fill="#F8DE93" opacity=".9">
        <path d="M30 40l1.5 5 5 1.5-5 1.5-1.5 5-1.5-5-5-1.5 5-1.5z" />
        <path d="M130 62l1 3.5 3.5 1-3.5 1-1 3.5-1-3.5-3.5-1 3.5-1z" />
        <path d="M100 30l1 3 3 1-3 1-1 3-1-3-3-1 3-1z" />
      </g>
      {/* Koloseum */}
      <g fill="#6B2A18">
        <path d="M0 214 Q85 150 170 204 V250 H0Z" />
      </g>
      <g fill="#8A3A1E">
        {Array.from({ length: 9 }, (_, i) => (
          <rect key={'a' + i} x={6 + i * 18} y={200 - Math.sin((i / 8) * Math.PI) * 18} width="9" height="14" rx="4.5" />
        ))}
        {Array.from({ length: 9 }, (_, i) => (
          <rect key={'b' + i} x={6 + i * 18} y={222 - Math.sin((i / 8) * Math.PI) * 10} width="9" height="14" rx="4.5" />
        ))}
      </g>
      <rect y="244" width="170" height="46" fill="#3A1A14" />
      {/* Bertík (menší) */}
      <g fill="#2A1D14">
        <circle cx="70" cy="206" r="8" />
        <path d="M61 250 L63 222 Q70 214 77 222 L79 250 H74 L72 236 H68 L66 250Z" />
        <path d="M63 223 L54 235 L57 237 L65 228Z" />
      </g>
      {/* Saša (větší) s mapou */}
      <g fill="#2A1D14">
        <circle cx="96" cy="196" r="9" />
        <path d="M86 250 L88 216 Q96 206 104 216 L106 250 H100 L98 232 H94 L92 250Z" />
        <path d="M104 218 L116 210 L118 213 L106 223Z" />
        <path d="M88 220 L78 226 L79 229 L89 225Z" />
      </g>
      <rect x="114" y="200" width="16" height="12" rx="2" fill="#F4E4C1" transform="rotate(-12 122 206)" />
      <path d="M117 204h10M117 207h7" stroke="#9E2B25" strokeWidth="1" transform="rotate(-12 122 206)" />
      {/* Lupa */}
      <g fill="#2A1D14">
        <path d="M22 250 L24 234 Q26 224 38 222 L50 222 Q54 222 56 226 L58 250 H53 L51 236 L34 238 L30 250Z" />
        <path d="M48 222 L50 206 L55 214 L60 208 L60 220 Q66 222 64 226 L54 228Z" />
        <path d="M24 232 Q14 230 12 220 Q20 228 26 228Z" />
      </g>
      <path d="M0 250 H170" stroke="#D9A24A" strokeWidth="1.5" opacity=".6" />
    </svg>
  )
}

// ── Scény památek (když rodina nevyfotí vlastní fotku) ──
const SKY: Record<SceneId, [string, string, string]> = {
  koloseum: ['#F6C987', '#E9A860', '#C9773A'],
  forum: ['#F8E2B0', '#F0C27E', '#D99A55'],
  pantheon: ['#CFE0E8', '#F2E3C4', '#E7C38B'],
  palatin: ['#F8D9A0', '#EDB06B', '#C47A45'],
  trevi: ['#D6E6EC', '#F4E7CA', '#EBCB93'],
  navona: ['#F5D6A6', '#EDB47A', '#C9844C'],
  schody: ['#F9DDB9', '#F2BE8E', '#D8905E'],
  petr: ['#D3E1EA', '#F3E3C5', '#E3BE87'],
  sixtina: ['#2A1D14', '#3A2A1C', '#2A1D14'],
}

function SceneArt({ id }: { id: SceneId }) {
  const stone = '#E9D7B2'
  const stoneDk = '#C9A96E'
  const shade = '#9C7A4E'
  switch (id) {
    case 'koloseum':
      return (
        <g>
          <path d="M20 250 V120 Q195 70 370 120 V250Z" fill={stone} />
          <path d="M300 250 V112 Q335 118 370 128 V250Z" fill={stoneDk} />
          <path d="M300 112 L312 96 L330 104 L346 94 L370 112" fill={stone} />
          {[0, 1, 2].map((row) =>
            Array.from({ length: 12 }, (_, i) => {
              const x = 30 + i * 28
              const curve = Math.sin(((x - 20) / 350) * Math.PI) * 26
              return <rect key={row + '-' + i} x={x} y={140 + row * 36 - curve} width="16" height="26" rx="8" fill={shade} opacity={0.85 - row * 0.1} />
            }),
          )}
          <path d="M20 128 Q195 80 370 128" stroke={shade} strokeWidth="3" fill="none" />
          <path d="M20 164 Q195 116 370 164" stroke={shade} strokeWidth="2" fill="none" opacity=".6" />
        </g>
      )
    case 'forum':
      return (
        <g>
          <path d="M0 250 L0 220 Q100 200 200 214 T390 206 V250Z" fill={stoneDk} />
          {[60, 92, 124].map((x) => (
            <g key={x}><rect x={x} y="96" width="18" height="130" fill={stone} /><rect x={x - 5} y="88" width="28" height="10" fill={stone} /></g>
          ))}
          <rect x="52" y="78" width="98" height="12" fill={stone} />
          <rect x="232" y="120" width="120" height="100" fill={stone} />
          <path d="M268 220 V170 A24 24 0 0 1 316 170 V220Z" fill={shade} />
          <rect x="226" y="108" width="132" height="14" fill={stoneDk} />
          <rect x="180" y="176" width="14" height="46" fill={stone} />
          <rect x="176" y="170" width="22" height="8" fill={stone} />
        </g>
      )
    case 'pantheon':
      return (
        <g>
          <path d="M110 130 A85 60 0 0 1 280 130Z" fill={stoneDk} />
          <rect x="185" y="66" width="20" height="6" rx="3" fill={shade} />
          <path d="M84 132 L195 84 L306 132Z" fill={stone} />
          <path d="M104 126 L195 92 L286 126Z" fill={stoneDk} />
          <rect x="80" y="132" width="230" height="14" fill={stone} />
          {Array.from({ length: 8 }, (_, i) => <rect key={i} x={90 + i * 28} y="146" width="14" height="86" fill={stone} />)}
          <rect x="70" y="232" width="250" height="18" fill={stoneDk} />
        </g>
      )
    case 'palatin':
      return (
        <g>
          <path d="M0 250 V180 Q120 120 250 150 T390 140 V250Z" fill="#B9955E" />
          {[70, 300].map((x) => (
            <g key={x}>
              <rect x={x - 4} y="80" width="8" height="90" fill="#5A4330" />
              <ellipse cx={x} cy="80" rx="46" ry="20" fill="#5E6B3A" />
              <ellipse cx={x - 14} cy="72" rx="26" ry="12" fill="#6F7D45" />
            </g>
          ))}
          <g fill={stone}>
            <path d="M140 200 V150 H250 V200 H232 V170 A18 18 0 0 0 196 170 V200 H176 V170 A18 18 0 0 0 158 170 V200Z" />
          </g>
        </g>
      )
    case 'trevi':
      return (
        <g>
          <rect x="30" y="60" width="330" height="140" fill={stone} />
          <rect x="24" y="52" width="342" height="14" fill={stoneDk} />
          {[50, 90, 290, 330].map((x) => <rect key={x} x={x} y="70" width="10" height="130" fill={stoneDk} />)}
          <path d="M160 200 V110 A35 35 0 0 1 230 110 V200Z" fill={shade} />
          <circle cx="195" cy="150" r="14" fill={stone} />
          <path d="M183 200 V168 Q195 160 207 168 V200Z" fill={stone} />
          <path d="M40 200 Q100 188 160 204 L230 204 Q300 188 350 200 V214 H40Z" fill="#CDB891" />
          <rect x="20" y="214" width="350" height="36" fill="#6FB2C4" />
          <path d="M30 226 Q60 220 90 226 T150 226 T210 226 T270 226 T330 226" stroke="#DDF0F4" strokeWidth="2" fill="none" />
        </g>
      )
    case 'navona':
      return (
        <g>
          <path d="M240 150 A50 50 0 0 1 340 150Z" fill={stoneDk} />
          <rect x="230" y="150" width="120" height="80" fill={stone} />
          <rect x="280" y="92" width="20" height="10" fill={stoneDk} />
          <path d="M150 230 L160 190 L170 230Z" fill={stoneDk} />
          <path d="M156 190 L160 50 L164 190Z" fill={stone} />
          <path d="M160 40 L166 52 H154Z" fill={stoneDk} />
          <path d="M112 196 Q160 170 208 196 L200 230 H120Z" fill={stone} />
          <ellipse cx="160" cy="236" rx="100" ry="14" fill="#6FB2C4" />
          <rect x="30" y="170" width="80" height="60" fill="#E7B98A" />
          {[42, 70].map((x) => <rect key={x} x={x} y="184" width="14" height="20" fill={shade} />)}
        </g>
      )
    case 'schody':
      return (
        <g>
          <rect x="130" y="60" width="130" height="80" fill={stone} />
          <rect x="130" y="30" width="26" height="40" fill={stone} />
          <rect x="234" y="30" width="26" height="40" fill={stone} />
          <path d="M130 30 L143 16 L156 30Z M234 30 L247 16 L260 30Z" fill={stoneDk} />
          <path d="M180 140 V100 A15 15 0 0 1 210 100 V140Z" fill={shade} />
          {Array.from({ length: 9 }, (_, i) => (
            <rect key={i} x={150 - i * 14} y={140 + i * 12} width={90 + i * 28} height="12" fill={i % 2 ? stone : stoneDk} />
          ))}
          <ellipse cx="195" cy="250" rx="50" ry="10" fill="#6FB2C4" />
          <path d="M160 246 Q195 226 230 246Z" fill={shade} />
        </g>
      )
    case 'petr':
      return (
        <g>
          <path d="M140 118 A55 62 0 0 1 250 118Z" fill={stoneDk} />
          <rect x="188" y="46" width="14" height="14" fill={stoneDk} />
          <path d="M195 30 V46 M189 36 H201" stroke={stoneDk} strokeWidth="3" />
          <rect x="130" y="116" width="130" height="14" fill={stone} />
          <rect x="90" y="130" width="210" height="96" fill={stone} />
          {Array.from({ length: 8 }, (_, i) => <rect key={i} x={100 + i * 26} y="140" width="10" height="86" fill={stoneDk} />)}
          <path d="M0 250 V206 H80 V226 H0Z M310 226 V206 H390 V226Z" fill={stone} />
          {Array.from({ length: 6 }, (_, i) => <rect key={'l' + i} x={6 + i * 13} y="208" width="5" height="18" fill={shade} />)}
          {Array.from({ length: 6 }, (_, i) => <rect key={'r' + i} x={316 + i * 13} y="208" width="5" height="18" fill={shade} />)}
          <rect x="0" y="226" width="390" height="24" fill="#CDB891" />
        </g>
      )
    case 'sixtina':
      return (
        <g>
          <rect x="24" y="30" width="342" height="210" rx="6" fill="#C9A96E" />
          <rect x="36" y="42" width="318" height="186" fill="#D9C7A0" />
          <path d="M36 150 Q120 120 200 150 T354 140 V228 H36Z" fill="#B7C7C9" opacity=".6" />
          <path d="M60 140 Q100 130 150 138 L168 134" stroke="#D9A07A" strokeWidth="10" strokeLinecap="round" fill="none" />
          <path d="M330 110 Q280 120 232 132 L214 136" stroke="#D9A07A" strokeWidth="10" strokeLinecap="round" fill="none" />
          <circle cx="170" cy="134" r="2" fill="#D9A07A" />
          <circle cx="212" cy="136" r="2" fill="#D9A07A" />
          <g fill="#F8DE93" className="twinkle"><path d="M191 128l2 6 6 2-6 2-2 6-2-6-6-2 6-2z" /></g>
        </g>
      )
  }
}

export function Scene({ id, style }: { id: SceneId; style?: CSSProperties }) {
  const [a, b, c] = SKY[id]
  return (
    <svg viewBox="0 0 390 300" width="100%" height="100%" preserveAspectRatio="xMidYMid slice" style={{ display: 'block', ...style }} aria-hidden>
      <defs>
        <linearGradient id={'sky-' + id} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={a} /><stop offset=".6" stopColor={b} /><stop offset="1" stopColor={c} />
        </linearGradient>
      </defs>
      <rect width="390" height="300" fill={`url(#sky-${id})`} />
      {id !== 'sixtina' && <circle cx="320" cy="60" r="24" fill="#FFF3D6" opacity=".8" />}
      <SceneArt id={id} />
      {id !== 'sixtina' && <rect y="250" width="390" height="50" fill="#B9955E" />}
    </svg>
  )
}

// Fotka rodiny má přednost před ilustrací
export function PlaceImage({ place, scene }: { place: string; scene: SceneId }) {
  const photo = usePhoto('place:' + place)
  if (photo) return <img src={photo.url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
  return <Scene id={scene} />
}
