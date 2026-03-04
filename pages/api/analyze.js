// pages/api/analyze.js
// Den här filen körs på servern – API-nyckeln syns aldrig för användaren

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { profile } = req.body

  if (!profile) {
    return res.status(400).json({ error: 'Profil saknas' })
  }

  const prompt = `Du är en expert på svenska och europeiska bidrag och stöd för hållbara småskaliga matproducenter med fokus på biologisk mångfald och självförsörjning.

Sök på webben efter aktuella bidragsutlysningar som är öppna just nu från Jordbruksverket, Leader, Länsstyrelsen, Tillväxtverket och EU:s CAP-program.

Här är profilen för en producent som söker hjälp:
- Namn: ${profile.name}, Gård: ${profile.farm}
- Plats: ${profile.municipality}, ${profile.county}
- Areal: ${profile.area}
- Organisationsform: ${profile.orgType}
- Produktion: ${profile.production?.join(', ') || 'ej angiven'}
- Försäljningskanaler: ${profile.salesChannels?.join(', ') || 'ej angivna'}
- Omsättning: ${profile.turnover}
- Hållbarhetsmetoder: ${profile.sustainabilityMethods?.join(', ') || 'inga angivna'}
- Hållbarhetsmål: ${profile.sustainabilityGoal || 'ej angivet'}
- Utmaningar: ${profile.challenges?.join(', ') || 'ej angivna'}

Baserat på webbsökningen och profilen, ge:
1. En kort personlig inledning (2 meningar) som visar att du förstår deras situation
2. De 4-5 mest relevanta och aktuella bidrag och stöd specifikt matchade mot profilen
3. För varje bidrag: namn, vem som utlyser det, belopp/storlek, kort beskrivning, länk till utlysningen, var man ansöker, ansökningsdeadline om känd, varför det passar denna producent
4. 3 konkreta nästa steg de bör ta

Svara på svenska. Var specifik och praktisk. Prioritera bidrag som är öppna för ansökan just nu.`

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 2000,
        system: 'Du är Odlarstöd.se – en kunnig och varm bidragsrådgivare för hållbara svenska matproducenter. Använd alltid webbsökning för att hitta aktuella utlysningar. Svara alltid på svenska.',
        tools: [
          {
            type: 'web_search_20250305',
            name: 'web_search',
          }
        ],
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

    return res.status(200).json({ result: text })
  } catch (err) {
    console.error('Server error:', err)
    return res.status(500).json({ error: 'Serverfel, försök igen' })
  }
}
