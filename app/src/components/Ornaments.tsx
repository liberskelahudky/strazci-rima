import type { CSSProperties, ReactNode } from 'react'
import type { SealIcon } from '../data'

// Hvězdička / jiskra z návrhu
export function Star({ size = 14, color = 'var(--gold-hi)', style, className }: { size?: number; color?: string; style?: CSSProperties; className?: string }) {
  return (
    <svg className={className} style={style} width={size} height={size} viewBox="0 0 20 20" aria-hidden>
      <path d="M10 0L12 8L20 10L12 12L10 20L8 12L0 10L8 8Z" fill={color} />
    </svg>
  )
}

// Vavřínová ratolest. `leaves` 4 | 5 | 8 dle místa v návrhu, `flip` zrcadlí.
export function Laurel({ width = 28, height = 62, color = 'var(--gold-dk)', leaves = 5, flip, style }: { width?: number; height?: number; color?: string; leaves?: 4 | 5 | 8; flip?: boolean; style?: CSSProperties }) {
  return (
    <svg style={{ ...(flip ? { transform: 'scaleX(-1)' } : null), ...style }} width={width} height={height} viewBox="0 0 40 90" aria-hidden>
      <path d="M34 88 Q6 60 20 4" fill="none" stroke={color} strokeWidth="2.5" />
      <g fill={color}>
        <ellipse cx="29" cy="76" rx="4" ry="9" transform="rotate(-50 29 76)" />
        <ellipse cx="21" cy="64" rx="4" ry="9" transform="rotate(-40 21 64)" />
        <ellipse cx="15" cy="50" rx="4" ry="9" transform="rotate(-25 15 50)" />
        <ellipse cx="14" cy="35" rx="4" ry="9" transform="rotate(-10 14 35)" />
        {leaves >= 5 && <ellipse cx="16" cy="20" rx="4" ry="8" transform="rotate(5 16 20)" />}
        {leaves === 8 && (
          <>
            <ellipse cx="34" cy="64" rx="3.5" ry="8" transform="rotate(40 34 64)" />
            <ellipse cx="27" cy="48" rx="3.5" ry="8" transform="rotate(30 27 48)" />
            <ellipse cx="25" cy="32" rx="3.5" ry="8" transform="rotate(25 25 32)" />
          </>
        )}
      </g>
    </svg>
  )
}

export function Laurels({ children, width, height, color, gap = 4, leaves }: { children: ReactNode; width?: number; height?: number; color?: string; gap?: number; leaves?: 4 | 5 | 8 }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap }}>
      <Laurel width={width} height={height} color={color} leaves={leaves} />
      {children}
      <Laurel width={width} height={height} color={color} leaves={leaves} flip />
    </div>
  )
}

// Denár – ražená mince
export function Coin({ size = 18, label, style, className, glow }: { size?: number; label?: ReactNode; style?: CSSProperties; className?: string; glow?: boolean }) {
  const big = size >= 40
  const ring = size >= 100 ? [4, 8] : size >= 60 ? [3, 6] : [2, 0]
  return (
    <span
      className={className}
      style={{
        width: size,
        height: size,
        flex: 'none',
        borderRadius: '50%',
        background: 'var(--coin)',
        boxShadow: big
          ? `inset 0 0 0 ${ring[0]}px var(--gold-mid), inset 0 0 0 ${ring[1]}px var(--gold-lt), 0 ${Math.round(size / 25) + 1}px 0 var(--gold-deep)${glow ? ', 0 0 40px rgba(248,222,147,.6)' : ''}`
          : undefined,
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: 'var(--f-cinzel)',
        fontWeight: 900,
        fontSize: Math.round(size * 0.34),
        color: 'var(--gold-deep)',
        textShadow: big ? '0 1px 0 var(--gold-hi)' : undefined,
        ...style,
      }}
    >
      {label}
    </span>
  )
}

