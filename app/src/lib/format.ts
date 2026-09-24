export function denaru(n: number) {
  const a = Math.abs(n)
  if (a === 1) return 'denár'
  if (a >= 2 && a <= 4) return 'denáry'
  return 'denárů'
}

export const todayKey = (d = new Date()) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`

export const czk = (n: number) => n.toLocaleString('cs-CZ')

export function toRoman(n: number) {
  const map: [number, string][] = [[1000, 'M'], [900, 'CM'], [500, 'D'], [400, 'CD'], [100, 'C'], [90, 'XC'], [50, 'L'], [40, 'XL'], [10, 'X'], [9, 'IX'], [5, 'V'], [4, 'IV'], [1, 'I']]
  let out = ''
  for (const [v, s] of map) while (n >= v) { out += s; n -= v }
  return out
}
