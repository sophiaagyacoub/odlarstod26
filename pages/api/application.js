// pages/api/application.js
// Genererar ansökningsutkast för ett specifikt bidrag

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { profile, bidrag } = req.body

  if (!profile || !bidrag) {
    return res.status(400).json({ error: 'Profil eller bidrag saknas' })
  }

  const prompt = `Du är en expert på att skriva bidragsansökningar för svenska lantbrukare.

Skriv ett professionellt ansökningsutkast för följande bidrag:

BIDRAG: ${bidrag.namn}
UTLYSARE: ${bidrag.utlysare}
BESKRIVNING: ${bidrag.beskrivning}

SÖKANDENS PROFIL:
- Namn: ${profile.name}
- Gård: ${profile.farm}
- Plats: ${profile.municipality}, ${profile.county}
- Areal: ${profile.area} hektar
- Organisationsform: ${profile.orgType}
- Produktion: ${profile.production?.join(', ') || 'ej angiven'}
- Försäljningskanaler: ${profile.salesChannels?.join(', ') || 'ej angivna'}
- Omsättning: ${profile.turnover}
- Hållbarhetsmetoder: ${profile.sustainabilityMethods?.join(', ') || 'inga angivna'}
- Hållbarhetsmål: ${profile.sustainabilityGoal || 'ej angivet'}
- Utmaningar: ${profile.challenges?.join(', ') || 'ej angivna'}

Skriv ansökningsutkastet med följande delar:
1. **Sökande** – namn, gård, plats, organisationsform
2. **Verksamhetsbeskrivning** – vad gården producerar och hur den säljer
3. **Projektbeskrivning / Syfte** – varför de söker detta stöd och vad de planerar att göra
4. **Hållbarhetsmål** – konkreta mål kopplade till deras hållbarhetsarbete
5. **Förväntat resultat** – vad bidraget ska leda till
6. **Bilagor att bifoga** – lista över dokument som vanligtvis behövs för denna typ av ansökan

Skriv på svenska. Var konkret och professionell. Använd gårdens faktiska uppgifter genomgående.
Markera med [FYLL I] på ställen där sökanden behöver lägga till specifik information som belopp, datum etc.`

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
        max_tokens: 2000,
        system: 'Du är en expert på svenska bidragsansökningar för lantbrukare. Skriv alltid på svenska och var konkret och professionell.',
        messages: [{ role: 'user', content: prompt }],
      }),
    })

    if (!response.ok) {
      const error = await response.json()
      console.error('Anthropic API error:', error)
      return res.status(500).json({ error: 'Kunde inte generera ansökan' })
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
