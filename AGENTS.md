# Cizmar Photography — pravidlá pre prácu v tomto repozitári

## Povinné po každej zmene (bez výnimky)
1. **Vždy `git add` + `git commit` + `git push`** na `origin/main` po každej zmene, ktorú spravím.
   - Nikdy nenechávaj zmeny necommitnuté ani lokálne.
   - Platí to aj pre malé úpravy, opravy preklepov a jednosúborové zmeny.
2. Po pushi **over nasadenie** cez GitHub Actions API a skontroluj, že workflow `Deploy portfolio to GitHub Pages` skončil so `success`.
3. Nakoniec over, že **live stránka** (GitHub Pages) vracia HTTP 200 a obsahuje očakávaný obsah.
3. Komunikuj po slovensky.

## Projekt
- Repo: `Samustang1/cizmar-photography` (verejné), vetva `main`.
- GitHub Pages sa nasadzuje z priečinka `docs/` (workflow `.github/workflows/deploy-pages.yml`).
- Live: `https://samustang1.github.io/cizmar-photography/`

## Štruktúra
- `docs/index.html` — **hlavná stránka = v3** (futuristický tmavý dizajn, canvas/HUD)
- `docs/v3/index.html` — presmerovanie na `/` (aby stará adresa `/v3/` fungovala)
- `docs/assets/css/v3.css`, `docs/assets/js/v3.js` — assety v3
- `docs/v2/*` — pôvodný modrý viacstránkový web (index, kontakt, portfolio, sluzby, o-mne, dakujeme), dostupný na `/v2/`
- `docs/assets/css/style.css`, `docs/assets/js/main.js` — assety starého webu (v2)
- `archive/portfolio-v1`, `archive/portfolio-v2` — záložné kópie (nepublikujú sa)
- `TEXTY-NA-PREPIS.md` — šablóna textov na prepis

## Poznámky
- Cache-busting cez `?v=N` na CSS/JS; po zmene assetu zvýšiť `N`.
- Formulár odosiela cez FormSubmit AJAX (viď `docs/v2/kontakt.html`).
- Pri commite sa hlási `LF will be replaced by CRLF` — neškodné.
