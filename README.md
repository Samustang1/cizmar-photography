# LÁSKE — Automobilové fotoportfólio

Samostatné webové portfólio automobilového fotografa (statické, viacstránkové).

- **Live:** https://samustang1.github.io/laske-portfolio/
- **Zdroj stránky:** priečinok [`docs/`](docs/) — sem patria všetky HTML, CSS a JS súbory
- **Archív:** `archive/portfolio-v1/` — pôvodná jednostranová verzia (nie je súčasťou live webu)

## Štruktúra

```
docs/                      # nasadzovaná stránka
├─ index.html              # Domov
├─ portfolio.html          # Galéria s filtrami a lightboxom
├─ o-mne.html              # O mne
├─ sluzby.html             # Služba + časté otázky
├─ kontakt.html            # Kontakt a rezervačný formulár
├─ dakujeme.html           # Poďakovanie po odoslaní
└─ assets/                 # css/style.css, js/main.js

archive/portfolio-v1/      # stará verzia (archív)
.github/workflows/         # nasadenie na GitHub Pages
```

## Nasadenie

Push do vetvy `main` spustí GitHub Actions (`.github/workflows/deploy-pages.yml`),
ktorý nasadí priečinok `docs/` na GitHub Pages.

## Rezervačný formulár

Formulár odosiela e-mail cez službu **FormSubmit** do schránky `cizsamko@gmail.com`.
Návštevník neopúšťa stránku (žiadny `mailto`). Prvýkrát treba formulár jednorazovo
**aktivovať** kliknutím na „Activate Form" v e-maile od FormSubmit.

Zmenu príjemcu spravíš v `docs/kontakt.html` (atribút `action`, `_next`) a v
`docs/assets/js/main.js` (konštanta `ENDPOINT`).
