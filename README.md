# Cizmar Photography

Osobné fotoportfólio — automobilová a motorsportová fotografia z Popradu.
Jednostránkový statický web s rezervačným kalendárom Cal.com.

- **Live:** https://samustang1.github.io/cizmar-photography/
- **Zdroj:** priečinok `docs/` (odsiaľto sa nasadzuje cez GitHub Actions)
- **Fotky:** dočasne ukážkové (Unsplash), pripravené na výmenu za vlastné

## Štruktúra

```
docs/
├─ index.html            # celá stránka (hero, prístup, práce, služby, o mne, kontakt)
└─ assets/
   ├─ css/site.css       # štýly (tokeny v :root)
   └─ js/
      ├─ site.js         # menu, sticky hlavička, filtre, lightbox, reveal
      └─ cal-embed.js    # lazy-load Cal.com inline kalendára
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
- `archive/portfolio-v3/` — verzia pred redizajnom (október 2026)

Archív nie je súčasťou nasadenej stránky.

## Lokálne spustenie

Statický web — stačí ho otvoriť cez lokálny server, napr.:

```
npx serve docs
```

alebo v MAMP: `http://localhost/cizmar-photography/docs/`
