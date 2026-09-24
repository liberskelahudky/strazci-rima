import type { Mission, Quiz } from './missions'

export type Scene = 'koloseum' | 'forum' | 'pantheon' | 'palatin' | 'trevi' | 'navona' | 'schody' | 'petr' | 'sixtina'

// Památková karta: 1) název + ilustrace, 2) Jsme tady, 3) tip, 4) příběh, 5) mise, 6) odměna, 7) Tohle řekni doma, 8) fotka
export interface Place {
  id: string
  name: string
  kicker: string
  scene: Scene
  visitReward: number
  guess: { question: string; reward: number } & Quiz
  story: string[]
  missions: Mission[]
  tellHome: string
}

const m = (place: string, list: Omit<Mission, 'world' | 'place'>[]): Mission[] =>
  list.map((x) => ({ ...x, world: 'misto', place }))

export const PLACES: Place[] = [
  {
    id: 'koloseum', name: 'Koloseum', kicker: 'ARÉNA GLADIÁTORŮ', scene: 'koloseum', visitReward: 2,
    guess: {
      question: 'Kolik diváků se sem mohlo vejít?', reward: 3,
      options: ['5 000', '50 000', '500 000'], correct: 1,
      explain: 'Asi 50 000 lidí, možná i víc. To je jako velký fotbalový stadion – a postavili ho za necelých 10 let.',
    },
    story: [
      'Koloseum otevřeli v roce 80 našeho letopočtu. Původně se jmenovalo Flaviovský amfiteátr.',
      'Konaly se tu zápasy gladiátorů a honby na divoká zvířata. Nad diváky se dala natáhnout obří plachta proti slunci.',
      'Jméno Koloseum dostalo nejspíš podle obří sochy císaře Nerona, která stávala hned vedle.',
    ],
    missions: m('koloseum', [
      { id: 'kol-patra', title: 'Kolik pater?', kind: 'pozorovacka', reward: 4, tags: ['venku', 'historie'], task: 'Najděte detail, který ukazuje, že stavba měla víc pater.', fact: 'Koloseum má čtyři patra. V každém jsou jiné sloupy: dole nejjednodušší, nahoře nejzdobnější.' },
      { id: 'kol-jmena', title: 'Do arény!', kind: 'tvoriva', reward: 3, tags: ['rychle', 'prodva'], task: 'Vymyslete si gladiátorská jména.', input: 'Naše jména…' },
      { id: 'kol-cisla', title: 'Vstupenka číslo…', kind: 'lov', reward: 3, tags: ['venku', 'historie'], task: 'Najděte nad oblouky vytesané římské číslice. Který vchod má nejvyšší číslo, co vidíte?', input: 'Číslo vchodu…', fact: 'Diváci měli na vstupence číslo vchodu, sektoru i řady – skoro jako dnes na stadionu.' },
    ]),
    tellHome: 'Ne každý gladiátorský souboj končil smrtí. Gladiátoři byli drazí a vycvičení – majitel chtěl, aby bojovali znovu.',
  },
  {
    id: 'forum', name: 'Forum Romanum', kicker: 'SRDCE STARÉHO ŘÍMA', scene: 'forum', visitReward: 2,
    guess: {
      question: 'K čemu sloužilo Forum?', reward: 3,
      options: ['Jen k nakupování', 'K politice, soudům, modlitbám i obchodu', 'Byl to zábavní park'],
      correct: 1,
      explain: 'Forum bylo náměstí, kde se dělo všechno: jednal senát, soudilo se, obchodovalo, slavilo i modlilo.',
    },
    story: [
      'Dřív tu byla bažina. Římané ji vysušili velkým kanálem – Cloaca Maxima – který funguje dodnes.',
      'Po Svaté cestě (Via Sacra) tu projížděli vítězní vojevůdci v průvodech.',
      'V cihlové budově Kurie zasedal římský senát.',
    ],
    missions: m('forum', [
      { id: 'for-kurie', title: 'Dům senátorů', kind: 'lov', reward: 4, tags: ['venku', 'historie'], task: 'Najděte Kurii – vysokou cihlovou budovu, kde zasedal senát.', photo: true },
      { id: 'for-oblouk', title: 'Vítězná brána', kind: 'lov', reward: 3, tags: ['venku', 'historie'], task: 'Najděte vítězný oblouk. Co je na něm vytesané?', input: 'Co jste viděli?' },
      { id: 'for-sloupy', title: 'Lesní sloupy', kind: 'detektivka', reward: 5, tags: ['venku', 'historie'], task: 'Z trosek odvoďte, kde stál chrám: hledejte řadu sloupů a schody.', fact: 'Chrámy stály na vysokém podstavci se schody vepředu. Kde vidíte schody a sloupy vedle sebe, byl nejspíš chrám.' },
    ]),
    tellHome: 'Caesarovo tělo spálili přímo na Foru. Na tom místě stojí zbytky Chrámu božského Julia a lidé tam dodnes nosí květiny.',
  },
  {
    id: 'pantheon', name: 'Pantheon', kicker: 'CHRÁM VŠECH BOHŮ', scene: 'pantheon', visitReward: 2,
    guess: {
      question: 'Jak velká je kulatá díra ve střeše?', reward: 3,
      options: ['Asi 1 metr', 'Asi 9 metrů', 'Asi 30 metrů'], correct: 1,
      explain: 'Oculus („oko“) má skoro 9 metrů. Je to jediné okno celé stavby a když prší, prší dovnitř.',
    },
    story: [
      'Pantheon postavil císař Hadrián asi před 1900 lety. Na průčelí ale nechal jméno Agrippy, který tu postavil starší chrám.',
      'Kupole je stejně široká jako vysoká – dovnitř by se vešla obří koule.',
      'Dnes je to kostel, a proto se zachoval tak skvěle.',
    ],
    missions: m('pantheon', [
      { id: 'pan-napis', title: 'Nápis na průčelí', kind: 'pozorovacka', reward: 3, tags: ['venku', 'historie'], task: 'Najděte nápis M·AGRIPPA a zkuste ho přečíst.', fact: 'M. AGRIPPA L. F. COS. TERTIUM FECIT = „Marcus Agrippa, syn Luciův, konzul potřetí, postavil.“' },
      { id: 'pan-odtok', title: 'Kam teče déšť?', kind: 'detektivka', reward: 3, tags: ['historie'], task: 'Najděte v podlaze malé dírky. K čemu slouží?', fact: 'Jsou to odtoky pro dešťovou vodu, která padá oculem. Podlaha je navíc uprostřed trochu vyšší.' },
      { id: 'pan-svetlo', title: 'Sluneční hodiny', kind: 'foto', reward: 2, tags: ['foto', 'rychle'], task: 'Vyfoťte sluneční kruh, který oculus kreslí na stěnu nebo podlahu.', photo: true },
    ]),
    tellHome: 'Kupole Pantheonu je skoro 2000 let stará a pořád je to největší kupole z betonu bez železných výztuží na světě.',
  },
  {
    id: 'palatin', name: 'Palatin', kicker: 'PAHOREK ZALOŽENÍ', scene: 'palatin', visitReward: 2,
    guess: {
      question: 'Podle pověsti tu vyrostla dvojčata. Kdo je zachránil?', reward: 3,
      options: ['Vlčice', 'Orel', 'Koza'], correct: 0,
      explain: 'Podle pověsti Romula a Rema kojila vlčice. Je to legenda – ale archeologové tu opravdu našli stopy chýší z doby, kdy Řím vznikal.',
    },
    story: [
      'Palatin je jeden ze sedmi římských pahorků. Podle legendy tu Romulus v roce 753 př. n. l. založil město.',
      'Později si tu císaři stavěli obrovské paláce. Z jména Palatin pochází i slovo „palác“.',
    ],
    missions: m('palatin', [
      { id: 'pal-vyhled', title: 'Pohled císařů', kind: 'foto', reward: 2, tags: ['venku', 'foto'], task: 'Najděte vyhlídku na Forum Romanum a vyfoťte ji.', photo: true },
      { id: 'pal-stadion', title: 'Císařova zahrada', kind: 'detektivka', reward: 4, tags: ['venku', 'historie'], task: 'Najděte dlouhý protáhlý prostor, kterému se říká stadion. K čemu mohl sloužit?', fact: 'Nikdo to neví jistě. Mohla to být zahrada, jízdárna nebo místo na procházky. Historici se přou dodnes.' },
    ]),
    tellHome: 'Slovo „palác“ pochází od jména Palatin – protože tady bydleli císaři.',
  },
  {
    id: 'trevi', name: 'Fontána di Trevi', kicker: 'BAROKNÍ ŘÍM', scene: 'trevi', visitReward: 2,
    guess: {
      question: 'Odkud bere fontána vodu?', reward: 3,
      options: ['Z řeky Tibery', 'Ze starověkého akvaduktu', 'Z moře'], correct: 1,
      explain: 'Voda přitéká akvaduktem Aqua Virgo, který dal postavit Agrippa už v roce 19 př. n. l. Funguje přes 2000 let!',
    },
    story: [
      'Fontánu dokončili v roce 1762. Uprostřed stojí Oceanus – bůh všech vod – na voze taženém mořskými koňmi.',
      'Podle tradice se do Říma vrátí každý, kdo hodí minci přes rameno do vody.',
    ],
    missions: m('trevi', [
      { id: 'tre-minc', title: 'Návrat do Říma', kind: 'lov', reward: 1, tags: ['rychle', 'prodva'], task: 'Hoďte minci pravou rukou přes levé rameno (jestli chcete).', fact: 'Mince se každý den vybírají a jdou na charitu – za rok je to přes milion eur.' },
      { id: 'tre-kone', title: 'Divoký a klidný', kind: 'pozorovacka', reward: 3, tags: ['venku'], task: 'Najděte dva mořské koně. Jeden je divoký, druhý klidný. Který je který?', fact: 'Koně ukazují dvě nálady moře – bouři a klid.' },
    ]),
    tellHome: 'Hlavní socha není Neptun, jak si myslí spousta lidí, ale Oceanus.',
  },
  {
    id: 'navona', name: 'Piazza Navona', kicker: 'NÁMĚSTÍ, KTERÉ BYLO STADIONEM', scene: 'navona', visitReward: 2,
    guess: {
      question: 'Proč má náměstí tak dlouhý oválný tvar?', reward: 3,
      options: ['Byl tu stadion', 'Bylo tu jezero', 'Parkovaly tu lodě'], correct: 0,
      explain: 'Stál tu stadion císaře Domitiana pro běžce a sportovce. Domy postavili přímo na jeho zbytcích, a tak má náměstí jeho tvar.',
    },
    story: [
      'Uprostřed je Fontána čtyř řek od Gianlorenza Berniniho. Každá socha představuje velkou řeku jednoho světadílu.',
      'Nil, Dunaj, Ganga a Río de la Plata.',
    ],
    missions: m('navona', [
      { id: 'nav-reky', title: 'Čtyři řeky', kind: 'pozorovacka', reward: 3, tags: ['venku'], task: 'Najděte na fontáně zvířata. Kolik jich objevíte?', input: 'Našli jsme…' },
      { id: 'nav-hlava', title: 'Zakrytá hlava', kind: 'detektivka', reward: 3, tags: ['historie'], task: 'Najděte řeku, která má zakrytou hlavu. Proč asi?', fact: 'Je to Nil. Tehdy nikdo nevěděl, kde Nil pramení – proto má zakrytou hlavu.' },
    ]),
    tellHome: 'Piazza Navona má tvar starověkého stadionu, protože domy stojí přímo na jeho tribunách.',
  },
  {
    id: 'schody', name: 'Španělské schody', kicker: 'NOVOVĚKÝ ŘÍM', scene: 'schody', visitReward: 2,
    guess: {
      question: 'Kolik zhruba mají schodů?', reward: 3,
      options: ['Asi 35', 'Asi 135', 'Asi 1 000'], correct: 1,
      explain: 'Asi 135 schodů. Postavili je v letech 1723–1725 a vedou ke kostelu Trinità dei Monti.',
    },
    story: [
      'Dole stojí fontána ve tvaru potápějící se lodičky – Barcaccia.',
      'Podle legendy ji vymysleli podle lodi, kterou sem kdysi zanesla povodeň z Tibery.',
    ],
    missions: m('schody', [
      { id: 'sch-pocitej', title: 'Schodolezci', kind: 'casova', reward: 3, tags: ['venku', 'prodva'], task: 'Spočítejte schody – každý zvlášť. Dopočítali jste se stejně?', input: 'Napočítali jsme…' },
      { id: 'sch-lod', title: 'Lodička', kind: 'foto', reward: 2, tags: ['foto', 'rychle'], task: 'Vyfoťte fontánu Barcaccia z nejlepšího úhlu.', photo: true },
    ]),
    tellHome: 'Na Španělských schodech se nesmí sedět ani jíst. Hrozí za to pokuta!',
  },
  {
    id: 'petr', name: 'Bazilika sv. Petra', kicker: 'TAJEMSTVÍ VATIKÁNU', scene: 'petr', visitReward: 2,
    guess: {
      question: 'Kdo navrhl obří kopuli baziliky?', reward: 3,
      options: ['Leonardo da Vinci', 'Michelangelo', 'Julius Caesar'], correct: 1,
      explain: 'Kopuli navrhl Michelangelo. Dokončili ji až po jeho smrti. Je vysoká přes 130 metrů.',
    },
    story: [
      'Bazilika stojí nad místem, kde byl podle tradice pohřben apoštol Petr.',
      'Vatikán je samostatný stát – nejmenší na světě. Vládne mu papež a hlídá ho Švýcarská garda.',
    ],
    missions: m('petr', [
      { id: 'pet-garda', title: 'Strážci papeže', kind: 'lov', reward: 3, tags: ['venku', 'foto'], task: 'Najděte Švýcarskou gardu v pruhovaných uniformách.', fact: 'Podle legendy uniformy navrhl Michelangelo. Ve skutečnosti je navrhl velitel gardy před zhruba sto lety.', note: 'legenda', photo: true },
      { id: 'pet-pieta', title: 'Mramorová Pieta', kind: 'pozorovacka', reward: 3, tags: ['historie'], task: 'Najděte Michelangelovu Pietu – Marii s Ježíšem v náruči.', fact: 'Michelangelovi bylo, když ji tesal, jen asi 24 let. Je to jediné dílo, které kdy podepsal.' },
      { id: 'pet-velikost', title: 'Obr, nebo trpaslík?', kind: 'tip', reward: 3, tags: ['rychle'], task: 'Tipněte si: andílci u vchodu držící misky se svěcenou vodou – jak jsou velcí?', quiz: { options: ['Jako panenka', 'Větší než dospělý člověk', 'Jako myš'], correct: 1, explain: 'Jsou přes dva metry! Bazilika je tak obrovská, že z dálky vypadají jako malá miminka.' } },
    ]),
    tellHome: 'Vatikán je nejmenší stát na světě. Má svou poštu, známky i vojáky – Švýcarskou gardu.',
  },
  {
    id: 'sixtina', name: 'Sixtinská kaple', kicker: 'VATIKÁNSKÁ MUZEA', scene: 'sixtina', visitReward: 2,
    guess: {
      question: 'Jak dlouho maloval Michelangelo strop kaple?', reward: 3,
      options: ['4 měsíce', 'Asi 4 roky', '40 let'], correct: 1,
      explain: 'Asi 4 roky (1508–1512). A neležel přitom na zádech, jak se říká – maloval vestoje na lešení s hlavou zakloněnou.',
    },
    story: [
      'V Sixtinské kapli se volí nový papež. Když se zvolí, z komína vyjde bílý kouř.',
      'Uvnitř se nesmí fotit ani nahlas mluvit. Dívejte se očima – je to nejlepší foťák!',
    ],
    missions: m('sixtina', [
      { id: 'six-adam', title: 'Dva prsty', kind: 'pozorovacka', reward: 3, tags: ['historie'], task: 'Najděte na stropě Stvoření Adama – dva prsty, které se skoro dotýkají.' },
      { id: 'six-schody', title: 'Šnečí schodiště', kind: 'foto', reward: 3, tags: ['foto'], task: 'Na konci muzeí najděte točité schodiště a vyfoťte ho shora.', photo: true },
      { id: 'six-pamet', title: 'Bez foťáku', kind: 'pamet', reward: 4, tags: ['prodva'], task: 'Po odchodu z kaple si řekněte tři věci, které jste viděli na stropě.' },
    ]),
    tellHome: 'Michelangelo nemaloval strop vleže. Stál na lešení s hlavou zakloněnou a bolel ho z toho krk.',
  },
]

export const placeById = (id: string) => PLACES.find((p) => p.id === id)
