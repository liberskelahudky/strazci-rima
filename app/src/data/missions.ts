export type Filter = 'rychle' | 'venku' | 'jidlo' | 'historie' | 'auta' | 'fotbal' | 'foto' | 'prodva'

export const FILTERS: { id: Filter; label: string }[] = [
  { id: 'rychle', label: 'Rychlé' },
  { id: 'venku', label: 'Venku' },
  { id: 'jidlo', label: 'Jídlo' },
  { id: 'historie', label: 'Historie' },
  { id: 'auta', label: 'Auta' },
  { id: 'fotbal', label: 'Fotbal' },
  { id: 'foto', label: 'Foto' },
  { id: 'prodva', label: 'Pro dva' },
]

export type Kind =
  | 'lov' | 'foto' | 'tip' | 'detektivka' | 'pozorovacka' | 'kviz' | 'pamet' | 'sifra' | 'tvoriva'
  | 'stavba' | 'jazyk' | 'ochutnavka' | 'carspot' | 'fotbal' | 'casova' | 'kooperace'

export const KIND_LABEL: Record<Kind, string> = {
  lov: 'Lov v reálu',
  foto: 'Foto mise',
  tip: 'Tipovačka',
  detektivka: 'Detektivka',
  pozorovacka: 'Pozorovačka',
  kviz: 'Mini kvíz',
  pamet: 'Paměťová výzva',
  sifra: 'Šifra',
  tvoriva: 'Tvořivá mise',
  stavba: 'Stavěcí experiment',
  jazyk: 'Jazyková mise',
  ochutnavka: 'Ochutnávka',
  carspot: 'Car spotting',
  fotbal: 'Fotbalová mise',
  casova: 'Časová mise',
  kooperace: 'Kooperativní mise',
}

export interface Quiz {
  options: string[]
  correct: number
  explain: string
}

export interface Mission {
  id: string
  world: string // id kapitoly (chapters.ts), side questu (SIDE_WORLDS) nebo 'misto'
  place?: string
  title: string // příběhový titulek
  task: string // zadání – vždy začíná slovesem
  reward: number
  kind: Kind
  tags: Filter[]
  quiz?: Quiz // tipovačka / kvíz: nejdřív tip, potom vysvětlení
  input?: string // textová odpověď (tvořivé mise)
  photo?: boolean // nabídnout vyfocení (vždy nepovinné)
  timer?: number // minuty
  coop?: [string, string] // každé dítě má jinou část informace
  fact?: string // krátké vysvětlení po splnění
  note?: 'legenda' | 'fakt' | 'nejistota'
}

// Side questy – jdou plnit kdekoli v Římě, jsou otevřené od začátku.
export const SIDE_WORLDS = [
  { id: 'cesta', name: 'Cesta a letiště' },
  { id: 'zivot', name: 'Jak žil malý Říman' },
  { id: 'stavitele', name: 'Římské vychytávky' },
  { id: 'bohove', name: 'Chrám bohů' },
  { id: 'italie', name: 'Itálie dnes' },
  { id: 'gastro', name: 'Ochutnávky' },
  { id: 'fotolov', name: 'Foto lov' },
]

