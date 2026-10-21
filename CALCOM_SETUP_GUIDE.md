# Cal.com – Profesionálne nastavenie pre Cizmar Photography

Tento návod vás krok za krokom prenesie cez nastavenie Cal.com tak, aby ste mali **jednotlivý event typ „Automobilové fotenie“** s dĺžkou **cca 3 hodín**, **bez časového limitu** pre klienta, a profesionálnym vzhľadom.

---

## 1. Vytvorenie účtu a organizácie

1. Choďte na **https://cal.com** a prihláste sa / vytvorte účet.
2. Pri prvom nastavení sa vás pýta **názov organizácie** – zadajte: `Cizmar Photography`
3. Vyberte **časovú zónu**: `Europe/Bratislava` (UTC+1/+2)
4. Jazyk: `Slovenčina` (alebo čeština, ak slovenčina nie je k dispozícii)

---

## 2. Nastavenie dostupnosti (Availability)

> **Kľúčové:** Aby sa klient nemusel trápiť 30-minútovými slotmi, nastavte **celodennú dostupnosť** a nechajte dĺžku eventu riadiť **Event Typom**.

1. Vľavo v menu kliknite na **Availability** (Dostupnosť).
2. **Default schedule** – nastavte:
   - Pondelok – Piatok: **08:00 – 18:00**
   - Sobota: **09:00 – 15:00** (voliteľne)
   - Nedeľa: **Zavreté**
3. **Buffer time** (vyrovnávacia doba): **0 minút** (my sa chceme mať plnú kontrolu).
4. **Minimum notice** (minimálne upozornenie): **24 hodín** (aby ste mali čas sa pripraviť).
5. **Maximum booking horizon**: **60 dní** (alebo podľa potreby).
6. Uložte.

---

## 3. Vytvorenie Event Typu – „Automobilové fotenie“

Toto je **najdôležitejší krok**. Event typ definuje, čo klient vidí a rezervuje.

1. Vľavo v menu kliknite na **Event Types** → **New Event Type**.
2. **Basic Settings**:
   - **Title**: `Automobilové fotenie`
   - **Slug**: `automobilove-fotenie` → URL bude `https://cal.com/cizmar-photography/automobilove-fotenie`
   - **Description**: 
     ```
     Profesionálne automobilové fotenie exteriéru, interiéru a detailov.
     Trvanie: cca 3 hodiny. Miesto a čas sa dohodneme individuálne.
     Po rezervácii vám napíšem na potvrdenie a detailné upozornenie.
     ```
   - **Event duration**: **180 minút** (3 hodiny) ← **TOTO JE KĽÚČOVÉ**
   - **Event type**: `One-on-one` (jedno na jedno)

3. **Availability** (pre tento konkrétny event typ):
   - Použiť **Custom availability** (vlastná dostupnosť) – skopírujte z Default schedule, ale môžete pridať viac voľných dní.
   - **Buffer time**: 0
   - **Minimum notice**: 24 hours
   - **Date override limit**: 60 days

4. **Booking Fields** (polia pri rezervácii):
   - **Name** – Required
   - **Email** – Required
   - **Phone** – Required (nanič `Collect phone number` = ON)
   - **Custom inputs** (pridajte 4 vlastné polia):
     1. **Auto (značka/model)** – Text, Required
     2. **Lokalita / mesto** – Text, Required
     3. **Služba** – Select/Dropdown, Required
        - Options: `Fotenie auta`, `Motorsport`
     4. **Poznámky / predstava** – Textarea, Optional
   - **GDPR consent** – Required (checkbox s textom: „Súhlasím so spracovaním údajov pre rezerváciu fotenia.“)

5. **Workflow / Notifications**:
   - **Email to organizer (vám)** – ON (nová rezervácia)
   - **Email to attendee (klientovi)** – ON (potvrdenie)
   - **Reminder emails**: 24h pred + 1h pred
   - **Calendar invite (.ics)** – ON (klient dostane kalendár)

5. **Redirect after booking**:
   - **Redirect URL**: `https://samustang1.github.io/cizmar-photography/?booked=success`
   - Alebo nechajte prázdne (zobrazí sa Cal.com ďakovačka stránka)

