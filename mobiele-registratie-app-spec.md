# Mobiele registratie-app — ambulant jongerenwerk (1-vraag-per-scherm wizard)

## A) Datamodel (Daglog + Contactblok + Hotspot + Telling-tabellen)

### Entiteiten & relaties (conceptueel)
- **Daglog** (1 per jongerenwerker per dag) bevat **0..n Contactblokken** en **0..n Hotspots** (optioneel per contactblok of los). Daarnaast bevat het **tellingen** voor Hoofdthema’s, Uitkomsten en Ketenpartners.
- **Contactblok** representeert een aaneengesloten ambulant contactmoment in wijk/school/openbare ruimte of ketenpartner-overleg.
- **Hotspot** is een geaggregeerde locatieobservatie (lat/long + categorie + drukte), bruikbaar voor heatmaps.
- **Telling**-tabellen bevatten per categorie het aantal (0..n). Geen persoonsgegevens van jongeren.

### Datamodel (implementatiegericht, velden + types + regels)

#### Daglog
| Veld | Type | Verplicht | Regels/validatie |
|---|---|---|---|
| id | UUID | ja | systeem gegenereerd |
| datum | Date (YYYY-MM-DD) | ja | default = vandaag, aanpasbaar |
| jongerenwerker_id | UUID | ja | automatisch vanuit login, niet wijzigbaar |
| jongerenwerker_naam | String | ja | automatisch vanuit login, niet wijzigbaar |
| werkgebied | Enum | ja | exact: Cuijk, Boxmeer, Mill, Grave, Sint Anthonis, West Maas en Waal |
| kern | String | ja | uit Kernlijst_LVC + Kernlijst_WMW (searchable) |
| totaal_jongeren_gesproken | Integer | ja | >= 0 |
| contactblokken | Array<Contactblok> | nee | 0..n |
| hotspots | Array<Hotspot> | nee | 0..n |
| telling_hoofdthema | Array<TellingHoofdthema> | ja | 12 items, default 0 |
| telling_uitkomst | Array<TellingUitkomst> | ja | 8 items, default 0 |
| telling_ketenpartner | Array<TellingKetenpartner> | ja | 11 items, default 0 |
| opmerkingen | String(240) | nee | waarschuwing bij > 200 tekens, max 240 |
| created_at | DateTime | ja | systeem |
| updated_at | DateTime | ja | systeem |

**Validatie Daglog**
- `som(telling_hoofdthema.aantal)` **mag hoger** zijn dan `totaal_jongeren_gesproken` (dubbele thema’s mogelijk).
- `som(telling_uitkomst.aantal)` **mag hoger** zijn dan `totaal_jongeren_gesproken`.
- `telling_ketenpartner.aantal_contacten` staat **los** van jongerentotaal.

#### Contactblok
| Veld | Type | Verplicht | Regels/validatie |
|---|---|---|---|
| id | UUID | ja | systeem |
| daglog_id | UUID | ja | referentie Daglog |
| start_tijd | Time (HH:MM) | nee | optioneel |
| eind_tijd | Time (HH:MM) | nee | optioneel; indien gevuld: eind >= start |
| locatie_type | Enum | ja | Openbare ruimte (ambulant), School, In de wijk (voorziening/plek), Ketenpartner-overleg |
| school | String | nee | verplicht als locatie_type = School |
| hotspot_ref_id | UUID | nee | koppeling naar Hotspot, optioneel |
| plek_omschrijving | String(240) | nee | waarschuwing bij > 200 tekens |
| aantal_jongeren_contactblok | Integer | nee | >= 0 |
| ketenpartners | Array<KetenpartnerContact> | nee | optioneel per contactblok |
| opmerkingen | String(240) | nee | waarschuwing bij > 200 tekens |

#### Hotspot
| Veld | Type | Verplicht | Regels/validatie |
|---|---|---|---|
| id | UUID | ja | systeem |
| daglog_id | UUID | ja | referentie Daglog |
| latitude | Decimal(9,6) | ja | -90..90 |
| longitude | Decimal(9,6) | ja | -180..180 |
| naam | String(120) | nee | optioneel |
| categorie | Enum | ja | bijv. Hangplek, Schoolplein, Park, Winkelgebied, OV, Overig (uit lijst) |
| drukte | Enum | ja | Laag, Midden, Hoog |
| bron | Enum | ja | GPS, Handmatig |
| created_at | DateTime | ja | systeem |

#### TellingHoofdthema
| Veld | Type | Verplicht | Regels |
|---|---|---|---|
| daglog_id | UUID | ja | referentie Daglog |
| thema_code | Enum(1..12) | ja | vaste lijst Hoofdthema’s |
| thema_label | String | ja | vaste label |
| aantal | Integer | ja | >= 0 |

#### TellingUitkomst
| Veld | Type | Verplicht | Regels |
|---|---|---|---|
| daglog_id | UUID | ja | referentie Daglog |
| uitkomst_code | Enum(1..8) | ja | vaste lijst Uitkomst |
| uitkomst_label | String | ja | vaste label |
| aantal | Integer | ja | >= 0 |

