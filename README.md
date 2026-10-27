# Cizmar Photography

Osobné fotoportfólio — automobilová a motorsportová fotografia z Popradu.
Jednostránkový statický web s rezervačným kalendárom Cal.com.

- **Live:** https://samustang1.github.io/cizmar-photography/
- **Zdroj:** priečinok `docs/` (odsiaľto sa nasadzuje cez GitHub Actions)
- **Fotky:** dočasne ukážkové (Unsplash), pripravené na výmenu za vlastné

## Dizajn — Nocturne

Tmavý cinematický smer postavený od základov:

- split hero: typografický panel vľavo, full-bleed fotografia vpravo
- Anton + Instrument Serif italic + Inter, akcent `#ff3b30`
- asymetrická dvojstĺpcová galéria s offsetom
- papierová (svetlá) sekcia Služby / O mne, tmavý kontakt
- žiadny marquee, žiadne filtre ani „programátorské" panely
- jemné motion efekty s rešpektom k `prefers-reduced-motion`

## Štruktúra

```
docs/
├─ index.html              # celá stránka (hero, prístup, práce, služby, o mne, kontakt)
└─ assets/
   ├─ css/nocturne.css     # štýly (tokeny v :root)
   ├─ img/
   │  ├─ favicon.svg
   │  ├─ og.jpg            # Open Graph karta 1200×630
   │  └─ placeholder.svg
   └─ js/
      ├─ nocturne.js       # menu, sticky hlavička, scrollspy, reveal, lightbox
      └─ cal-embed.js      # lazy-load Cal.com inline kalendára
```

## Rezervácia

Klient si vyberá termín priamo na stránke cez Cal.com:
`https://cal.com/cizmar.photo/automobilove-fotenie`

Embed sa načíta až pri priblížení ku sekcii Kontakt (IntersectionObserver).
Ak sa kalendár nezobrazí, v karte je odkaz na otvorenie v novom okne.

## Archív

- `archive/portfolio-v1/` — pôvodná viacstránková verzia
- `archive/portfolio-v2/` — druhá verzia
- `archive/v2/` — medziverzia
- `archive/portfolio-v3/` — verzia pred v4 (editoriálny štýl)
- `archive/portfolio-v4/` — verzia pred Nocturne (off-white editorial)

Archív nie je súčasťou nasadenej stránky.

## Lokálne spustenie

Statický web — stačí ho otvoriť cez lokálny server, napr.:

```
npx serve docs
```

alebo v MAMP: `http://localhost/cizmar-photography/docs/`