// Vosková pečeť s římskou číslicí nebo ikonou
export function Seal({ size = 60, children, style, className }: { size?: number; children?: ReactNode; style?: CSSProperties; className?: string }) {
  const r = size >= 150 ? [8, 12] : size >= 56 ? [4, 6] : [3, 5]
  return (
    <div
      className={className}
      style={{
        width: size,
        height: size,
        flex: 'none',
        borderRadius: '50%',
        background: 'var(--seal)',
        boxShadow: `inset 0 0 0 ${r[0]}px var(--red-ring), inset 0 0 0 ${r[1]}px rgba(255,220,200,.35), 0 3px 6px rgba(0,0,0,.25)`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: 'var(--f-cinzel)',
        fontWeight: 900,
        fontSize: Math.round(size / 3),
        color: 'var(--red-ink)',
        ...style,
      }}
    >
      {children}
    </div>
  )
}

export function Keyhole({ width = 20, height = 28, color = 'var(--gold)' }: { width?: number; height?: number; color?: string }) {
  return (
    <svg width={width} height={height} viewBox="0 0 20 28" aria-hidden>
      <circle cx="10" cy="8" r="7" fill={color} />
      <path d="M6 12H14L16 27H4Z" fill={color} />
    </svg>
  )
}

export function Compass({ size = 46 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 46 46" aria-hidden>
      <circle cx="23" cy="23" r="20" fill="none" stroke="var(--gold)" strokeWidth="1.5" />
      <circle cx="23" cy="23" r="15" fill="none" stroke="var(--gold)" strokeWidth="1" strokeDasharray="2 3" />
      <path d="M23 2L26 20L23 23L20 20Z" fill="var(--red)" />
      <path d="M23 44L26 26L23 23L20 26Z" fill="var(--sand)" />
      <path d="M2 23L20 20L23 23L20 26Z" fill="var(--sand)" />
      <path d="M44 23L26 20L23 23L26 26Z" fill="var(--sand)" />
    </svg>
  )
}

export function ColumnIcon({ color = 'var(--ink-3)', size = 34 }: { color?: string; size?: number }) {
  return (
    <svg width={size * 0.88} height={size} viewBox="0 0 30 34" aria-hidden>
      <g fill={color}>
        <rect x="2" y="0" width="26" height="5" rx="1" />
        <rect x="5" y="6" width="20" height="3" />
        <rect x="7" y="10" width="3" height="18" />
        <rect x="13.5" y="10" width="3" height="18" />
        <rect x="20" y="10" width="3" height="18" />
        <rect x="3" y="29" width="24" height="5" rx="1" />
      </g>
    </svg>
  )
}

export function CompassIcon({ size = 34 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 34 34" aria-hidden>
      <circle cx="17" cy="17" r="15" fill="none" stroke="var(--ink-3)" strokeWidth="2.5" />
      <path d="M17 4L20 17L17 30L14 17Z" fill="var(--red)" />
      <path d="M4 17L17 14L30 17L17 20Z" fill="var(--ink-3)" />
    </svg>
  )
}

// Meandr – řecko-římský vzor na okraji karet
export function Meander({ id, color = 'var(--gold)' }: { id: string; color?: string }) {
  return (
    <svg style={{ display: 'block', width: '100%' }} height="12" aria-hidden>
      <defs>
        <pattern id={id} width="24" height="12" patternUnits="userSpaceOnUse">
          <path d="M0 11H20V1H4V8H14V4" fill="none" stroke={color} strokeWidth="2" />
        </pattern>
      </defs>
      <rect width="100%" height="12" fill={`url(#${id})`} />
    </svg>
  )
}

export function Divider({ width = 120 }: { width?: number }) {
  return (
    <svg width={width} height="12" viewBox="0 0 120 12" aria-hidden>
      <path d="M0 6H48M72 6H120" stroke="var(--gold)" strokeWidth="1.5" />
      <path d="M60 0L66 6L60 12L54 6Z" fill="var(--red)" />
    </svg>
  )
}