6. **Branding** (vzhľad):
   - **Logo**: nahrajte logo Cizmar Photography (SVG/PNG, biele na tmavom)
   - **Brand color**: `#e2342b` (vaša accent farba)
   - **Dark mode**: ON (vaša stránka je tmavá v kontakte)

6. **Advanced**:
   - **Require booking approval**: **OFF** (okamžitá rezervácia) – ak chcete kontrolu, zapnite ON.
   - **Hide calendar notes**: OFF
   - **Lock timezone**: ON (zamknite na Europe/Bratislava)

7. **Save** → **Publish**.

---

## 4. Testovanie

1. Otvorte `https://cal.com/cizmar-photography/automobilove-fotenie` v **inkognito režime**.
2. Vyberte dátum → čas → vyplňte polia → **Book**.
3. Skontrolujte:
   - Prišiel vám email?
   - Prišiel klientovi email s .ics?
   - V Cal.com dashboardu vidíte rezerváciu s 3h dĺžkou?
   - V kalendári (Google/Outlook) sa event vytvoril s 3h dĺžkou?

---

## 5. Embed na vašu stránku

Na stránke máte už pripravený **button** s odkazom:
```html
<a href="https://cal.com/cizmar-photography/automobilove-fotenie" 
   class="btn btn--solid cal-btn" target="_blank" rel="noopener">
  Rezervovať cez Cal.com
</a>
```

**Alternatívne – Inline embed** (ak chcete kalendár priamo na stránke):
```html
<script src="https://cal.com/embed.js" defer></script>
<cal-com 
  username="cizmar-photography" 
  event="automobilove-fotenie" 
  layout="month_view"
  theme="dark"
  hide-event-type-details="false"
  hide-organizer-details="true">
</cal-com>
```
*Poznámka: Inline embed zaberá veľa miesta, button je pre váš design lepší.*

---

## 6. Tipy pre 3-hodinové fotenie bez časového stresu

| Problém | Riešenie v Cal.com |
|---------|-------------------|
| Klient si vyberie 10:00, vy ste ale v 13:00 ešte na mieste | Nastavte **Event duration = 180 min**. Cal.com blokuje 3h slot. |
| Chcete mať pauzu medzi foteniami | V **Availability** nastavte **Buffer after each event = 60 min** (alebo viac). |
| Klient chce iný čas ako je v kalendári | Zapnite **„Allow attendees to propose new times“** v Event Type → Advanced. |
| Chcete schvaľovať rezervácie manuálne | V Event Type → Advanced zapnite **Require booking approval = ON**. |

---

## 7. Checklist pred GO LIVE

- [ ] Organácia vytvorená: `Cizmar Photography`
- [ ] Časová zóna: `Europe/Bratislava`
- [ ] Event typ: `Automobilové fotenie` (slug: `automobilove-fotenie`)
- [ ] Dĺžka: **180 minút**
- [ ] Vlastné polia: Auto, Lokalita, Služba, Poznámky
- [ ] GDPR checkbox: povinný
- [ ] Email notifikácie: ON (vám + klient)
- [ ] .ics kalendár: ON
- [ ] Brand color: `#e2342b`, Dark mode: ON
- [ ] Test v inkognite prebehol úspešne
- [ ] Tlačidlo na webe funguje (`target="_blank"`)

---

## 8. Užitočné linky

- **Dashboard**: https://cal.com/settings
- **Event Types**: https://cal.com/event-types
- **Availability**: https://cal.com/availability
- **Váš booking link**: https://cal.com/cizmar-photography/automobilove-fotenie
- **Dokumentácia**: https://cal.com/docs

---

## 9. Ďalšie event typy (budúcnosť)

Keď budete chcieť pridať iné služby, vytvorte nové Event Types:
- `Motorsport fotenie` – 240 min (4h), iná dostupnosť (víkendy)
- `Rýchle exteriérové` – 60 min, pre rýchle shooty
- `Komerčné fotenie` – custom dĺžka, vyžaduje schváľovanie

Všetko sa riadi rovnakým princípom: **Event duration = reálny čas fotenia**.

---

*Verzia 1.0 – Cizmar Photography – Október 2026*