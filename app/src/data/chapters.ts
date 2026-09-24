// Putování Strážců Říma – milníky na svitku. `unlockAt` = kolik denárů musí tým celkem získat.
export type SealIcon = 'wolf' | 'laurel' | 'helmet' | 'cauldron' | 'wheel' | 'ball' | 'cipher'

export interface Chapter {
  id: string
  numeral: string
  name: string
  unlockAt: number
  teaser: string // co se ukáže na zamčené obrazovce
  reveal: string // text po dramatickém odemčení
  icon: SealIcon
  letter: string // písmeno do závěrečné šifry
}

export const CHAPTERS: Chapter[] = [
  {
    id: 'vlcice', numeral: 'I', name: 'Zkouška vlčice', unlockAt: 0, icon: 'wolf', letter: 'A',
    teaser: 'Každý strážce začíná u vlčice.',
    reveal: 'Město na sedmi pahorcích vás vítá. Najděte první stopy starého Říma.',
  },
  {
    id: 'caesar', numeral: 'II', name: 'Caesarova stopa', unlockAt: 20, icon: 'laurel', letter: 'Q',
    teaser: 'Někdo slavný tu nechal vavřínový věnec.',
    reveal: 'Julius Caesar dobyl Galii a změnil Řím navždy. Ale byl to opravdu císař?',
  },
  {
    id: 'arena', numeral: 'III', name: 'Aréna gladiátorů', unlockAt: 40, icon: 'helmet', letter: 'U',
    teaser: 'V aréně se něco šustne.',
    reveal: 'Brány arény se otevírají. Gladiátor, nebo legionář? Poznáte rozdíl?',
  },
  {
    id: 'galska', numeral: 'IV', name: 'Tajná galská mise', unlockAt: 60, icon: 'cauldron', letter: 'I',
    teaser: 'V Galii zmizelo něco důležitého. Obelix by věděl co.',
    reveal: 'Druid Panoramix ztratil recept na kouzelný lektvar! Stopy vedou přímo do Říma.',
  },
  {
    id: 'ori', numeral: 'V', name: 'Lov železných ořů', unlockAt: 80, icon: 'wheel', letter: 'L',
    teaser: 'Po římských ulicích se prohánějí oři bez kopyt.',
    reveal: 'Fiat, Alfa, Ferrari, Vespa… Železní oři se schovávají v každé ulici. Lov začíná!',
  },
  {
    id: 'derby', numeral: 'VI', name: 'Římské derby', unlockAt: 100, icon: 'ball', letter: 'A',
    teaser: 'Vlčice a orel. Dva kluby, jedno město.',
    reveal: 'AS Roma, nebo Lazio? Řím má dvě fotbalová srdce. Najděte je obě.',
  },
  {
    id: 'sifra', numeral: 'VII', name: 'Velká římská šifra', unlockAt: 120, icon: 'cipher', letter: '',
    teaser: 'Poslední tajemství spojí všechno, co jste objevili.',
    reveal: 'Pečetě jsou sebrané. Teď je čas rozluštit velkou šifru a stát se Strážci Říma.',
  },
]

export const FINALE_WORD = 'AQUILA' // písmena pečetí I–VI; aquila = orel legie

export interface Rank {
  id: string
  numeral: string
  name: string // tým = množné číslo
  singular: string
  at: number
}

export const RANKS: Rank[] = [
  { id: 'poutnik', numeral: 'I', name: 'Poutníci', singular: 'Poutník', at: 0 },
  { id: 'pruzkumnik', numeral: 'II', name: 'Průzkumníci', singular: 'Průzkumník', at: 20 },
  { id: 'legionar', numeral: 'III', name: 'Legionáři', singular: 'Legionář', at: 60 },
  { id: 'centurion', numeral: 'IV', name: 'Centurioni', singular: 'Centurion', at: 100 },
  { id: 'strazce', numeral: 'V', name: 'Strážci Říma', singular: 'Strážce Říma', at: Infinity }, // po finále
]

export function rankFor(earned: number, finaleDone: boolean): Rank {
  if (finaleDone) return RANKS[4]
  return [...RANKS].slice(0, 4).reverse().find((r) => earned >= r.at) ?? RANKS[0]
}

export function unlockedChapters(earned: number) {
  return CHAPTERS.filter((c) => earned >= c.unlockAt)
}

export function nextChapter(earned: number) {
  return CHAPTERS.find((c) => earned < c.unlockAt)
}
