# Cizmar Photography

Osobné fotoportfólio — automobilová a motorsportová fotografia z Popradu.
Jednostránkový statický web s rezervačným kalendárom Cal.com.

- **Live:** https://samustang1.github.io/cizmar-photography/
- **Zdroj:** priečinok `docs/` (odsiaľto sa nasadzuje cez GitHub Actions)
- **Fotky:** dočasne ukážkové (Unsplash), pripravené na výmenu za vlastné

## Dizajn

Fotografie sú hlavná vec. Zvyšok je čierny rám, ktorý im nekonkuruje:

- full-bleed hero s veľkým nápisom `CIZMAR` cez fotografiu
- Helvetica Neue / Arial, biele písmo, jediný akcent `#ff3b30` v marku `//`
- úvod „Kto je Cizmar?“ — krátky text vľavo, fotografia vpravo
- portfólio: 6 širokých záberov v mriežke 3 × 2 + 3 detailové portréty
- full-bleed pás s bielym Lamborghini a krátkym CTA
- kompaktné služby, kontakt s kalendárom a pätička s priamymi odkazmi
- bez externých fontov, bez marquee, bez zbytočných panelov
- lightbox s klávesnicou, focusom a rešpektom k `prefers-reduced-motion`

## Štruktúra

```
docs/
├─ index.html               # celá stránka
└─ assets/
   ├─ css/photofirst.css    # štýly (tokeny v :root)
   ├─ img/
   │  ├─ favicon.svg        # červený mark //
   │  ├─ og.jpg             # Open Graph karta 1200×630
   │  └─ placeholder.svg
   └─ js/
      ├─ photofirst.js      # menu, scrollspy, lightbox
      └─ cal-embed.js       # lazy-load Cal.com inline kalendára
```

## Rezervácia

Klient si vyberá termín priamo na stránke cez Cal.com:
`https://cal.com/cizmar.photo/automobilove-fotenie`

Embed sa načíta až pri priblížení ku sekcii Kontakt (IntersectionObserver).
Ak sa kalendár nezobrazí, v karte je odkaz na otvorenie v novom okne.
Kalendár je zámerne kompaktný — na desktope má vnútorný posuv.

## Výmena ukážkových fotiek

V `docs/index.html` majú fotky `src` na `images.unsplash.com`. Vlastné
fotky stačí nahrať do `docs/assets/img/` a zmeniť `src` na napríklad
`assets/img/auto-01.jpg`. Odporúčaný pomer:

- hero: 16 : 9 alebo širší, min. 2200 px
- mriežka: 3 : 2, cca 1400 px
- detaily: 4 : 5, cca 1200 px
- pás: 21 : 9, min. 2200 px

## Archív

- `archive/portfolio-v1/` — pôvodná viacstránková verzia
- `archive/portfolio-v2/` — druhá verzia
- `archive/v2/` — medziverzia
- `archive/portfolio-v3/` — verzia pred v4 (editoriálny štýl)
- `archive/portfolio-v4/` — off-white editorial pred Nocturne
- `archive/portfolio-v5/` — Nocturne (zamietnutá ako „až príliš“)

Archív nie je súčasťou nasadenej stránky.

## Lokálne spustenie

Statický web — stačí ho otvoriť cez lokálny server, napr.:

```
npx serve docs
```

alebo v MAMP: `http://localhost/cizmar-photography/docs/`
