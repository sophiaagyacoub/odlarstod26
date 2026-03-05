// pages/api/analyze.js
// Statisk bidragsdatabas + Claude Haiku för analys = billigt och tillförlitligt

const BIDRAG = [
  // ─── EU / CAP-stöd via Jordbruksverket ───
  {
    id: 'gardsstod',
    namn: 'Gårdsstöd',
    utlysare: 'Jordbruksverket (EU/CAP)',
    belopp: 'ca 134–147 euro/hektar (2025)',
    deadline: '9 april 2026',
    ansokan: 'SAM Internet (jordbruksverket.se/sam)',
    lank: 'https://jordbruksverket.se/stod/jordbruk-tradgard-och-rennaring/jordbruksmark/gardsstod',
    beskrivning: 'Arealstöd för dig som brukar jordbruksmark. Bidrar till ökad konkurrenskraft och öppet landskap.',
    taggar: ['åkermark', 'betesmark', 'alla', 'EU'],
  },
  {
    id: 'ekostod',
    namn: 'Ersättning för ekologisk produktion',
    utlysare: 'Jordbruksverket (EU/CAP)',
    belopp: 'ca 1 000–3 600 kr/hektar beroende på produktion',
    deadline: '9 april 2026',
    ansokan: 'SAM Internet (jordbruksverket.se/sam)',
    lank: 'https://jordbruksverket.se/stod/jordbruk-tradgard-och-rennaring/miljoersattningar-ersattningar-och-kompensationsstod/ekologisk-produktion',
    beskrivning: 'Ersättning för certifierad ekologisk växtodling eller djurhållning, samt vid omställning till ekologisk produktion.',
    taggar: ['ekologisk', 'hållbarhet', 'miljö', 'EU'],
  },
  {
    id: 'blommande_aker',
    namn: 'Miljöersättning för blommande åker och fältkant',
    utlysare: 'Jordbruksverket (EU/CAP)',
    belopp: 'Varierar per region (3 geografiska zoner)',
    deadline: '9 april 2026',
    ansokan: 'SAM Internet (jordbruksverket.se/sam)',
    lank: 'https://jordbruksverket.se/stod/jordbruk-tradgard-och-rennaring/miljoersattningar-ersattningar-och-kompensationsstod/blommande-aker',
    beskrivning: 'Ersättning för att odla pollen- och nektarrika örter på åkermark. Minst 3 godkända arter krävs.',
    taggar: ['pollinerare', 'biologisk mångfald', 'hållbarhet', 'blommor', 'insekter', 'EU'],
  },
  {
    id: 'betesmarker',
    namn: 'Miljöersättning för betesmarker och slåtterängar',
    utlysare: 'Jordbruksverket (EU/CAP)',
    belopp: 'ca 1 000–4 500 kr/hektar',
    deadline: '9 april 2026',
    ansokan: 'SAM Internet (jordbruksverket.se/sam)',
    lank: 'https://jordbruksverket.se/stod/jordbruk-tradgard-och-rennaring/miljoersattningar-ersattningar-och-kompensationsstod/betesmarker-och-slatterangar',
    beskrivning: 'Ersättning för skötsel av betesmarker och slåtterängar med höga naturvärden.',
    taggar: ['betesmark', 'biologisk mångfald', 'natur', 'djur', 'EU'],
  },
  {
    id: 'minskat_kvave',
    namn: 'Miljöersättning för minskat kväveläckage',
    utlysare: 'Jordbruksverket (EU/CAP)',
    belopp: 'ca 1 400 kr/hektar',
    deadline: '9 april 2026',
    ansokan: 'SAM Internet (jordbruksverket.se/sam)',
    lank: 'https://jordbruksverket.se/stod/jordbruk-tradgard-och-rennaring/miljoersattningar-ersattningar-och-kompensationsstod/minskat-kvaveutlakage',
    beskrivning: 'Ersättning för att odla fånggrödor eller mellangrödor för att minska kväveläckage till vattendrag.',
    taggar: ['miljö', 'vatten', 'hållbarhet', 'klimat', 'EU'],
  },
  {
    id: 'vaatmarker',
    namn: 'Stöd för anläggning av våtmarker',
    utlysare: 'Jordbruksverket / Länsstyrelsen (EU/CAP)',
    belopp: 'upp till 90% av anläggningskostnaden',
    deadline: 'Löpande ansökan via Länsstyrelsen',
    ansokan: 'Ansökan via din Länsstyrelse',
    lank: 'https://jordbruksverket.se/stod/jordbruk-tradgard-och-rennaring/natur-och-kulturmiljoatgarder/anlaggning-av-vatmark',
    beskrivning: 'Stöd för att anlägga våtmarker som gynnar biologisk mångfald, minskar kväveläckage och ökar vattenhållning.',
    taggar: ['biologisk mångfald', 'vatten', 'miljö', 'hållbarhet', 'natur', 'EU'],
  },
  {
    id: 'investeringsstod',
    namn: 'Investeringsstöd för ökad konkurrenskraft',
    utlysare: 'Jordbruksverket / Länsstyrelsen (EU/CAP)',
    belopp: '30–40% av godkända utgifter (min. 200 000 kr i utgifter)',
    deadline: 'Löpande ansökan, handläggningstid ca 5 månader',
    ansokan: 'Ansökan via din Länsstyrelse',
    lank: 'https://jordbruksverket.se/stod/jordbruk-tradgard-och-rennaring/investeringsstod-for-jordbruk-tradgard-och-rennaring/okad-konkurrenskraft',
    beskrivning: 'Stöd för investeringar i djurstall, växthus, energiskog, täckdikning m.m.',
    taggar: ['investering', 'byggnad', 'infrastruktur', 'djur', 'trädgård', 'EU'],
  },
  {
    id: 'ung_jordbrukare',
    namn: 'Stöd till unga jordbrukare',
    utlysare: 'Jordbruksverket (EU/CAP)',
    belopp: 'Extra arealstöd + 40% vid investeringsstöd',
    deadline: '9 april 2026',
    ansokan: 'SAM Internet (jordbruksverket.se/sam)',
    lank: 'https://jordbruksverket.se/stod/jordbruk-tradgard-och-rennaring/stod-till-unga-jordbrukare',
    beskrivning: 'För dig som är 40 år eller yngre och startat jordbruksföretag för första gången.',
    taggar: ['ung', 'nystart', 'EU'],
  },
  {
    id: 'kompensationsstod',
    namn: 'Kompensationsstöd för mindre gynnade områden',
    utlysare: 'Jordbruksverket (EU/CAP)',
    belopp: 'ca 600–1 400 kr/hektar',
    deadline: '9 april 2026',
    ansokan: 'SAM Internet (jordbruksverket.se/sam)',
    lank: 'https://jordbruksverket.se/stod/jordbruk-tradgard-och-rennaring/miljoersattningar-ersattningar-och-kompensationsstod/kompensationsstod',
    beskrivning: 'Kompensation för sämre naturliga förutsättningar i bergs- och mellanbygd.',
    taggar: ['mellanbygd', 'bergsbygd', 'norrland', 'EU'],
  },

  // ─── Nationella stöd ───
  {
    id: 'klimatklivet',
    namn: 'Klimatklivet',
    utlysare: 'Naturvårdsverket (nationellt)',
    belopp: 'upp till 70% av investeringskostnaden',
    deadline: 'Löpande utlysningar, se naturvardsverket.se',
    ansokan: 'naturvardsverket.se/klimatklivet',
    lank: 'https://www.naturvardsverket.se/klimatklivet',
    beskrivning: 'Stöd för investeringar som minskar utsläpp av växthusgaser, t.ex. biogasanläggning, solceller, laddinfrastruktur.',
    taggar: ['klimat', 'energi', 'solceller', 'biogas', 'hållbarhet', 'nationell'],
  },
  {
    id: 'lbx_foradling',
    namn: 'Investeringsstöd för förädling och försäljning',
    utlysare: 'Jordbruksverket / Länsstyrelsen (nationellt)',
    belopp: '30–40% av godkända kostnader',
    deadline: 'Löpande ansökan via Länsstyrelsen',
    ansokan: 'Ansökan via din Länsstyrelse',
    lank: 'https://jordbruksverket.se/stod/jordbruk-tradgard-och-rennaring/investeringsstod-for-jordbruk-tradgard-och-rennaring/foradling-och-forsaljning',
    beskrivning: 'Stöd för investeringar i lokaler och utrustning för att förädla och sälja jordbruksprodukter.',
    taggar: ['förädling', 'försäljning', 'gårdsbutik', 'investering', 'nationell'],
  },

  // ─── Leader / EJFLU ───
  {
    id: 'leader',
    namn: 'Leader – lokalt ledd utveckling',
    utlysare: 'Leader LAG-grupper (EU/nationellt)',
    belopp: 'Varierar, ofta 50 000–500 000 kr per projekt',
    deadline: 'Varierar per LAG-grupp, kontakta din lokala Leader-grupp',
    ansokan: 'Via din lokala Leader LAG-grupp (leadersverige.se)',
    lank: 'https://leadersverige.se',
    beskrivning: 'Finansiering för lokala utvecklingsprojekt på landsbygden. Brett tillämpningsområde – innovation, samarbete, miljö, turism.',
    taggar: ['projekt', 'landsbygd', 'samarbete', 'innovation', 'EU', 'nationell'],
  },
  {
    id: 'eip_agri',
    namn: 'EIP-Agri – Europeiskt innovationspartnerskap',
    utlysare: 'Jordbruksverket / Länsstyrelsen (EU)',
    belopp: 'upp till 70% av projektkostnader',
    deadline: 'Löpande utlysningar via Jordbruksverket',
    ansokan: 'jordbruksverket.se/eip',
    lank: 'https://jordbruksverket.se/stod/landsbygd-och-miljo/eip-agri',
    beskrivning: 'Stöd för innovativa samarbetsprojekt mellan lantbrukare, forskare och rådgivare.',
    taggar: ['innovation', 'forskning', 'samarbete', 'hållbarhet', 'EU'],
  },

  // ─── Tillväxtverket ───
  {
    id: 'regionalt_bidrag',
    namn: 'Regionalt investeringsbidrag',
    utlysare: 'Tillväxtverket (nationellt)',
    belopp: 'upp till 35% av investeringskostnaden',
    deadline: 'Löpande ansökan',
    ansokan: 'verksamt.se eller tillvaxtverket.se',
    lank: 'https://www.tillvaxtverket.se/svenska/finansiering.html',
    beskrivning: 'Bidrag för företag i stödområden som investerar och skapar sysselsättning.',
    taggar: ['investering', 'företag', 'landsbygd', 'sysselsättning', 'nationell'],
  },
  {
    id: 'livsmedelsstrategin',
    namn: 'Livsmedelsstrategi – korta livsmedelskedjor',
    utlysare: 'Jordbruksverket / Länsstyrelsen (nationellt)',
    belopp: 'Varierar per utlysning',
    deadline: 'Se jordbruksverket.se för aktuella utlysningar',
    ansokan: 'Via Länsstyrelsen',
    lank: 'https://jordbruksverket.se/stod/landsbygd-och-miljo/livsmedelsstrategin',
    beskrivning: 'Stöd för projekt som stärker lokala livsmedelskedjor, direktförsäljning och samarbeten.',
    taggar: ['livsmedel', 'lokal', 'REKO-ring', 'gårdsbutik', 'bondens marknad', 'direktförsäljning', 'nationell'],
  },
  {
    id: 'biodling',
    namn: 'Stöd till biodling',
    utlysare: 'Jordbruksverket (EU/nationellt)',
    belopp: 'Varierar per åtgärd',
    deadline: 'Se jordbruksverket.se',
    ansokan: 'SAM Internet (jordbruksverket.se/sam)',
    lank: 'https://jordbruksverket.se/stod/jordbruk-tradgard-och-rennaring/biodling',
    beskrivning: 'Stöd för bin och biodling, inkl. stöd för att bekämpa varroa och för utbildning.',
    taggar: ['biodling', 'honung', 'pollinerare', 'bin', 'EU'],
  },
]

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { profile } = req.body

  if (!profile) {
    return res.status(400).json({ error: 'Profil saknas' })
  }

  // Bygg en sökbar text från profilen
  const profilText = [
    profile.production?.join(' ') || '',
    profile.sustainabilityMethods?.join(' ') || '',
    profile.sustainabilityGoal || '',
    profile.challenges?.join(' ') || '',
    profile.salesChannels?.join(' ') || '',
    profile.county || '',
    profile.orgType || '',
  ].join(' ').toLowerCase()

  // Poängsätt varje bidrag mot profilen
  const rankadeBidrag = BIDRAG.map((b) => {
    let poang = 0
    b.taggar.forEach((tag) => {
      if (profilText.includes(tag.toLowerCase())) poang += 2
    })
    // Alla får minst 1 poäng (generella stöd visas alltid)
    if (['gardsstod', 'leader', 'ekostod'].includes(b.id)) poang += 1
    return { ...b, poang }
  })
    .sort((a, b) => b.poang - a.poang)
    .slice(0, 6)

  const bidragJson = JSON.stringify(rankadeBidrag, null, 2)

  const prompt = `Du är en varm och kunnig bidragsrådgivare på Odlarstöd.se.

Här är profilen för en producent:
- Namn: ${profile.name}, Gård: ${profile.farm}
- Plats: ${profile.municipality}, ${profile.county}
- Areal: ${profile.area} hektar
- Organisationsform: ${profile.orgType}
- Produktion: ${profile.production?.join(', ') || 'ej angiven'}
- Försäljningskanaler: ${profile.salesChannels?.join(', ') || 'ej angivna'}
- Omsättning: ${profile.turnover}
- Hållbarhetsmetoder: ${profile.sustainabilityMethods?.join(', ') || 'inga angivna'}
- Hållbarhetsmål: ${profile.sustainabilityGoal || 'ej angivet'}
- Utmaningar: ${profile.challenges?.join(', ') || 'ej angivna'}

Här är de mest relevanta bidragen för denna producent:
${bidragJson}

Skriv en personlig och uppmuntrande bidragsanalys på svenska med:
1. En kort personlig inledning (2 meningar) som visar att du förstår deras situation
2. För varje bidrag: förklara varför det passar just denna producent, nämn utlysaren, beloppet, ansökningsdeadline och länken
3. Avsluta med 3 konkreta nästa steg

Var specifik, varm och praktisk. Formatera tydligt med rubriker för varje bidrag.`

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-haiku-4-5-20251001',
        max_tokens: 1500,
        system: 'Du är Odlarstöd.se – en kunnig och varm bidragsrådgivare för hållbara svenska matproducenter. Svara alltid på svenska.',
        messages: [{ role: 'user', content: prompt }],
      }),
    })

    if (!response.ok) {
      const error = await response.json()
      console.error('Anthropic API error:', error)
      return res.status(500).json({ error: 'Kunde inte kontakta AI-tjänsten' })
    }

    const data = await response.json()
    const text = data.content
      ?.filter((b) => b.type === 'text')
      .map((b) => b.text || '')
      .join('') || ''

    return res.status(200).json({ result: text, topBidrag: rankadeBidrag.slice(0, 3) })
  } catch (err) {
    console.error('Server error:', err)
    return res.status(500).json({ error: 'Serverfel, försök igen' })
  }
}