#### TellingKetenpartner
| Veld | Type | Verplicht | Regels |
|---|---|---|---|
| daglog_id | UUID | ja | referentie Daglog |
| partner_code | Enum | ja | vaste lijst Ketenpartners |
| partner_label | String | ja | vaste label |
| aantal_contacten | Integer | ja | >= 0 |

#### KetenpartnerContact (optioneel per contactblok)
| Veld | Type | Verplicht | Regels |
|---|---|---|---|
| contactblok_id | UUID | ja | referentie Contactblok |
| partner_code | Enum | ja | vaste lijst Ketenpartners |
| aantal_contacten | Integer | ja | >= 0 |

---

## B) Wizard-flow (1-vraag-per-scherm) + condities

**Algemene UI-regels**
- Elke stap = 1 vraag/taak. Geen extra velden op hetzelfde scherm.
- Navigatie: **Vorige** / **Volgende** onderin, met voortgangsindicator (bijv. 3/12).
- Eindoverzicht: alle antwoorden in kaartjes + **Bewerken** per sectie + **Opslaan**.
- Alle dropdowns zijn searchable + type-ahead, met recents/favorieten (top 5), virtualized list.
- Tekstvelden max 240 tekens + waarschuwing vanaf 200 tekens.
- Geen persoonsgegevens van jongeren (copy in veldhint en waarschuwing bij >200 tekens).

### Wizard stappen (Daglog)
1. **Datum**: standaard vandaag, aanpasbaar.
2. **Werkgebied** (verplicht): vaste lijst (exact).
3. **Kern** (verplicht): lijst Kernlijst_LVC + Kernlijst_WMW.
4. **Totaal jongeren gesproken vandaag** (verplicht): integer.
5. **Hoofdthema’s telling**: mini-grid met alle 12 thema’s (aantallen). (Zie C)
6. **Uitkomsten telling**: mini-grid met 8 uitkomsten (aantallen). (Zie C)
7. **Ketenpartners telling**: mini-grid met 11 partners (aantal contacten). (Zie C)
8. **Contactblokken**: vraag “Wil je een contactblok toevoegen?” (ja/nee)
   - Zo ja: door naar Contactblok-wizard (per blok). Na afronden → “Nog een contactblok?”
9. **Hotspots**: vraag “Wil je een hotspot toevoegen?” (ja/nee)
   - Zo ja: hotspot-wizard (kan los of koppelen aan contactblok)
10. **Opmerkingen** (optioneel, max 240)
11. **Eindoverzicht** + bewerken
12. **Opslaan**

### Contactblok-subflow (per blok)
1. **Locatie-type** (verplicht): Openbare ruimte / School / In de wijk / Ketenpartner-overleg
2. **School** (verplicht **alleen** als locatie-type = School)
3. **Plekomschrijving** (optioneel, max 240)
4. **Aantal jongeren in dit contactblok** (optioneel)
5. **Ketenpartnercontacten in dit blok?** (ja/nee)
   - Zo ja: mini-grid ketenpartners + aantallen (zelfde component als dagtotaal, maar blok-scope)
6. **Koppelen aan hotspot?** (ja/nee)
   - Zo ja: kies bestaande hotspot of maak nieuwe (start hotspot-flow)
7. **Opmerkingen** (optioneel)
8. **Samenvatting contactblok** → opslaan

### Hotspot-subflow
1. **Locatie kiezen**: GPS gebruiken (default) of handmatig op kaart.
2. **Naam (optioneel)**
3. **Categorie** (verplicht) + **Drukte** (verplicht)
4. **Opslaan**

---

## C) UI-specificatie telling-schermen (mini-grid + zoeken)

**Doel:** snel aantallen invullen per categorie zonder extra schermen.

### Layout
- Boven: **Zoekbalk** (type-ahead)
  - Live filter, case-insensitive, negeert diacritics/spaties, optionele fuzzy.
- Direct onder zoekbalk: **Recents/Favorieten** (top 5) als chips.
- Daaronder: **Virtualized lijst** met items (label + teller).

### Mini-grid item (per categorie)
- Linkerzijde: label (bijv. “3 Mentale gezondheid & welbevinden”).
- Rechterzijde: tellercomponent met:
  - **-** knop (min 0)
  - **nummerinput** (direct bewerkbaar)
  - **+1** knop (snelle increment)
- Teller is altijd zichtbaar; leeg = 0.

### Interactie en validatie
- Nummerinput accepteert alleen integers >= 0.
- Long press op +1 = auto-repeat (optioneel).
- Totals onderaan: “Totaal (optioneel): X” (informatief, geen blokkade).

---

## D) Voorbeeld JSON (1 daglog, 2 contactblokken + tellingen)

