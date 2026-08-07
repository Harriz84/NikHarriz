# Sociom — Uniform registratievenster (prototype)

## 1) Functioneel datamodel

### 1.1 Ontwerpkeuzes
- **Team** wordt niet opgeslagen; dit volgt uit de gekozen **dienst**.
- **Doelgroep** wordt bewust niet opgenomen.
- Eén centraal tekstveld voor **korte toelichting / gespreksverslag**.
- Het model ondersteunt alle gevraagde registraties:
  - individueel contact
  - anoniem contact
  - trajectcontact
  - groepscontact / activiteit
  - signaal / observatie
  - netwerkcontact
  - intern overleg
  - voorbereiding / uitwerking
  - registratie / administratie

### 1.2 Kernentiteiten

#### Entiteit: `registratie`
Hoofdrecord per werkmoment.

| Veld | Type | Verplicht | Uitleg / regels |
|---|---|---:|---|
| id | UUID | ja | Unieke sleutel |
| registratiedatum | DateTime | ja | Moment van registratie |
| medewerker_id | UUID | ja | Vanuit login / IAM |
| dienst_code | String | ja | Dienst waarbinnen gewerkt is |
| werksoort | Enum | ja | Zie lijst werksoorten |
| registratievorm | Enum | ja | `op_naam`, `anoniem`, `groep_activiteit`, `niet_van_toepassing` |
| plaats_type | Enum | ja | Dynamisch: `woonplaats_inwoner`, `kern_inwoner`, `kern_activiteit`, `locatie_activiteit` |
| plaats_naam | String | ja | Waarde behorend bij gekozen plaats_type |
| eerste_contact_sociom | Enum | conditioneel | Alleen zichtbaar/verplicht bij `registratievorm=anoniem`: `ja`, `nee`, `onbekend` |
| hoofdthema | Enum | ja | Inhoudelijk hoofdonderwerp |
| aard_inzet | Enum | ja | Type inzet, incl. direct/indirect/groepsgericht |
| opbrengst_vervolgstatus | Enum | ja | Resultaat / vervolgstatus |
| toelichting_gespreksverslag | String(2000) | nee | Kort vrij tekstveld |
| created_at | DateTime | ja | Systeemveld |
| updated_at | DateTime | ja | Systeemveld |

#### Dimensie / referentielijsten
- `ref_werksoort`
- `ref_registratievorm`
- `ref_hoofdthema`
- `ref_aard_inzet`
- `ref_opbrengst_vervolgstatus`
- `ref_kern`
- `ref_woonplaats`
- `ref_activiteit_locatie`

> Advies: houd referentielijsten configureerbaar zodat rapportages stabiel blijven bij tekstwijzigingen.

### 1.3 Enumeraties (prototype)

#### Werksoort (`werksoort`)
1. `individueel_contact`
2. `anoniem_contact`
3. `trajectcontact`
4. `groepscontact_activiteit`
5. `signaal_observatie`
6. `netwerkcontact`
7. `intern_overleg`
8. `voorbereiding_uitwerking`
9. `registratie_administratie`

#### Registratievorm (`registratievorm`)
- `op_naam`
- `anoniem`
- `groep_activiteit`
- `niet_van_toepassing`

#### Hoofdthema (`hoofdthema`) — voorbeeldset
- `opgroeien_ontwikkeling`
- `mentale_gezondheid`
- `financien`
- `wonen`
- `werk_dagbesteding`
- `veiligheid`
- `relaties_gezin`
- `participatie_sociaal_netwerk`
- `overig`

#### Aard van de inzet (`aard_inzet`)
- `direct_contact`
- `indirect_werk`
- `groepsgericht_werk`
- `signalering`
- `afstemming_ketenpartner`

#### Opbrengst / vervolgstatus (`opbrengst_vervolgstatus`)
- `informatie_advies_gegeven`
- `vraag_verhelderd`
- `doorverwijzing_gedaan`
- `vervolgafspraak_gepland`
- `traject_lopend`
- `afgesloten`
- `geen_vervolg`

---

## 2) Voorstel conditionele zichtbaarheid van velden

| Stap | Veld | Zichtbaar wanneer | Verplicht wanneer | Toelichting |
|---|---|---|---|---|
| 1 | Werksoort | Altijd | Altijd | Start van de registratie |
| 2 | Registratievorm | Altijd | Altijd | Stuurt dynamiek van volgende velden |
| 3 | Plaats type + naam | Altijd | Altijd | Label/opties wijzigen op basis van werksoort + registratievorm |
| 4 | Eerste contact met Sociom | Alleen bij `registratievorm=anoniem` | Alleen bij `registratievorm=anoniem` | Keuze: ja/nee/onbekend |
| 5 | Hoofdthema | Altijd | Altijd | Eenduidig thema per werkmoment |
| 6 | Aard van de inzet | Altijd | Altijd | Nodig voor direct/indirect/groepsgericht ratio |
| 7 | Opbrengst / vervolgstatus | Altijd | Altijd | Rapportage op resultaat |
| 8 | Toelichting / gespreksverslag | Altijd | Optioneel | Eén kort vrij tekstveld |