export const MISSIONS: Mission[] = [
  // ───────── I · Zkouška vlčice (od začátku) ─────────
  {
    id: 'spqr-3', world: 'vlcice', title: 'Čtyři tajemná písmena', kind: 'lov', reward: 3, tags: ['venku', 'historie'],
    task: 'Najděte nápis SPQR na třech různých místech. Pozor, schovává se i pod nohama!',
    fact: 'SPQR znamená Senatus Populusque Romanus – „Senát a lid římský“. Řím ho dodnes píše i na kanálové poklopy.',
    note: 'fakt', photo: true,
  },
  {
    id: 'vlcice-najdi', world: 'vlcice', title: 'Kde je vlčice?', kind: 'lov', reward: 3, tags: ['venku', 'historie', 'foto'],
    task: 'Najděte Kapitolskou vlčici nebo její obrázek – na soše, znaku, suvenýru nebo dresu.',
    fact: 'Podle pověsti vlčice kojila dvojčata Romula a Rema. Je to legenda, ne doložená historie. Slavná bronzová vlčice na Kapitolu je navíc možná až ze středověku a dvojčata k ní přidali mnohem později.',
    note: 'legenda', photo: true,
  },
  {
    id: 'zalozeni-tip', world: 'vlcice', title: 'Narozeniny Říma', kind: 'tip', reward: 3, tags: ['rychle', 'historie'],
    task: 'Tipněte si: kdy byl podle tradice založen Řím?',
    quiz: {
      options: ['Před 500 lety', '753 let před naším letopočtem', 'Rok 1 našeho letopočtu'],
      correct: 1,
      explain: 'Tradiční datum je 21. dubna 753 př. n. l. Je to datum z pověsti o Romulovi – archeologové ukazují, že lidé na pahorcích bydleli ještě dřív.',
    },
    note: 'legenda',
  },
  {
    id: 'cislice', world: 'vlcice', title: 'Počty starých Římanů', kind: 'lov', reward: 3, tags: ['venku', 'historie', 'prodva'],
    task: 'Najděte římské číslice na budově, hodinách nebo náhrobku a společně je přečtěte.',
    fact: 'I = 1, V = 5, X = 10, L = 50, C = 100, D = 500, M = 1000. Když je menší číslice vlevo, odečítá se: IV = 4, IX = 9.',
    input: 'Jaké číslo jste našli a kolik to je?',
  },
  {
    id: 'latina', world: 'vlcice', title: 'Řeč Římanů', kind: 'pozorovacka', reward: 4, tags: ['venku', 'historie'],
    task: 'Najděte latinský nápis a zkuste poznat alespoň jedno slovo.',
    fact: 'Hodně latinských slov znáte: IMPERATOR (vládce), AQUA (voda), PORTA (brána), FECIT (udělal). Latina je předek italštiny.',
    input: 'Které slovo jste poznali?',
  },
  {
    id: 'orel', world: 'vlcice', title: 'Orlí oko', kind: 'lov', reward: 2, tags: ['rychle', 'venku'],
    task: 'Najděte orla nebo jiný římský symbol – vavřín, helmu, sloup nebo lva.',
    fact: 'Orel (aquila) byl hlavní znak římských legií. Ztratit orla v bitvě byla pro legii obrovská ostuda.',
    photo: true,
  },
  {
    id: 'pahorky', world: 'vlcice', title: 'Město na sedmi pahorcích', kind: 'tip', reward: 3, tags: ['rychle', 'historie'],
    task: 'Tipněte si: na kolika pahorcích Řím vyrostl?',
    quiz: {
      options: ['Na třech', 'Na sedmi', 'Na dvanácti'],
      correct: 1,
      explain: 'Na sedmi: Palatin, Kapitol, Aventin, Caelius, Esquilin, Quirinal a Viminal. Dnes je město mnohem větší, ale přezdívka zůstala.',
    },
  },
  {
    id: 'nejstarsi', world: 'vlcice', title: 'Stroj času', kind: 'detektivka', reward: 4, tags: ['venku', 'historie', 'prodva'],
    task: 'Vyberte nejstarší věc, kterou jste dnes podle vás viděli. Pak si společně ověřte, jak je opravdu stará.',
    input: 'Co to bylo a kolik mu je let?',
  },
  {
    id: 'sloupy', world: 'vlcice', title: 'Sloupová detektivka', kind: 'detektivka', reward: 5, tags: ['venku', 'historie'],
    task: 'Najděte tři různé typy sloupů nebo hlavic: hladkou (dórskou), se šnečky (iónskou) a s listy (korintskou).',
    fact: 'Římané převzali sloupy od Řeků. Korintská hlavice má listy akantu – rostliny, která v Římě roste dodnes.',
    photo: true,
  },
  {
    id: 'ciao', world: 'vlcice', title: 'První italské slovo', kind: 'jazyk', reward: 2, tags: ['rychle', 'prodva'],
    task: 'Pozdravte někoho italsky: „Buongiorno!“ (bondžórno) nebo kamarádsky „Ciao!“ (čau).',
    fact: 'Buongiorno = dobrý den. Po obědě se říká „Buonasera“ (bonasera) – dobrý večer.',
  },
  {
    id: 'detail', world: 'vlcice', title: 'Oči průzkumníka', kind: 'foto', reward: 3, tags: ['venku', 'foto'],
    task: 'Vyfoťte detail, kterého by si podle vás většina turistů nevšimla.',
    photo: true,
  },

  // ───────── II · Caesarova stopa (20) ─────────
  {
    id: 'caesar-cisar', world: 'caesar', title: 'Caesarovo tajemství', kind: 'tip', reward: 3, tags: ['rychle', 'historie'],
    task: 'Tipněte si: byl Julius Caesar římský císař?',
    quiz: {
      options: ['Ano, úplně první', 'Ne, císař nikdy nebyl', 'Byl to galský náčelník'],
      correct: 1,
      explain: 'Caesar byl slavný vojevůdce a diktátor. Prvním císařem byl až jeho adoptivní syn Augustus.',
    },
  },
  {
    id: 'galie-mapa', world: 'caesar', title: 'Kde leží Galie?', kind: 'tip', reward: 3, tags: ['rychle', 'historie'],
    task: 'Tipněte si: která dnešní země leží hlavně tam, kde byla starověká Galie?',
    quiz: {
      options: ['Španělsko', 'Francie', 'Řecko'],
      correct: 1,
      explain: 'Galie byla hlavně dnešní Francie, k tomu Belgie a kus Švýcarska a severní Itálie. Najděte si ji na mapě v telefonu!',
    },
  },
  {
    id: 'galie-proc', world: 'caesar', title: 'Proč zrovna Galie?', kind: 'kviz', reward: 3, tags: ['historie'],
    task: 'Zjistěte, proč Caesar vedl válku v Galii.',
    quiz: {
      options: ['Chtěl slávu, bohatství a moc', 'Galové mu snědli oběd', 'Hledal moře'],
      correct: 0,
      explain: 'Caesar dobýval Galii 8 let (58–50 př. n. l.). Vítězství mu přineslo slávu, peníze a věrné vojáky – a s nimi moc nad Římem.',
    },
  },
  {
    id: 'galske-jmeno', world: 'caesar', title: 'Galové v Římě', kind: 'tvoriva', reward: 3, tags: ['rychle', 'prodva'],
    task: 'Vymyslete každý své galské jméno ve stylu Asterixe. Končí na -ix!',
    input: 'Naše galská jména…',
    fact: 'V komiksu mají Galové jména na -ix (Asterix, Obelix), Římané na -us. Skutečný galský náčelník se jmenoval Vercingetorix.',
  },
  {
    id: 'asterix-kulisa', world: 'caesar', title: 'Kulisa z komiksu', kind: 'foto', reward: 3, tags: ['venku', 'foto'],
    task: 'Najděte něco, co by mohlo být kulisou v Asterixovi – sloupy, legionáře, ruiny nebo vavřín.',
    photo: true,
  },
  {
    id: 'legionar-poznej', world: 'caesar', title: 'Kdo je legionář?', kind: 'kviz', reward: 3, tags: ['rychle', 'historie'],
    task: 'Poznejte římského legionáře mezi čtyřmi bojovníky.',
    quiz: {
      options: ['Rytíř v plné zbroji s mečem', 'Voják s obdélníkovým štítem, krátkým mečem a přilbou', 'Samuraj s katanou', 'Viking s rohatou helmou'],
      correct: 1,
      explain: 'Legionář měl velký prohnutý štít (scutum), krátký meč (gladius) a oštěp (pilum). A rohaté helmy nenosili ani Vikingové – to je mýtus!',
    },
  },
  {
    id: 'kalendar', world: 'caesar', title: 'Měsíc pro Caesara', kind: 'tip', reward: 2, tags: ['rychle', 'historie'],
    task: 'Tipněte si: který měsíc se v mnoha jazycích jmenuje podle Julia Caesara?',
    quiz: {
      options: ['Leden', 'Červenec', 'Prosinec'],
      correct: 1,
      explain: 'Anglicky July, italsky luglio – podle Julia. Srpen (August) je podle Augusta. Caesar také zavedl kalendář, ze kterého vychází ten náš.',
    },
  },

  // ───────── III · Aréna gladiátorů (40) ─────────
  {
    id: 'glad-leg', world: 'arena', title: 'Gladiátor × legionář', kind: 'kviz', reward: 3, tags: ['rychle', 'historie'],
    task: 'Přiřaďte správnou roli: kdo bojoval v aréně pro diváky?',
    quiz: {
      options: ['Legionář', 'Gladiátor', 'Senátor'],
      correct: 1,
      explain: 'Gladiátor bojoval v aréně pro zábavu diváků – často to byl otrok nebo zajatec. Legionář byl voják armády a bojoval za Řím ve válkách.',
    },
  },
  {
    id: 'vystroj', world: 'arena', title: 'Výstroj legionáře', kind: 'kviz', reward: 3, tags: ['historie'],
    task: 'Vyberte věc, kterou legionář do výstroje NEPATŘÍ.',
    quiz: {
      options: ['Sandály s hřeby', 'Krátký meč gladius', 'Luk a šípy', 'Štít scutum'],
      correct: 2,
      explain: 'Legionář bojoval zblízka mečem a házel oštěp pilum. Jeho sandály (caligae) měly v podrážce hřeby, aby neklouzaly.',
    },
  },
  {
    id: 'smrt', world: 'arena', title: 'Filmový mýtus', kind: 'tip', reward: 3, tags: ['rychle', 'historie'],
    task: 'Tipněte si: končil každý gladiátorský souboj smrtí?',
    quiz: {
      options: ['Ano, vždycky', 'Ne, většina gladiátorů přežila', 'Gladiátoři nikdy nebojovali'],
      correct: 1,
      explain: 'Gladiátoři byli drahí a dlouho trénovaní, takže majitelé nechtěli, aby umírali. Většina soubojů smrtí nekončila. Palec nahoru, nebo dolů? To přesně nevíme ani dnes.',
    },
    note: 'nejistota',
  },
  {
    id: 'glad-jmeno', world: 'arena', title: 'Hvězdy arény', kind: 'tvoriva', reward: 3, tags: ['rychle', 'prodva'],
    task: 'Vymyslete si každý gladiátorské jméno a zbraň.',
    input: 'Naše gladiátorská jména…',
  },
  {
    id: 'vstupy', world: 'arena', title: 'Jak dostat do arény 50 000 lidí', kind: 'detektivka', reward: 5, tags: ['venku', 'historie'],
    task: 'Představte si příchod desetitisíců diváků. Najděte, jak byly vyřešené vstupy.',
    fact: 'Nad oblouky Kolosea jsou vytesaná čísla vchodů. Diváci měli „vstupenku“ s číslem a přes 70 vchodů pomohlo arénu naplnit i vyprázdnit rychle.',
  },
  {
    id: 'arena-foto', world: 'arena', title: 'Plakát na zápas', kind: 'tvoriva', reward: 4, tags: ['foto', 'prodva'],
    task: 'Nakreslete nebo nafoťte plakát na souboj: váš gladiátor proti gladiátorovi sourozence.',
    photo: true,
  },

  // ───────── IV · Tajná galská mise (60) ─────────
  {
    id: 'lektvar-coop', world: 'galska', title: 'Ztracený recept', kind: 'kooperace', reward: 5, tags: ['prodva', 'historie'],
    task: 'Recept na kouzelný lektvar je roztrhaný na dvě půlky. Každý si přečtěte svou půlku jen pro sebe a pak spolu zjistěte, kam se vydat.',
    coop: [
      'Tvoje půlka: „Hledej místo, kde je v kupoli díra a prší dovnitř…“',
      'Tvoje půlka: „…a spočítej, kolik sloupů stojí vepředu u vchodu.“',
    ],
    input: 'Kolik sloupů jste napočítali?',
    fact: 'Byl to Pantheon! Vepředu u vchodu stojí 16 obřích žulových sloupů, každý z jednoho kusu kamene.',
  },
  {
    id: 'galska-casovka', world: 'galska', title: 'Závod s druidem', kind: 'casova', reward: 8, tags: ['venku', 'prodva'], timer: 20,
    task: 'Máte 20 minut na čtyři objevy: něco galského, něco římského, něco kulatého jako menhir a něco, co by Obelix snědl.',
    photo: true,
  },
  {
    id: 'galska-sifra', world: 'galska', title: 'Vzkaz od Panoramixe', kind: 'sifra', reward: 5, tags: ['historie'],
    task: 'Rozluštěte vzkaz. Každé písmeno je posunuté o jedno dopředu v abecedě: „NFOIJS“',
    quiz: { options: ['MENHIR', 'LEKTVAR', 'OBELIX'], correct: 0, explain: 'N→M, F→E, O→N, I→H, J→I, S→R. MENHIR! Obelix je přece roznáší. Tak funguje i Caesarova šifra – skutečný Caesar své dopisy šifroval posunem písmen.' },
  },

  // ───────── V · Lov železných ořů (80) ─────────
  {
    id: 'fiat', world: 'ori', title: 'První oř', kind: 'carspot', reward: 2, tags: ['rychle', 'auta', 'foto'],
    task: 'Vyfoťte první Fiat.', photo: true,
    fact: 'Fiat pochází z Turína. Malý Fiat 500 (Cinquecento) je jedno z nejslavnějších italských aut.',
  },
  {
    id: 'alfa', world: 'ori', title: 'Had v erbu', kind: 'carspot', reward: 3, tags: ['auta', 'foto'],
    task: 'Vyfoťte první Alfu Romeo a prohlédněte si její znak.', photo: true,
    fact: 'Ve znaku Alfy Romeo je kříž Milána a velký had, který polyká člověka. Je to starý znak milánského rodu Viscontiů.',
  },
  {
    id: 'ferrari', world: 'ori', title: 'Vzpínající se kůň', kind: 'carspot', reward: 8, tags: ['auta', 'foto'],
    task: 'Ulovte Ferrari! Tohle je speciální bonus – nemusí se to povést.', photo: true,
    fact: 'Ferrari se vyrábí v Maranellu. Černý vzpínající se kůň byl původně znakem pilota z první světové války.',
  },
  {
    id: 'lambo', world: 'ori', title: 'Zlatý býk', kind: 'carspot', reward: 8, tags: ['auta', 'foto'],
    task: 'Ulovte Lamborghini! Speciální bonus pro trpělivé lovce.', photo: true,
    fact: 'Zakladatel Ferruccio Lamborghini byl ve znamení Býka – proto má značka ve znaku býka. Předtím vyráběl traktory.',
  },
  {
    id: 'maserati', world: 'ori', title: 'Neptunův trojzubec', kind: 'carspot', reward: 5, tags: ['auta', 'foto'],
    task: 'Najděte Maserati a jeho znak.', photo: true,
    fact: 'Trojzubec Maserati je vzatý z Neptunovy fontány v Boloni. Neptun je římský bůh moře!',
  },
  {
    id: 'vespy', world: 'ori', title: 'Roj vos', kind: 'carspot', reward: 4, tags: ['venku', 'auta'],
    task: 'Najděte pět různých skútrů nebo Vesp.',
    fact: 'Vespa italsky znamená vosa. Poprvé vyjela v roce 1946 a bzučí Římem dodnes.',
  },
  {
    id: 'nejmensi', world: 'ori', title: 'Autíčko ze sirkárny', kind: 'foto', reward: 3, tags: ['auta', 'foto'],
    task: 'Vyfoťte nejmenší auto celé výpravy.', photo: true,
  },
  {
    id: 'parkovani', world: 'ori', title: 'Mistři parkování', kind: 'foto', reward: 3, tags: ['auta', 'foto', 'rychle'],
    task: 'Vyfoťte nejzajímavější způsob parkování.', photo: true,
  },
  {
    id: 'logo-bez', world: 'ori', title: 'Poznáš mě bez jména?', kind: 'carspot', reward: 3, tags: ['auta', 'prodva'],
    task: 'Najděte logo italského auta a poznejte značku bez nápovědy. Jeden ukazuje, druhý hádá.',
  },

  // ───────── VI · Římské derby (100) ─────────
  {
    id: 'roma-znak', world: 'derby', title: 'Vlčice na dresu', kind: 'fotbal', reward: 3, tags: ['fotbal', 'foto'],
    task: 'Najděte znak nebo dres AS Roma.', photo: true,
    fact: 'Ve znaku AS Roma je vlčice s Romulem a Remem – stejná pověst jako na začátku vaší výpravy!',
  },
  {
    id: 'lazio-znak', world: 'derby', title: 'Orel z Lazia', kind: 'fotbal', reward: 3, tags: ['fotbal', 'foto'],
    task: 'Najděte znak nebo dres Lazia.', photo: true,
    fact: 'Lazio má ve znaku orla – stejný symbol, jaký nosily římské legie.',
  },
  {
    id: 'barvy', world: 'derby', title: 'Barvy dvou srdcí', kind: 'kviz', reward: 3, tags: ['fotbal', 'rychle'],
    task: 'Poznejte kluby jen podle barev: kdo hraje v nebesky modré a bílé?',
    quiz: {
      options: ['AS Roma', 'Lazio', 'Oba'],
      correct: 1,
      explain: 'Lazio je nebesky modro-bílé. AS Roma hraje v tmavě červené a žlutooranžové – Italové jim říkají „giallorossi“, žlutočervení.',
    },
  },
  {
    id: 'stadion', world: 'derby', title: 'Jeden dům pro dva', kind: 'tip', reward: 3, tags: ['fotbal', 'rychle'],
    task: 'Tipněte si: kde hrají AS Roma a Lazio domácí zápasy?',
    quiz: {
      options: ['Každý má svůj stadion', 'Oba na stejném stadionu Olimpico', 'V Koloseu'],
      correct: 1,
      explain: 'Oba kluby hrají na Stadio Olimpico. Když spolu hrají, je to Derby della Capitale – derby hlavního města.',
    },
  },
  {
    id: 'dres-ulice', world: 'derby', title: 'Dres v ulicích', kind: 'lov', reward: 2, tags: ['fotbal', 'venku', 'rychle'],
    task: 'Najděte v ulicích někoho ve fotbalovém dresu. Jakého je klubu?',
  },
  {
    id: 'fotbal-vec', world: 'derby', title: 'Speciální mise pro Bertíka a Petra', kind: 'fotbal', reward: 5, tags: ['fotbal', 'foto', 'prodva'],
    task: 'Najděte nejzajímavější fotbalovou věc celé výpravy.', photo: true,
  },

  // ───────── VII · Velká římská šifra (120) ─────────
  {
    id: 'pamet-vecer', world: 'sifra', title: 'Paměť strážců', kind: 'pamet', reward: 4, tags: ['prodva'],
    task: 'Odložte telefon. Řekněte si navzájem pět věcí, které jste se v Římě dozvěděli. Kdo si vzpomene na víc?',
  },

  // ───────── Side questy: Cesta a letiště (Praha → Frankfurt → Řím) ─────────
  {
    id: 'prg-jmeno', world: 'cesta', title: 'Letiště se jménem', kind: 'tip', reward: 2, tags: ['rychle', 'historie'],
    task: 'Praha: tipněte si, po kom se jmenuje pražské letiště.',
    quiz: {
      options: ['Po Václavu Havlovi', 'Po Karlu IV.', 'Po Jaromíru Jágrovi'],
      correct: 0,
      explain: 'Letiště Václava Havla Praha nese jméno prvního českého prezidenta od roku 2012. Lidé mu ale pořád často říkají Ruzyně – podle čtvrti, kde leží.',
    },
  },
  {
    id: 'prg-kod', world: 'cesta', title: 'Tajný kód letišť', kind: 'kviz', reward: 2, tags: ['rychle'],
    task: 'Praha: každé letiště má třípísmenný kód. Najděte ho na palubní vstupence. Jaký má kód Praha?',
    quiz: {
      options: ['PRA', 'PRG', 'CZE'],
      correct: 1,
      explain: 'PRG! Frankfurt má kód FRA a hlavní římské letiště Fiumicino FCO. Tyhle kódy najdete i na visačce vašeho kufru.',
    },
  },
  {
    id: 'prg-tabule', world: 'cesta', title: 'Detektivové u tabule', kind: 'lov', reward: 3, tags: ['rychle', 'prodva'],
    task: 'Praha: najděte na odletové tabuli svůj let. Zjistěte číslo letu a bránu (gate), odkud letíte.',
    input: 'Číslo letu a gate…',
    fact: 'Číslo letu začíná kódem letecké společnosti. Lufthansa má LH, České aerolinie OK, ITA Airways AZ.',
  },
  {
    id: 'prg-letadla', world: 'cesta', title: 'Počítání ocasů', kind: 'pozorovacka', reward: 3, tags: ['foto'],
    task: 'Praha: z okna u brány spočítejte letadla. Kolik různých leteckých společností poznáte podle barev na ocasu?',
    input: 'Letadel / společností…', photo: true,
  },
  {
    id: 'palubka', world: 'cesta', title: 'Tajemství palubní vstupenky', kind: 'detektivka', reward: 3, tags: ['rychle', 'prodva'],
    task: 'Prohlédněte si palubní vstupenku. Najděte číslo sedadla, čas nástupu (boarding) a kód cílového letiště.',
    fact: 'Písmeno u sedadla prozradí, kde sedíte: A a F bývají u okna, C a D u uličky.',
  },
  {
    id: 'let-usi', world: 'cesta', title: 'Proč zalehají uši?', kind: 'kviz', reward: 2, tags: ['rychle'],
    task: 'V letadle: proč vám při startu a přistání zalehají uši?',
    quiz: {
      options: ['Mění se tlak vzduchu', 'Motory jsou moc hlasité', 'V letadle je zima'],
      correct: 0,
      explain: 'Při stoupání a klesání se mění tlak vzduchu v kabině. Pomůže polykat, zívat nebo žvýkat – ucho se tím vyrovná.',
    },
  },
  {
    id: 'let-vyska', world: 'cesta', title: 'Nad mraky', kind: 'tip', reward: 2, tags: ['rychle'],
    task: 'V letadle: tipněte si, jak vysoko letí dopravní letadlo.',
    quiz: {
      options: ['Asi 1 km', 'Asi 10 km', 'Asi 100 km'],
      correct: 1,
      explain: 'Kolem 10 kilometrů – to je víc než Mount Everest. Venku je tam mráz kolem −50 °C, a přesto v letadle sedíte v tričku.',
    },
  },
  {
    id: 'let-mraky', world: 'cesta', title: 'Mraky shora', kind: 'foto', reward: 2, tags: ['foto', 'rychle'],
    task: 'V letadle: vyfoťte mraky shora. Jaký tvar vám připomínají?', photo: true, input: 'Vypadají jako…',
  },
  {
    id: 'let-cary', world: 'cesta', title: 'Bílé čáry na nebi', kind: 'tip', reward: 2, tags: ['rychle', 'venku'],
    task: 'Tipněte si: co jsou ty bílé čáry, které za sebou nechávají letadla?',
    quiz: {
      options: ['Kouř z motoru', 'Zmrzlá vodní pára', 'Barva na reklamu'],
      correct: 1,
      explain: 'Jsou to kondenzační stopy. Z motoru vychází horká vlhká pára, která v mrazu vysoko nad zemí zmrzne na drobné krystalky ledu – vznikne vlastně umělý mrak.',
    },
  },
  {
    id: 'let-abeceda', world: 'cesta', title: 'Mluvte jako piloti', kind: 'tvoriva', reward: 3, tags: ['prodva'],
    task: 'Hláskujte svá jména pilotní abecedou. A = Alfa, B = Bravo, C = Charlie, D = Delta, E = Echo…',
    input: 'Moje jméno pilotsky…',
    fact: 'Piloti a letištní věž hláskují slovy, aby se v rádiu nespletlo B a P. Celá abeceda: Alfa, Bravo, Charlie, Delta, Echo, Foxtrot, Golf, Hotel, India, Juliett, Kilo, Lima, Mike, November, Oscar, Papa, Quebec, Romeo, Sierra, Tango, Uniform, Victor, Whiskey, X-ray, Yankee, Zulu.',
  },
  {
    id: 'fra-jerab', world: 'cesta', title: 'Pták na ocase', kind: 'lov', reward: 2, tags: ['rychle', 'foto'],
    task: 'Frankfurt: najděte logo Lufthansy. Jaký pták je v něm?',
    quiz: {
      options: ['Orel', 'Jeřáb', 'Holub'],
      correct: 1,
      explain: 'Je to jeřáb v letu. Frankfurt je domovské letiště Lufthansy, takže tu jeřábů uvidíte opravdu hodně.',
    },
  },
  {
    id: 'fra-danke', world: 'cesta', title: 'Německé kouzelné slovo', kind: 'jazyk', reward: 2, tags: ['rychle'],
    task: 'Frankfurt: řekněte někomu německy „Danke!“ (danke) – děkuji. Na rozloučenou můžete říct „Tschüss!“ (čüs).',
  },
  {
    id: 'fra-velikost', world: 'cesta', title: 'Obří letiště', kind: 'tip', reward: 2, tags: ['rychle'],
    task: 'Frankfurt: tipněte si, kolik cestujících projde tímhle letištěm za rok.',
    quiz: {
      options: ['Asi 6 milionů', 'Asi 60 milionů', 'Asi 600 milionů'],
      correct: 1,
      explain: 'Kolem 60 milionů lidí za rok – to je víc než pětkrát tolik, kolik lidí žije v celém Česku. Frankfurt patří k největším letištím v Evropě.',
    },
  },
  {
    id: 'fra-svet', world: 'cesta', title: 'Celý svět na jedné tabuli', kind: 'casova', reward: 4, tags: ['prodva'], timer: 10,
    task: 'Frankfurt: máte 10 minut. Najděte na odletové tabuli lety do tří různých světadílů.',
    input: 'Našli jsme lety do…',
  },
  {
    id: 'fra-skyline', world: 'cesta', title: 'Vláček bez řidiče', kind: 'pozorovacka', reward: 2, tags: ['rychle'],
    task: 'Frankfurt: pokud budete přejíždět mezi terminály, jeďte vláčkem SkyLine a sedněte si úplně dopředu. Kdo řídí?',
    fact: 'Nikdo! SkyLine jezdí automaticky bez řidiče a spojuje terminály 1 a 2.',
  },
  {
    id: 'let-alpy', world: 'cesta', title: 'Hory pod křídlem', kind: 'pozorovacka', reward: 3, tags: ['foto'],
    task: 'Let z Frankfurtu do Říma: dívejte se z okna. Uvidíte hory se sněhem? Jestli je jasno, jsou to nejspíš Alpy.',
    fact: 'Alpy jsou nejvyšší hory v Evropě. Nejvyšší z nich, Mont Blanc, měří přes 4 800 metrů. Hannibal kdysi přes Alpy vedl na Řím i slony!',
    photo: true,
  },
  {
    id: 'fco-jmeno', world: 'cesta', title: 'Přistání v Římě', kind: 'tip', reward: 2, tags: ['rychle'],
    task: 'Řím: tipněte si, po kom se jmenuje hlavní římské letiště Fiumicino.',
    quiz: {
      options: ['Po Juliu Caesarovi', 'Po Leonardovi da Vinci', 'Po Michelangelovi'],
      correct: 1,
      explain: 'Letiště Leonardo da Vinci – Fiumicino (kód FCO). Leonardo kreslil létající stroje stovky let předtím, než vzlétlo první letadlo.',
    },
  },
  {
    id: 'fco-napis', world: 'cesta', title: 'Benvenuti!', kind: 'jazyk', reward: 2, tags: ['rychle'],
    task: 'Řím: najděte po přistání první italský nápis a zkuste uhodnout, co znamená.',
    input: 'Nápis a náš odhad…',
    fact: 'Benvenuti = vítejte, Uscita = východ, Bagagli = zavazadla, Arrivi = přílety, Partenze = odlety.',
  },

  // ───────── Side questy: Jak žil malý Říman ─────────
  {
    id: 'obleceni', world: 'zivot', title: 'Šatník římského dítěte', kind: 'kviz', reward: 3, tags: ['historie', 'rychle'],
    task: 'Vyberte, co nosilo římské dítě běžně každý den.',
    quiz: {
      options: ['Tógu', 'Tuniku', 'Džíny'],
      correct: 1,
      explain: 'Na každý den tuniku – jednoduché šaty do pasu. Chlapci svobodných Římanů nosili tógu s fialovým lemem jen při slavnostech. Tóga byla těžká a nepraktická.',
    },
  },
  {
    id: 'vecere', world: 'zivot', title: 'Co je k večeři?', kind: 'kviz', reward: 3, tags: ['jidlo', 'historie'],
    task: 'Co by římské dítě mohlo jíst k večeři?',
    quiz: {
      options: ['Hranolky s kečupem', 'Chléb, olivy, sýr a kaši', 'Pizzu s rajčaty'],
      correct: 1,
      explain: 'Chléb, kaše z obilí, olivy, sýr, zelenina a občas ryba. Brambory, rajčata ani kukuřice v Evropě ještě nebyly – přišly až z Ameriky.',
    },
  },
  {
    id: 'pizza', world: 'zivot', title: 'Pizza pro Caesara?', kind: 'tip', reward: 3, tags: ['jidlo', 'rychle'],
    task: 'Tipněte si: jedli staří Římané pizzu?',
    quiz: {
      options: ['Ano, s rajčaty a mozzarellou', 'Jen placky, ale ne dnešní pizzu', 'Pizzu vymysleli Galové'],
      correct: 1,
      explain: 'Římané pekli ploché chleby s olejem a bylinkami. Dnešní pizza vznikla v Neapoli asi před 250 lety – rajčata do Evropy dorazila až po objevení Ameriky.',
    },
  },
  {
    id: 'zachody', world: 'zivot', title: 'Tajemství latríny', kind: 'kviz', reward: 3, tags: ['historie'],
    task: 'Zjistěte, jak fungovaly veřejné toalety.',
    quiz: {
      options: ['Každý měl vlastní kabinku', 'Seděli vedle sebe na dlouhé lavici s dírami', 'Záchody neexistovaly'],
      correct: 1,
      explain: 'Na dlouhé kamenné lavici sedělo víc lidí vedle sebe a klidně si povídali. Pod lavicí tekla voda. Místo papíru se nejspíš používala houba na tyčce.',
    },
    note: 'nejistota',
  },
  {
    id: 'domus', world: 'zivot', title: 'Domus, nebo insula?', kind: 'kviz', reward: 3, tags: ['historie'],
    task: 'Kde bydlela bohatá rodina?',
    quiz: {
      options: ['V domu domus s atriem', 'V činžáku insula', 'Ve stanu'],
      correct: 0,
      explain: 'Bohatí měli domus s atriem a zahradou. Většina lidí žila v insulách – několikapatrových činžácích. Nahoře byly nejmenší a nejlevnější byty.',
    },
  },
  {
    id: 'nechapal', world: 'zivot', title: 'Říman v 21. století', kind: 'tvoriva', reward: 3, tags: ['rychle', 'prodva'],
    task: 'Vyberte tři dnešní věci, které by starověký Říman nechápal.',
    input: 'Tři věci…',
  },
  {
    id: 'lazne', world: 'zivot', title: 'Víc než koupel', kind: 'kviz', reward: 3, tags: ['historie'],
    task: 'Zjistěte, k čemu sloužily veřejné lázně kromě mytí.',
    quiz: {
      options: ['K setkávání, sportu a povídání', 'Jen ke spaní', 'K pěstování ryb'],
      correct: 0,
      explain: 'Lázně byly jako dnešní aquapark, posilovna, kavárna a knihovna v jednom. Chodilo se tam za kamarády i za obchodem.',
    },
  },

  // ───────── Side questy: Římské vychytávky ─────────
  {
    id: 'akvadukt', world: 'stavitele', title: 'Voda bez pumpy', kind: 'kviz', reward: 3, tags: ['historie'],
    task: 'Zjistěte, jak akvadukt dopravoval vodu až do Říma.',
    quiz: {
      options: ['Velkými pumpami', 'Voda tekla sama z mírného kopce', 'Nosili ji otroci v kbelících'],
      correct: 1,
      explain: 'Akvadukt klesal jen o kousek na každý kilometr, takže voda tekla sama. Většina vedla pod zemí – na obloucích jen přes údolí.',
    },
  },
  {
    id: 'oblouk', world: 'stavitele', title: 'Most z ubrousků', kind: 'stavba', reward: 5, tags: ['prodva'],
    task: 'Postavte z předmětů na stole oblouk, který vydrží stát. Kostky cukru, krabičky, kamínky…',
    fact: 'Kámen uprostřed oblouku (svorník) tlačí na sousedy a ti dál dolů – proto oblouk drží i bez lepidla.',
    photo: true,
  },
  {
    id: 'kupole-odhad', world: 'stavitele', title: 'Jak drží kupole?', kind: 'detektivka', reward: 4, tags: ['historie', 'venku'],
    task: 'Najděte kupoli a odhadněte, jak mohla vydržet bez ocelové konstrukce.',
    fact: 'Římský beton se sopečným popelem je neuvěřitelně odolný. Nahoře stavitelé použili lehčí kamínky, dole těžší – kupole je tak lehčí tam, kde je to potřeba.',
  },
  {
    id: 'silnice', world: 'stavitele', title: 'Všechny cesty vedou do Říma', kind: 'pozorovacka', reward: 3, tags: ['venku', 'historie'],
    task: 'Najděte starou dlažbu nebo silnici a prohlédněte si její povrch. Najdete vyjeté koleje?',
    fact: 'Nejslavnější je Via Appia z roku 312 př. n. l. Římané postavili desítky tisíc kilometrů silnic po celé říši.',
  },
  {
    id: 'oblouk-najdi', world: 'stavitele', title: 'Hon na oblouky', kind: 'lov', reward: 2, tags: ['venku', 'rychle', 'foto'],
    task: 'Najděte stavbu, kde je vidět oblouk.', photo: true,
  },
  {
    id: 'fontana-voda', world: 'stavitele', title: 'Odkud teče voda?', kind: 'detektivka', reward: 4, tags: ['venku'],
    task: 'Najděte malou pitnou fontánku „nasone“ a zjistěte, odkud bere vodu. Umíte z ní pít jako Římané?',
    fact: 'Nasone znamená „velký nos“. Když prstem ucpete spodek, voda vystříkne nahoru dírkou – jako z pítka!',
  },

  // ───────── Side questy: Chrám bohů ─────────
  {
    id: 'bohove-poznej', world: 'bohove', title: 'Poznej boha', kind: 'kviz', reward: 3, tags: ['historie', 'rychle'],
    task: 'Který bůh drží trojzubec?',
    quiz: {
      options: ['Jupiter', 'Neptun', 'Mars'],
      correct: 1,
      explain: 'Neptun vládne moři a drží trojzubec. Jupiter má blesk a orla, Mars je bůh války s přilbou a Minerva, bohyně moudrosti, má sovu.',
    },
  },
  {
    id: 'bohove-socha', world: 'bohove', title: 'Kamenný bůh', kind: 'pozorovacka', reward: 4, tags: ['venku', 'historie'],
    task: 'Najděte sochu boha nebo bohyně a poznejte ho podle předmětu v ruce.',
    input: 'Koho jste našli?', photo: true,
  },
  {
    id: 'planety', world: 'bohove', title: 'Bohové na nebi', kind: 'tip', reward: 2, tags: ['rychle'],
    task: 'Tipněte si: podle koho se jmenuje planeta Mars?',
    quiz: {
      options: ['Podle čokolády', 'Podle římského boha války', 'Podle hvězdáře'],
      correct: 1,
      explain: 'Mars, Venuše, Jupiter, Merkur, Saturn i Neptun – většina planet má jména římských bohů.',
    },
  },

  // ───────── Side questy: Itálie dnes ─────────
  {
    id: 'grazie', world: 'italie', title: 'Kouzelné slovo', kind: 'jazyk', reward: 2, tags: ['rychle'],
    task: 'Řekněte někomu „Grazie!“ (gracie) – děkuji.',
  },
  {
    id: 'objednej', world: 'italie', title: 'Objednávka italsky', kind: 'jazyk', reward: 4, tags: ['jidlo'],
    task: 'Objednejte si italsky jednu jednoduchou věc: „Un gelato, per favore.“ (un dželáto, per favóre)',
  },
  {
    id: 'slovo-odhad', world: 'italie', title: 'Tajné slovo', kind: 'jazyk', reward: 3, tags: ['venku'],
    task: 'Najděte italské slovo, jehož význam dokážete odhadnout bez překladu.',
    input: 'Jaké slovo a co znamená?',
  },
  {
    id: 'nauc', world: 'italie', title: 'Učitel italštiny', kind: 'jazyk', reward: 3, tags: ['prodva', 'rychle'],
    task: 'Naučte sourozence jedno nové italské slovo. Zítra ho musí umět!',
  },
  {
    id: 'jinak', world: 'italie', title: 'Tady je to jinak', kind: 'pozorovacka', reward: 2, tags: ['venku', 'rychle'],
    task: 'Najděte něco, co je v běžném římském životě jiné než doma.',
    input: 'Co jste objevili?',
  },

  // ───────── Side questy: Ochutnávky ─────────
  {
    id: 'nove-jidlo', world: 'gastro', title: 'Odvážný jedlík', kind: 'ochutnavka', reward: 4, tags: ['jidlo'],
    task: 'Ochutnejte jednu věc, kterou jste nikdy neměli.', input: 'Co to bylo a jak to chutnalo?',
  },
  {
    id: 'gelato', world: 'gastro', title: 'Lov na příchuť', kind: 'ochutnavka', reward: 2, tags: ['jidlo', 'rychle'],
    task: 'Najděte nejzajímavější příchuť gelata v nabídce.', input: 'Jaká příchuť vyhrála?',
  },
  {
    id: 'tri-pasty', world: 'gastro', title: 'Tři římské těstoviny', kind: 'kviz', reward: 3, tags: ['jidlo'],
    task: 'Poznejte na menu carbonara, amatriciana a cacio e pepe. Která je jen se sýrem a pepřem?',
    quiz: {
      options: ['Carbonara', 'Amatriciana', 'Cacio e pepe'],
      correct: 2,
      explain: 'Cacio e pepe = sýr a pepř. Carbonara má vajíčko a slaninu guanciale, amatriciana rajčata a guanciale. Všechny tři jsou římská klasika.',
    },
  },
  {
    id: 'nejlepsi-jidlo', world: 'gastro', title: 'Rodinný vítěz', kind: 'ochutnavka', reward: 3, tags: ['jidlo', 'prodva'],
    task: 'Vyberte společně s rodiči nejlepší jídlo dosavadní výpravy.', input: 'Vítěz je…',
  },
  {
    id: 'zvlastni', world: 'gastro', title: 'Vypadá divně, chutná skvěle', kind: 'ochutnavka', reward: 3, tags: ['jidlo', 'foto'],
    task: 'Najděte jídlo, které vypadá zvláštně, ale chutná dobře.', photo: true,
  },
  {
    id: 'italove-jinak', world: 'gastro', title: 'Italská pravidla', kind: 'tip', reward: 2, tags: ['jidlo', 'rychle'],
    task: 'Tipněte si: kdy si Italové nejčastěji dávají cappuccino?',
    quiz: {
      options: ['Ráno ke snídani', 'K večeři', 'O půlnoci'],
      correct: 0,
      explain: 'Cappuccino je pro Italy ranní nápoj. Po obědě nebo večeři si ho objedná skoro jen turista. Po jídle se pije malé espresso.',
    },
  },

  // ───────── Side questy: Foto lov ─────────
  { id: 'f-rimska', world: 'fotolov', title: 'Nejvíc římská fotka', kind: 'foto', reward: 3, tags: ['foto', 'venku'], task: 'Vyfoťte nejvíc římskou fotku celého dne.', photo: true },
  { id: 'f-vtipna', world: 'fotolov', title: 'Smích dne', kind: 'foto', reward: 2, tags: ['foto', 'rychle'], task: 'Vyfoťte nejvtipnější věc dne.', photo: true },
  { id: 'f-dvere', world: 'fotolov', title: 'Dveře do tajemství', kind: 'foto', reward: 2, tags: ['foto', 'venku', 'rychle'], task: 'Vyfoťte nejhezčí dveře.', photo: true },
  { id: 'f-socha', world: 'fotolov', title: 'Kamenná hvězda', kind: 'foto', reward: 2, tags: ['foto', 'venku'], task: 'Vyfoťte nejlepší sochu dne. Zkuste ji napodobit!', photo: true },
  { id: 'f-pes', world: 'fotolov', title: 'Římský hafan', kind: 'foto', reward: 2, tags: ['foto', 'rychle'], task: 'Vyfoťte nejlepšího psa, kterého během dne potkáte.', photo: true },
  { id: 'f-skutr', world: 'fotolov', title: 'Šílený skútr', kind: 'foto', reward: 2, tags: ['foto', 'auta'], task: 'Vyfoťte nejšílenější skútr.', photo: true },
  { id: 'f-doma-ne', world: 'fotolov', title: 'Doma nevídané', kind: 'foto', reward: 3, tags: ['foto', 'venku'], task: 'Vyfoťte něco, co doma běžně neuvidíte.', photo: true },
]

export const missionById = (id: string) => MISSIONS.find((m) => m.id === id)