```json
{
  "id": "0f3f1d8e-6d4a-4f18-8f3f-1a2b3c4d5e6f",
  "datum": "2025-02-12",
  "jongerenwerker_id": "7a2f6b1c-1234-5678-9abc-0d1e2f3a4b5c",
  "jongerenwerker_naam": "Sara Jansen",
  "werkgebied": "Cuijk",
  "kern": "Cuijk",
  "totaal_jongeren_gesproken": 18,
  "telling_hoofdthema": [
    {"thema_code": 1, "thema_label": "School & opleiding", "aantal": 5},
    {"thema_code": 3, "thema_label": "Mentale gezondheid & welbevinden", "aantal": 6},
    {"thema_code": 9, "thema_label": "Overlast & veiligheid", "aantal": 4},
    {"thema_code": 12, "thema_label": "Wijk & leefomgeving", "aantal": 3}
  ],
  "telling_uitkomst": [
    {"uitkomst_code": 1, "uitkomst_label": "Relatie opgebouwd/onderhouden", "aantal": 10},
    {"uitkomst_code": 2, "uitkomst_label": "Informatie/advies gegeven", "aantal": 7},
    {"uitkomst_code": 7, "uitkomst_label": "Afspraak vervolgcontact", "aantal": 4}
  ],
  "telling_ketenpartner": [
    {"partner_code": "Politie", "partner_label": "Politie", "aantal_contacten": 2},
    {"partner_code": "School/mentoren", "partner_label": "School/mentoren", "aantal_contacten": 1}
  ],
  "contactblokken": [
    {
      "id": "c1b2c3d4-e5f6-7890-abcd-ef0123456789",
      "start_tijd": "14:00",
      "eind_tijd": "15:30",
      "locatie_type": "Openbare ruimte (ambulant)",
      "plek_omschrijving": "Skatepark bij het winkelcentrum",
      "aantal_jongeren_contactblok": 8,
      "ketenpartners": [],
      "opmerkingen": "Kort gesprek over schoolkeuze."
    },
    {
      "id": "d2c3b4a5-6789-4abc-def0-1234567890ab",
      "start_tijd": "16:00",
      "eind_tijd": "17:00",
      "locatie_type": "School",
      "school": "Merletcollege",
      "plek_omschrijving": "Aula",
      "aantal_jongeren_contactblok": 10,
      "ketenpartners": [
        {"partner_code": "School/mentoren", "aantal_contacten": 1}
      ],
      "opmerkingen": "Afstemming met mentor over groepsdynamiek."
    }
  ],
  "hotspots": [
    {
      "id": "hs-1111-2222-3333-4444",
      "latitude": 51.728901,
      "longitude": 5.879654,
      "naam": "Skatepark",
      "categorie": "Hangplek",
      "drukte": "Hoog",
      "bron": "GPS"
    }
  ],
  "opmerkingen": "Geen persoonsgegevens opgenomen."
}
```

---

## E) KPI’s / visualisaties

1. **Bereik per dag/gebied**
   - KPI: totaal_jongeren_gesproken per dag, per werkgebied en kern.
   - Visualisatie: stacked bar per dag (werkgebied) + tabel met kern.

2. **Top-hoofdthema’s**
   - KPI: som `telling_hoofdthema.aantal` per thema.
   - Visualisatie: horizontale bar (top 5) + trend per week.

3. **Uitkomsten**
   - KPI: som `telling_uitkomst.aantal` per uitkomst.
   - Visualisatie: donut + trendlijn per week.

4. **Ketenpartnercontacten**
   - KPI: som `telling_ketenpartner.aantal_contacten` per partner.
   - Visualisatie: bar chart + tabel met % aandeel.

5. **Hotspots / heatmap**
   - KPI: aantal hotspots, gemiddelde drukte per gridcel.
   - Visualisatie: interactieve heatmap (lat/long geaggregeerd naar grid/hexbin).

---

## Vaste lijsten (voor implementatie)

### Werkgebied (verplicht, exact)
- Cuijk
- Boxmeer
- Mill
- Grave
- Sint Anthonis
- West Maas en Waal

### Locatie-type
- Openbare ruimte (ambulant)
- School
- In de wijk (voorziening/plek)
- Ketenpartner-overleg

### Uitkomst (8)
1. Relatie opgebouwd/onderhouden
2. Informatie/advies gegeven
3. Begrensd / normstellend gesprek
4. De-escalatie / rust hersteld
5. Doorverwezen (intern/extern)
6. Signaal opgehaald (zorg/veiligheid/overlast)
7. Afspraak vervolgcontact
8. Escalatie/incident (met vervolgactie)

### Hoofdthema’s (12)
1. School & opleiding
2. Thuis & gezin
3. Mentale gezondheid & welbevinden
4. Vriendschap, liefde & seksualiteit
5. Sociale vaardigheden & weerbaarheid
6. Vrije tijd & meedoen
7. Middelengebruik
8. Online & media
9. Overlast & veiligheid
10. Werk & toekomst
11. Identiteit & diversiteit
12. Wijk & leefomgeving

### Ketenpartners (11)
- Politie
- Leerplicht
- School/mentoren
- Winkelpersoneel
- BOA
- Wijkteam
- CJG
- Gemeente
- Woningcorporatie
- Jongerencentrum
- Overig
```