### Dynamiek voor veld **Plaats**

| Context | `plaats_type` opties | Label in UI |
|---|---|---|
| Inwonercontact (`individueel_contact`, `anoniem_contact`, `trajectcontact`) | `woonplaats_inwoner`, `kern_inwoner` | “Woonplaats/kern inwoner” |
| Activiteit (`groepscontact_activiteit`) | `kern_activiteit`, `locatie_activiteit` | “Kern of locatie activiteit” |
| Overige werksoorten | `kern_inwoner`, `kern_activiteit`, `locatie_activiteit` | “Plaats (kern/locatie)” |

> Validatieregel: `plaats_naam` moet behoren bij de gekozen waardelijst voor `plaats_type`.

---

## 3) JSON Schema (prototype)

```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "$id": "https://sociom.local/schema/registratie.json",
  "title": "SociomRegistratie",
  "type": "object",
  "additionalProperties": false,
  "required": [
    "id",
    "registratiedatum",
    "medewerker_id",
    "dienst_code",
    "werksoort",
    "registratievorm",
    "plaats_type",
    "plaats_naam",
    "hoofdthema",
    "aard_inzet",
    "opbrengst_vervolgstatus"
  ],
  "properties": {
    "id": {
      "type": "string",
      "format": "uuid"
    },
    "registratiedatum": {
      "type": "string",
      "format": "date-time"
    },
    "medewerker_id": {
      "type": "string",
      "format": "uuid"
    },
    "dienst_code": {
      "type": "string",
      "minLength": 1,
      "maxLength": 50
    },
    "werksoort": {
      "type": "string",
      "enum": [
        "individueel_contact",
        "anoniem_contact",
        "trajectcontact",
        "groepscontact_activiteit",
        "signaal_observatie",
        "netwerkcontact",
        "intern_overleg",
        "voorbereiding_uitwerking",
        "registratie_administratie"
      ]
    },
    "registratievorm": {
      "type": "string",
      "enum": [
        "op_naam",
        "anoniem",
        "groep_activiteit",
        "niet_van_toepassing"
      ]
    },
    "plaats_type": {
      "type": "string",
      "enum": [
        "woonplaats_inwoner",
        "kern_inwoner",
        "kern_activiteit",
        "locatie_activiteit"
      ]
    },
    "plaats_naam": {
      "type": "string",
      "minLength": 1,
      "maxLength": 120
    },
    "eerste_contact_sociom": {
      "type": "string",
      "enum": [
        "ja",
        "nee",
        "onbekend"
      ]
    },
    "hoofdthema": {
      "type": "string",
      "enum": [
        "opgroeien_ontwikkeling",
        "mentale_gezondheid",
        "financien",
        "wonen",
        "werk_dagbesteding",
        "veiligheid",
        "relaties_gezin",
        "participatie_sociaal_netwerk",
        "overig"
      ]
    },
    "aard_inzet": {
      "type": "string",
      "enum": [
        "direct_contact",
        "indirect_werk",
        "groepsgericht_werk",
        "signalering",
        "afstemming_ketenpartner"
      ]
    },
    "opbrengst_vervolgstatus": {
      "type": "string",
      "enum": [
        "informatie_advies_gegeven",
        "vraag_verhelderd",
        "doorverwijzing_gedaan",
        "vervolgafspraak_gepland",
        "traject_lopend",
        "afgesloten",
        "geen_vervolg"
      ]
    },
    "toelichting_gespreksverslag": {
      "type": "string",
      "maxLength": 2000
    }
  },
  "allOf": [
    {
      "if": {
        "properties": {
          "registratievorm": {
            "const": "anoniem"
          }
        },
        "required": [
          "registratievorm"
        ]
      },
      "then": {
        "required": [
          "eerste_contact_sociom"
        ]
      },
      "else": {
        "not": {
          "required": [
            "eerste_contact_sociom"
          ]
        }
      }
    },
    {
      "if": {
        "properties": {
          "werksoort": {
            "enum": [
              "individueel_contact",
              "anoniem_contact",
              "trajectcontact"
            ]
          }
        },
        "required": [
          "werksoort"
        ]
      },
      "then": {
        "properties": {
          "plaats_type": {
            "enum": [
              "woonplaats_inwoner",
              "kern_inwoner"
            ]
          }
        }
      }
    },
    {
      "if": {
        "properties": {
          "werksoort": {
            "const": "groepscontact_activiteit"
          }
        },
        "required": [
          "werksoort"
        ]
      },
      "then": {
        "properties": {
          "plaats_type": {
            "enum": [
              "kern_activiteit",
              "locatie_activiteit"
            ]
          }
        }
      }
    }
  ]
}
```

