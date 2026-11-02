# Cal.com — nastavenie rezervácií

Cieľ: klient si na stránke vyberie dátum a čas, fotenie trvá **3 hodiny**,
medzi foteniami je priestor a za deň sú maximálne **1–2 rezervácie**.
Termíny majú sedieť aj školskému režimu.

## Aktuálny odkaz

- Event: `https://cal.com/cizmar.photo/automobilove-fotenie`
- Účet / brand: `cizmar.photo`
- Dĺžka eventu: **180 minút**
- Embed na stránke: `docs/assets/js/cal-embed.js`
  - lazy-load pri priblížení ku kontaktu
  - `layout: month_view`, `theme: light`
  - `hideEventTypeDetails: true`

## 1. Event typ

V Cal.com → **Event Types** → `Automobilové fotenie`:

- **Duration:** 180 minút
- **Timezone:** Europe/Bratislava
- **Minimum notice:** 48 hodín
- **Booking horizon:** 60 dní
- **Limit:** max. 2 rezervácie na deň (ak chceš istotu, nastav 1)
- **Buffer:** 60 minút po fotení
- **Booking approval:** podľa potreby (pri 1–2 termínoch denne odporúčam zapnúť)

## 2. Dostupnosť

V **Availability** nastav školský režim:

- Pondelok–piatok: **15:00–19:00**
- Sobota–nedeľa: **09:00–19:00**
- Skontroluj, že **štvrtok 15:00–19:00** tam naozaj je.
- Ak sa dá, nechaj medzi blokmi aspoň hodinovú pauzu.

Pri 3-hodinovom fotení od 15:00 končíš o 18:00; buffer do 19:00.
Víkendový termín od 9:00 končí o 12:00, druhý môže byť od 13:00.

## 3. Polia pri rezervácii

- Meno — povinné
- E-mail — povinné
- Telefón — povinné
- Auto (značka / model) — povinné
- Lokalita / mesto — povinné
- Služba — výber: `Fotenie auta`, `Motorsport`
- Poznámky / predstava — nepovinné
- GDPR súhlas — povinný

## 4. Notifikácie

- E-mail tebe pri novej rezervácii — ON
- E-mail klientovi s potvrdením — ON
- Pripomienka 24 h pred — ON
- Kalendár (.ics) — ON
- Prepojenie s Google/Outlook kalendárom — ON

## 5. Test pred zverejnením

1. Otvor stránku v inkognite.
2. Vyber dátum a čas, vyplň formulár.
3. Skontroluj, že:
   - rezervácia má 3 hodiny,
   - prišiel e-mail tebe aj klientovi,
   - v kalendári je blokovaný celý čas,
   - deň s dvomi rezerváciami sa už nedá prekročiť,
   - po 48 hodinách sa nedá rezervovať termín na zajtra.
4. Skús aj mobil: kalendár sa načíta až pri kontakte a dá sa v ňom posúvať.

## 6. Ak sa kalendár nezobrazí

Na stránke je v karte odkaz „otvor ho v novom okne“ na priamy Cal.com link.
Ak by sa embed načítaval pomaly, je to v poriadku — načítava sa lazy až pri
priblížení ku kontaktu.
