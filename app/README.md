# Strážci Říma – Tajemství ztracených denárů

Mobilní webová hra (PWA) pro rodinnou výpravu do Říma. Podle návrhu `project/Strazci Rima - obrazovky v2.dc.html` a briefu `project/uploads/Strazci_Rima_design_brief.docx`.

## Spuštění

```bash
npm install
npm run dev           # vývoj
npm run build         # offline PWA do dist/ (nahrát na libovolný hosting, pak „Přidat na plochu“)
npm run build:single  # celá hra v jednom HTML souboru do dist-single/
```

## Co je uvnitř

- 17 obrazovek z briefu: splash, úvodní příběh, domov, mapa putování, knihovna misí, detail mise
  (tipovačka, foto, kooperace, časovka), památková karta, tajná mise s odemčením, pokladnice,
  hodnosti a pečetě, večerní boss fight, galerie úlovků, finále se šifrou, certifikát, rodičovské nastavení.
- Obsah v `src/data/`: 7 milníků (`chapters.ts`), ~80 misí (`missions.ts`), 9 památek (`places.ts`).
- Postup se ukládá v telefonu (localStorage), fotky v IndexedDB. Nic se neodesílá.
- Rodičovské nastavení: „Pro rodiče“ na úvodní obrazovce, vstup přes příklad 7 × 8.

## Zveřejnění (GitHub Pages)

Hra běží na https://liberskelahudky.github.io/strazci-rima/ z větve `gh-pages`, kam se nahrává obsah `dist/` po `npm run build`.

## Ukládání postupu

- Po každé změně se postup uloží do localStorage i do IndexedDB (dvě nezávislé kopie). Při startu se použije novější.
- Každý den se dělá záloha (posledních 14 dní); denní záloha se nepřepíše stavem s menším počtem denárů.
- Před resetem hry se uloží záloha „Před resetem“.
- Aplikace žádá prohlížeč o trvalé úložiště (`navigator.storage.persist`).
- V rodičovském nastavení jde zálohu zkopírovat jako kód, stáhnout jako soubor a obnovit (i v jiném telefonu).