---

## 4) Tabel voor functioneel ontwerp (schermvelden)

| # | Schermveld | Dataveld | Type | Keuzelijst | Conditioneel | Validatie |
|---:|---|---|---|---|---|---|
| 1 | Werksoort | `werksoort` | Enum | 9 werksoorten | Nee | Verplicht |
| 2 | Registratievorm | `registratievorm` | Enum | op naam / anoniem / groep-activiteit / n.v.t. | Nee | Verplicht |
| 3 | Plaats | `plaats_type` + `plaats_naam` | Enum + String | Dynamisch per context | Ja (inhoud dynamisch) | Verplicht, consistente combinatie |
| 4 | Eerste contact met Sociom | `eerste_contact_sociom` | Enum | ja / nee / onbekend | Ja, alleen bij anoniem | Verplicht bij anoniem |
| 5 | Hoofdthema | `hoofdthema` | Enum | Referentielijst hoofdthema | Nee | Verplicht |
| 6 | Aard van de inzet | `aard_inzet` | Enum | Direct / indirect / groepsgericht etc. | Nee | Verplicht |
| 7 | Opbrengst / vervolgstatus | `opbrengst_vervolgstatus` | Enum | Referentielijst opbrengst | Nee | Verplicht |
| 8 | Toelichting / gespreksverslag | `toelichting_gespreksverslag` | Tekst | Vrij | Nee | Max 2000 tekens |

---

## 5) Rapportages (voorbeeld voor gemeente en management)

## 5.1 Gemeente-dashboard (operationeel + beleidsmatig)

1. **Aantal werkmomenten per soort**
   - Definitie: `count(*)` gegroepeerd op `werksoort` per maand/gemeente.
2. **Aantal contacten op naam**
   - Filter: `registratievorm = op_naam`.
3. **Aantal anonieme contacten**
   - Filter: `registratievorm = anoniem`.
4. **Aantal anonieme eerste contacten**
   - Filter: `registratievorm = anoniem AND eerste_contact_sociom = ja`.
5. **Spreiding per kern**
   - Groepering op `plaats_naam` waar `plaats_type` kern-waarden bevat.
6. **Hoofdthema’s per kern**
   - Kruistabel: `plaats_naam x hoofdthema` met aantallen.
7. **Aard van inzet per thema**
   - Kruistabel: `hoofdthema x aard_inzet`.
8. **Opbrengsten per werksoort**
   - Kruistabel: `werksoort x opbrengst_vervolgstatus`.
9. **Verhouding direct, indirect, groepsgericht werk**
   - Mapping op `aard_inzet` naar 3 hoofdgroepen + percentage.

### Visualisatievoorstellen gemeente
- Staafdiagram werksoorten (maand + cumulatief YTD)
- Kaart/heatmap kernspreiding
- Matrix hoofdthema per kern
- Donut direct/indirect/groepsgericht

## 5.2 Managementrapportage (sturing en capaciteit)

1. **Trend werksoorten (12 maanden)**
   - Signaleert verschuiving van direct contact naar indirect werk.
2. **Anoniem aandeel + eerste contact ratio**
   - KPI’s:
     - `% anoniem = anoniem / totaal`
     - `% eerste contact binnen anoniem = anoniem_eerste / anoniem`
3. **Opbrengstkwaliteit per werksoort**
   - Bijvoorbeeld aandeel `vervolgafspraak_gepland` en `afgesloten`.
4. **Thema-druk per kern**
   - Top 3 thema’s per kern met trend t.o.v. vorige periode.
5. **Inzetmix**
   - Verhouding direct/indirect/groepsgericht per dienst en totaal.

### Voorbeeld KPI-set management
- Totaal registraties per maand
- Gemiddeld aantal registraties per medewerker
- % direct contact
- % anoniem contact
- % anonieme eerste contacten
- Top 5 thema’s
- Doorverwijzingspercentage

---

## 6) Query-schetsen (optioneel, voor BI-team)

```sql
-- 1. Aantal werkmomenten per soort
SELECT werksoort, COUNT(*) AS aantal
FROM registratie
WHERE registratiedatum >= DATE_TRUNC('month', CURRENT_DATE)
GROUP BY werksoort;

-- 2. Aantal anonieme eerste contacten
SELECT COUNT(*) AS anonieme_eerste_contacten
FROM registratie
WHERE registratievorm = 'anoniem'
  AND eerste_contact_sociom = 'ja';

-- 3. Verhouding direct/indirect/groepsgericht
SELECT
  CASE
    WHEN aard_inzet IN ('direct_contact') THEN 'direct'
    WHEN aard_inzet IN ('groepsgericht_werk') THEN 'groepsgericht'
    ELSE 'indirect'
  END AS inzetgroep,
  COUNT(*) AS aantal
FROM registratie
GROUP BY inzetgroep;
```