// Paprsky za pokladem / tajnou misí
export function Rays({ size = 480, color = 'rgba(200,150,46,.16)', style, spin }: { size?: number; color?: string; style?: CSSProperties; spin?: boolean }) {
  return (
    <div
      className={spin ? 'rays-spin' : undefined}
      aria-hidden
      style={{
        position: 'absolute',
        width: size,
        height: size,
        borderRadius: '50%',
        background: `repeating-conic-gradient(from 0deg, ${color} 0 7deg, transparent 7deg 20deg)`,
        WebkitMask: 'radial-gradient(circle, #000 15%, transparent 65%)',
        mask: 'radial-gradient(circle, #000 15%, transparent 65%)',
        pointerEvents: 'none',
        ...style,
      }}
    />
  )
}

// Ikony pečetí pro jednotlivé kapitoly
export function SealGlyph({ icon, size = 24, color = 'var(--red-ink)' }: { icon: SealIcon; size?: number; color?: string }) {
  const p = { width: size, height: size, viewBox: '0 0 24 24', 'aria-hidden': true } as const
  switch (icon) {
    case 'wolf':
      return (
        <svg {...p}><path fill={color} d="M4 3l4 5h8l4-5v9c0 4-3.6 8-8 9-4.4-1-8-5-8-9V3zm5 9a1.2 1.2 0 100 2.4A1.2 1.2 0 009 12zm6 0a1.2 1.2 0 100 2.4 1.2 1.2 0 000-2.4zm-3 4l-2 1.5h4L12 16z" /></svg>
      )
    case 'laurel':
      return (
        <svg {...p} fill="none" stroke={color} strokeWidth="1.8"><path d="M7 21C3 16 3 9 7 4M17 21c4-5 4-12 0-17" /><g fill={color} stroke="none"><ellipse cx="5" cy="16" rx="1.6" ry="3" transform="rotate(-40 5 16)" /><ellipse cx="4.2" cy="11" rx="1.6" ry="3" transform="rotate(-10 4.2 11)" /><ellipse cx="5.5" cy="6.5" rx="1.4" ry="2.6" transform="rotate(20 5.5 6.5)" /><ellipse cx="19" cy="16" rx="1.6" ry="3" transform="rotate(40 19 16)" /><ellipse cx="19.8" cy="11" rx="1.6" ry="3" transform="rotate(10 19.8 11)" /><ellipse cx="18.5" cy="6.5" rx="1.4" ry="2.6" transform="rotate(-20 18.5 6.5)" /></g></svg>
      )
    case 'helmet':
      return (
        <svg {...p}><path fill={color} d="M12 2c-1 0-2 .6-2 1.5V5C6 6 4 9.5 4 13v6h5v-5h6v5h5v-6c0-3.5-2-7-6-8V3.5C14 2.6 13 2 12 2zM9 9h6v3H9z" /></svg>
      )
    case 'cauldron':
      return (
        <svg {...p}><path fill={color} d="M3 9h18v2h-1c0 5-3.6 9-8 9s-8-4-8-9H3z" /><path fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" d="M8 3c1.2 1-1.2 2 0 4M12 2c1.2 1-1.2 2 0 4M16 3c1.2 1-1.2 2 0 4" /></svg>
      )
    case 'wheel':
      return (
        <svg {...p} fill="none" stroke={color} strokeWidth="2"><circle cx="12" cy="12" r="9" /><circle cx="12" cy="12" r="2.5" fill={color} /><path d="M12 3v6.5M12 14.5V21M3 12h6.5M14.5 12H21M5.6 5.6l4.6 4.6M13.8 13.8l4.6 4.6M18.4 5.6l-4.6 4.6M10.2 13.8l-4.6 4.6" /></svg>
      )
    case 'ball':
      return (
        <svg {...p}><circle cx="12" cy="12" r="9" fill="none" stroke={color} strokeWidth="2" /><path fill={color} d="M12 7.5l3.8 2.8-1.5 4.4H9.7l-1.5-4.4z" /></svg>
      )
    case 'cipher':
      return (
        <svg {...p}><text x="12" y="17" textAnchor="middle" fontFamily="Cinzel, serif" fontWeight="900" fontSize="12" fill={color}>SPQR</text></svg>
      )
  }
}
