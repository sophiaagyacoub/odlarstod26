import Head from 'next/head'
import { useState } from 'react'
import styles from '../styles/Home.module.css'

const COUNTIES = [
  'Blekinge','Dalarna','Gotland','Gävleborg','Halland','Jämtland',
  'Jönköping','Kalmar','Kronoberg','Norrbotten','Skåne','Stockholm',
  'Södermanland','Uppsala','Värmland','Västerbotten','Västernorrland',
  'Västmanland','Västra Götaland','Örebro','Östergötland'
]

const PRODUCTION_TYPES = [
  { value: 'vegetables', label: '🥦 Grönsaker & rotfrukter' },
  { value: 'grains', label: '🌾 Spannmål & baljväxter' },
  { value: 'fruits', label: '🍎 Frukt & bär' },
  { value: 'dairy', label: '🥛 Mjölk & mejeri' },
  { value: 'meat', label: '🐄 Kött & ägg' },
  { value: 'herbs', label: '🌿 Örter & medicinalväxter' },
  { value: 'honey', label: '🍯 Honung & biodling' },
  { value: 'forest', label: '🍄 Skogsprodukter & svamp' },
  { value: 'processed', label: '🫙 Förädlade produkter' },
  { value: 'aqua', label: '🐟 Fiske & vattenbruk' },
]

const SALES_CHANNELS = [
  'Gårdsbutik','REKO-ring','Bondens marknad','Restauranger',
  'Dagligvaruhandel','Grossist','Direktleverans CSA','E-handel','Ännu ej försäljning'
]

const SUSTAINABILITY_METHODS = [
  { value: 'organic', label: '🌿 KRAV/ekologisk certifiering' },
  { value: 'biodynamic', label: '☽ Biodynamisk odling' },
  { value: 'permaculture', label: '🔄 Permakultur' },
  { value: 'agroforestry', label: '🌳 Skogsjordbruk / agroforestry' },
  { value: 'no-till', label: '🪱 Skonsam jordbearbetning' },
  { value: 'cover-crops', label: '🌱 Mellangrödor & fånggrödor' },
  { value: 'pollinators', label: '🐝 Pollinatorvänliga miljöer' },
  { value: 'water', label: '💧 Vattenhushållning' },
  { value: 'renewable', label: '☀️ Förnybar energi på gården' },
  { value: 'seeds', label: '🌾 Eget frö / gamla sorter' },
]

const CHALLENGES = [
  'Finansiering','Kunskap & kompetens','Markåtkomst','Byråkrati & administration',
  'Marknad & avsättning','Klimat & väder','Arbetsinsats','Maskiner & utrustning'
]

export default function Home() {
  const [screen, setScreen] = useState(1)
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState('')
  const [copied, setCopied] = useState(false)
  const [topBidrag, setTopBidrag] = useState([])
  const [selectedBidrag, setSelectedBidrag] = useState(null)
  const [application, setApplication] = useState('')
  const [appLoading, setAppLoading] = useState(false)
  const [appCopied, setAppCopied] = useState(false)

  // Form state
  const [name, setName] = useState('')
  const [farm, setFarm] = useState('')
  const [municipality, setMunicipality] = useState('')
  const [county, setCounty] = useState('')
  const [area, setArea] = useState(5)
  const [orgType, setOrgType] = useState('')
  const [production, setProduction] = useState([])
  const [salesChannels, setSalesChannels] = useState([])
  const [turnover, setTurnover] = useState('')
  const [sustainabilityMethods, setSustainabilityMethods] = useState([])
  const [sustainabilityGoal, setSustainabilityGoal] = useState('')
  const [challenges, setChallenges] = useState([])

  function toggleArr(arr, setArr, val) {
    setArr(arr.includes(val) ? arr.filter(v => v !== val) : [...arr, val])
  }

  async function runAnalysis() {
    setScreen(4)
    setLoading(true)
    setResult('')
    window.scrollTo({ top: 0, behavior: 'smooth' })

    try {
      const res = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          profile: {
            name: name || 'Producent',
            farm: farm || 'Din gård',
            municipality: municipality || 'okänd kommun',
            county: county || 'okänt län',
            area: area + ' ha',
            orgType: orgType || 'ej angiven',
            production,
            salesChannels,
            turnover: turnover || 'ej angiven',
            sustainabilityMethods,
            sustainabilityGoal,
            challenges,
          }
        })
      })
      const data = await res.json()
      setTopBidrag(data.bidrag || [])
      setResult(data.sammanfattning || data.error || '')
    } catch {
      setResult('Något gick fel. Kontrollera din internetanslutning och försök igen.')
    } finally {
      setLoading(false)
    }
  }

  function reset() {
    setScreen(1); setResult(''); setName(''); setFarm(''); setMunicipality('')
    setCounty(''); setArea(5); setOrgType(''); setProduction([]); setSalesChannels([])
    setTurnover(''); setSustainabilityMethods([]); setSustainabilityGoal(''); setChallenges([])
    setTopBidrag([]); setSelectedBidrag(null); setApplication(''); setAppLoading(false)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  function activateTestMode() {
    setName('Anna Lindgren')
    setFarm('Humlebo Gård')
    setMunicipality('Lindkvists Skogsby')
    setCounty('Västra Götaland')
    setArea(5)
    setOrgType('Enskild firma')
    setProduction(['vegetables', 'honey', 'herbs'])
    setSalesChannels(['REKO-ring', 'Gårdsbutik'])
    setTurnover('100 000 – 500 000 kr')
    setSustainabilityMethods(['organic', 'pollinators', 'cover-crops'])
    setSustainabilityGoal('Vi vill anlägga blomsterremsor längs alla åkerkanter för att gynna pollinerare och minska bekämpningsmedel.')
    setChallenges(['Finansiering', 'Byråkrati & administration'])
    const mockBidrag = [
      { id: 'blommande_aker', namn: 'Miljöersättning för blommande åker och fältkant', utlysare: 'Jordbruksverket (EU/CAP)', belopp: 'Varierar per region', deadline: '9 april 2026', ansokan: 'SAM Internet', lank: 'https://jordbruksverket.se', beskrivning: 'Ersättning för att odla pollen- och nektarrika örter.' },
      { id: 'ekostod', namn: 'Ersättning för ekologisk produktion', utlysare: 'Jordbruksverket (EU/CAP)', belopp: 'ca 1 000–3 600 kr/hektar', deadline: '9 april 2026', ansokan: 'SAM Internet', lank: 'https://jordbruksverket.se', beskrivning: 'Ersättning för certifierad ekologisk produktion.' },
      { id: 'leader', namn: 'Leader – lokalt ledd utveckling', utlysare: 'Leader LAG-grupper', belopp: '50 000–500 000 kr', deadline: 'Varierar', ansokan: 'leadersverige.se', lank: 'https://leadersverige.se', beskrivning: 'Lokala utvecklingsprojekt på landsbygden.' },
    ]
    setTopBidrag(mockBidrag)
    setResult('Vi hittade 3 bidrag som matchar din profil.')
    setScreen(4)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  async function generateApplication(bidrag) {
    setSelectedBidrag(bidrag)
    setApplication('')
    setScreen(5)
    setAppLoading(true)
    window.scrollTo({ top: 0, behavior: 'smooth' })
    try {
      const res = await fetch('/api/application', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          profile: {
            name: name || 'Producent',
            farm: farm || 'Din gård',
            municipality: municipality || 'okänd kommun',
            county: county || 'okänt län',
            area: area + ' ha',
            orgType: orgType || 'ej angiven',
            production,
            salesChannels,
            turnover: turnover || 'ej angiven',
            sustainabilityMethods,
            sustainabilityGoal,
            challenges,
          },
          bidrag,
        })
      })
      const data = await res.json()
      setApplication(data.result || data.error || 'Kunde inte generera ansökan.')
    } catch {
      setApplication('Något gick fel. Försök igen.')
    } finally {
      setAppLoading(false)
    }
  }

  function downloadDocx() {
    const text = application
    const blob = new Blob([text], { type: 'text/plain;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `ansökan-${selectedBidrag?.namn?.replace(/\s+/g, '-') || 'bidrag'}.txt`
    a.click()
    URL.revokeObjectURL(url)
  }

  function copyResult() {
    navigator.clipboard.writeText(result).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  function formatResult(text) {
    return text
      .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
      .replace(/^#{1,3} (.+)$/gm, '<h3 class="aiH3">$1</h3>')
      .split('\n\n')
      .map(p => p.trim())
      .filter(Boolean)
      .map(p => p.startsWith('<h3') ? p : `<p>${p.replace(/\n/g, '<br/>')}</p>`)
      .join('')
  }

  return (
    <>
      <Head>
        <title>Odlarstöd.se – Bidragsagent för hållbara matproducenter</title>
        <meta name="description" content="Hitta rätt bidrag och stöd för din hållbara matproduktion i Sverige. AI-driven analys matchad till din gård." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className={styles.page}>
        {/* GRAIN TEXTURE */}
        <div className={styles.grain} />

        <div className={styles.container}>
          {/* HEADER */}
          <header className={styles.header}>
            <div className={styles.logoArea}>
              <span className={styles.logoIcon}>🌾</span>
              <span className={styles.logoText}>Odlarstöd.se</span>
            </div>
            <div className={styles.logoSub}>Bidragsagent för hållbara matproducenter</div>
            <div className={styles.tagline}>Stärker den biologiska mångfalden och Sveriges självförsörjning</div>
          </header>

          {/* STEPS BAR */}
          <div className={styles.stepsBar}>
            {['01 Profil', '02 Verksamhet', '03 Hållbarhet', '04 Bidrag'].map((label, i) => (
              <div
                key={i}
                className={[
                  styles.stepItem,
                  screen === i + 1 ? styles.stepActive : '',
                  screen > i + 1 ? styles.stepDone : ''
                ].join(' ')}
              >
                {label}
              </div>
            ))}
          </div>

          {/* ── SCREEN 1: PROFIL ── */}
          {screen === 1 && (
            <div className={styles.screen}>
              <h2 className={styles.sectionTitle}>Berätta om dig och din gård</h2>
              <p className={styles.sectionDesc}>Vi börjar med grundläggande information för att hitta rätt bidrag för dig.</p>

              <div className={styles.card}>
                <div className={styles.fieldRow}>
                  <Field label="Ditt namn">
                    <input className={styles.input} value={name} onChange={e => setName(e.target.value)} placeholder="Anna Lindgren" />
                  </Field>
                  <Field label="Gård / Företagsnamn">
                    <input className={styles.input} value={farm} onChange={e => setFarm(e.target.value)} placeholder="Lindgrens Ekogård" />
                  </Field>
                </div>
                <div className={styles.fieldRow}>
                  <Field label="Kommun">
                    <input className={styles.input} value={municipality} onChange={e => setMunicipality(e.target.value)} placeholder="t.ex. Östersund" />
                  </Field>
                  <Field label="Län">
                    <select className={styles.input} value={county} onChange={e => setCounty(e.target.value)}>
                      <option value="">Välj län...</option>
                      {COUNTIES.map(c => <option key={c}>{c}</option>)}
                    </select>
                  </Field>
                </div>
                <div className={styles.fieldGroup}>
                  <label className={styles.label}>Gårdens areal (hektar)</label>
                  <div className={styles.rangeValue}>{area} ha</div>
                  <input type="range" className={styles.range} min="0.5" max="200" step="0.5"
                    value={area} onChange={e => setArea(Number(e.target.value))} />
                  <div className={styles.rangeLabels}><span>0.5 ha</span><span>50 ha</span><span>200+ ha</span></div>
                </div>
                <Field label="Organisationsform">
                  <select className={styles.input} value={orgType} onChange={e => setOrgType(e.target.value)}>
                    <option value="">Välj form...</option>
                    {['Enskild firma','Handelsbolag','Aktiebolag','Ekonomisk förening','Ideell förening','Stiftelse','Ännu ej registrerat – under uppstart'].map(o => <option key={o}>{o}</option>)}
                  </select>
                </Field>
              </div>

              <BtnRow right={<button className={styles.btnPrimary} onClick={() => { setScreen(2); window.scrollTo({top:0,behavior:'smooth'}) }}>Nästa steg →</button>} />
            </div>
          )}

          {/* ── SCREEN 2: VERKSAMHET ── */}
          {screen === 2 && (
            <div className={styles.screen}>
              <h2 className={styles.sectionTitle}>Vad producerar du?</h2>
              <p className={styles.sectionDesc}>Välj de produktionskategorier som stämmer för din verksamhet (flera val möjliga).</p>

              <div className={styles.card}>
                <label className={styles.label}>Produktionskategorier</label>
                <div className={styles.checkGrid}>
                  {PRODUCTION_TYPES.map(({ value, label }) => (
                    <CheckItem key={value} label={label} checked={production.includes(value)}
                      onChange={() => toggleArr(production, setProduction, value)} />
                  ))}
                </div>
              </div>

              <div className={styles.card}>
                <div className={styles.fieldGroup}>
                  <label className={styles.label}>Nuvarande försäljningskanaler</label>
                  <div className={styles.tags}>
                    {SALES_CHANNELS.map(ch => (
                      <button key={ch}
                        className={[styles.tag, salesChannels.includes(ch) ? styles.tagActive : ''].join(' ')}
                        onClick={() => toggleArr(salesChannels, setSalesChannels, ch)}>{ch}</button>
                    ))}
                  </div>
                </div>
                <Field label="Ungefärlig årsomsättning (SEK)">
                  <select className={styles.input} value={turnover} onChange={e => setTurnover(e.target.value)}>
                    <option value="">Välj intervall...</option>
                    <option value="0">0 – under uppstart</option>
                    <option value="under100k">Under 100 000 kr</option>
                    <option value="100-500k">100 000 – 500 000 kr</option>
                    <option value="500k-1m">500 000 – 1 000 000 kr</option>
                    <option value="1-5m">1 – 5 miljoner kr</option>
                    <option value="over5m">Över 5 miljoner kr</option>
                  </select>
                </Field>
              </div>

              <BtnRow
                left={<button className={styles.btnSecondary} onClick={() => { setScreen(1); window.scrollTo({top:0,behavior:'smooth'}) }}>← Tillbaka</button>}
                right={<button className={styles.btnPrimary} onClick={() => { setScreen(3); window.scrollTo({top:0,behavior:'smooth'}) }}>Nästa steg →</button>}
              />
            </div>
          )}

          {/* ── SCREEN 3: HÅLLBARHET ── */}
          {screen === 3 && (
            <div className={styles.screen}>
              <h2 className={styles.sectionTitle}>Din hållbarhetsprofil</h2>
              <p className={styles.sectionDesc}>Berätta om dina metoder och mål. Ju mer du delar, desto bättre matchning får du.</p>

              <div className={styles.card}>
                <label className={styles.label}>Nuvarande hållbarhetsmetoder (välj alla som gäller)</label>
                <div className={styles.checkGrid}>
                  {SUSTAINABILITY_METHODS.map(({ value, label }) => (
                    <CheckItem key={value} label={label} checked={sustainabilityMethods.includes(value)}
                      onChange={() => toggleArr(sustainabilityMethods, setSustainabilityMethods, value)} />
                  ))}
                </div>
              </div>

              <div className={styles.card}>
                <Field label="Beskriv ditt viktigaste hållbarhetsprojekt eller mål">
                  <textarea className={styles.textarea} value={sustainabilityGoal}
                    onChange={e => setSustainabilityGoal(e.target.value)}
                    placeholder="T.ex: Vi vill anlägga en blomsterremsa längs hela åkermarken för att gynna pollinerare..." />
                </Field>
                <div className={styles.fieldGroup}>
                  <label className={styles.label}>Vilka utmaningar möter du?</label>
                  <div className={styles.tags}>
                    {CHALLENGES.map(ch => (
                      <button key={ch}
                        className={[styles.tag, challenges.includes(ch) ? styles.tagActive : ''].join(' ')}
                        onClick={() => toggleArr(challenges, setChallenges, ch)}>{ch}</button>
                    ))}
                  </div>
                </div>
              </div>

              <BtnRow
                left={<button className={styles.btnSecondary} onClick={() => { setScreen(2); window.scrollTo({top:0,behavior:'smooth'}) }}>← Tillbaka</button>}
                right={<button className={styles.btnPrimary} onClick={runAnalysis}>Analysera bidrag →</button>}
              />
            </div>
          )}

          {/* ── SCREEN 4: RESULTAT ── */}
          {screen === 4 && (
            <div className={styles.screen}>
              <h2 className={styles.sectionTitle}>Dina bidragsmöjligheter</h2>
              <p className={styles.sectionDesc}>Baserat på din profil har vi matchat relevanta bidrag och stöd.</p>

              {loading && (
                <div className={styles.card} style={{ textAlign: 'center', padding: '48px' }}>
                  <div className={styles.loadingDots}>
                    <span /><span /><span />
                  </div>
                  <div style={{ marginTop: '16px', fontSize: '12px', opacity: 0.6 }}>
                    Söker igenom Jordbruksverket, Leader, Region & EU-fonder...
                  </div>
                </div>
              )}

              {!loading && topBidrag.length > 0 && (
                <>
                  <div style={{ fontSize: '12px', color: 'var(--moss)', marginBottom: '20px', fontFamily: 'DM Mono, monospace' }}>
                    ✅ {result}
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                    {topBidrag.map((b, i) => (
                      <div key={i} style={{
                        background: 'var(--cream)',
                        border: '1px solid rgba(74,103,65,0.25)',
                        borderRadius: '8px',
                        padding: '18px 20px',
                      }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '12px', flexWrap: 'wrap' }}>
                          <div style={{ flex: 1 }}>
                            <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--soil)', marginBottom: '4px', fontFamily: 'DM Mono, monospace' }}>
                              {b.namn}
                            </div>
                            <div style={{ fontSize: '11px', color: 'var(--bark)', marginBottom: '8px' }}>
                              {b.utlysare}
                            </div>
                            <div style={{ fontSize: '11px', color: 'var(--soil)', opacity: 0.8, marginBottom: '10px', lineHeight: '1.5' }}>
                              {b.beskrivning}
                            </div>
                            <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
                              <span style={{ fontSize: '11px', color: 'var(--moss)', fontFamily: 'DM Mono, monospace' }}>
                                💰 {b.belopp}
                              </span>
                              <span style={{ fontSize: '11px', color: 'var(--bark)', fontFamily: 'DM Mono, monospace' }}>
                                📅 Deadline: {b.deadline}
                              </span>
                            </div>
                          </div>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', flexShrink: 0 }}>
                            <a href={b.lank} target="_blank" rel="noopener noreferrer" style={{
                              fontSize: '11px', color: 'var(--moss)', textDecoration: 'none',
                              border: '1px solid var(--moss)', borderRadius: '4px',
                              padding: '6px 12px', fontFamily: 'DM Mono, monospace',
                              whiteSpace: 'nowrap'
                            }}>
                              Läs mer →
                            </a>
                            <button onClick={() => generateApplication(b)} style={{
                              fontSize: '11px', color: 'white', background: 'var(--moss)',
                              border: 'none', borderRadius: '4px', padding: '6px 12px',
                              cursor: 'pointer', fontFamily: 'DM Mono, monospace',
                              whiteSpace: 'nowrap'
                            }}>
                              ✍️ Skriv utkast
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              )}

              {!loading && topBidrag.length === 0 && (
                <div className={styles.card} style={{ textAlign: 'center', padding: '32px' }}>
                  <div style={{ fontSize: '14px', color: 'var(--bark)' }}>Inga bidrag hittades. Försök igen med fler uppgifter.</div>
                </div>
              )}

              <BtnRow
                left={<button className={styles.btnSecondary} onClick={() => { setScreen(3); window.scrollTo({top:0,behavior:'smooth'}) }}>← Ändra uppgifter</button>}
                right={<button className={styles.btnSecondary} onClick={reset}>🔄 Ny sökning</button>}
              />
            </div>
          )}

          {/* ── SCREEN 5: ANSÖKAN ── */}
          {screen === 5 && (
            <div className={styles.screen}>
              <h2 className={styles.sectionTitle}>Ansökningsutkast</h2>
              <p className={styles.sectionDesc}>{selectedBidrag?.namn} – {selectedBidrag?.utlysare}</p>

              {appLoading && (
                <div className={styles.card} style={{ textAlign: 'center', padding: '48px' }}>
                  <div className={styles.loadingDots}><span /><span /><span /></div>
                  <div style={{ marginTop: '16px', fontSize: '12px', opacity: 0.6 }}>
                    Skriver ansökningsutkast med dina gårdsuppgifter...
                  </div>
                </div>
              )}

              {!appLoading && application && (
                <div className={styles.aiResponse}>
                  <div className={styles.aiLabel}>
                    <span className={styles.aiDot} />
                    Utkast för {farm || 'din gård'}
                  </div>
                  <div
                    className={styles.aiContent}
                    dangerouslySetInnerHTML={{ __html: formatResult(application) }}
                  />
                  <div className={styles.resultActions}>
                    <button className={styles.actionCard} onClick={() => {
                      navigator.clipboard.writeText(application).then(() => {
                        setAppCopied(true); setTimeout(() => setAppCopied(false), 2000)
                      })
                    }}>
                      <div className={styles.actionIcon}>{appCopied ? '✓' : '📋'}</div>
                      <div className={styles.actionLabel}>{appCopied ? 'Kopierad!' : 'Kopiera text'}</div>
                    </button>
                    <button className={styles.actionCard} onClick={downloadDocx}>
                      <div className={styles.actionIcon}>📄</div>
                      <div className={styles.actionLabel}>Ladda ner</div>
                    </button>
                    <button className={styles.actionCard} onClick={() => window.print()}>
                      <div className={styles.actionIcon}>🖨️</div>
                      <div className={styles.actionLabel}>Skriv ut</div>
                    </button>
                  </div>
                </div>
              )}

              <BtnRow
                left={<button className={styles.btnSecondary} onClick={() => { setScreen(4); window.scrollTo({top:0,behavior:'smooth'}) }}>← Tillbaka till analys</button>}
              />
            </div>
          )}

          <div style={{ textAlign: 'center', padding: '8px', opacity: 0.4 }}>
            <button onClick={activateTestMode} style={{
              fontSize: '10px', color: 'var(--bark)', background: 'none',
              border: '1px dashed rgba(74,103,65,0.3)', borderRadius: '4px',
              padding: '4px 10px', cursor: 'pointer', fontFamily: 'DM Mono, monospace'
            }}>🧪 testläge</button>
          </div>
          <div style={{
            margin: '32px 0 16px',
            padding: '20px 24px',
            background: 'rgba(74,103,65,0.06)',
            borderRadius: '8px',
            borderLeft: '3px solid var(--moss)',
            fontFamily: 'DM Mono, monospace',
          }}>
            <div style={{ fontSize: '12px', color: 'var(--moss)', marginBottom: '8px' }}>🌱 Om Odlarstöd.se</div>
            <p style={{ fontSize: '11px', color: 'var(--soil)', lineHeight: '1.7', margin: 0 }}>
              Odlarstöd.se är byggt av <strong>Sophia Yacoub-Wallin</strong> – lärare i geografi och samhällskunskap, hobbyodlare och brinnande engagerad i hållbarhet och biologisk mångfald. Verktyget är ett sätt att bidra till ett mer hållbart matsystem genom att göra det enklare för småskaliga producenter att hitta och söka de bidrag de har rätt till.
            </p>
            <p style={{ fontSize: '11px', color: 'var(--bark)', marginTop: '8px', marginBottom: 0 }}>
              Frågor eller feedback? Maila <a href="mailto:sophia.ag.yacoub@gmail.com" style={{ color: 'var(--moss)' }}>sophia.ag.yacoub@gmail.com</a>
            </p>
          </div>

          <footer className={styles.footer}>
            Odlarstöd.se · Bidragsagent för hållbara matproducenter · Sverige 🇸🇪
          </footer>
        </div>
      </div>
    </>
  )
}

// ── Helpers ──
function Field({ label, children }) {
  return (
    <div style={{ marginBottom: '20px' }}>
      <label style={{
        display: 'block', fontSize: '11px', letterSpacing: '1.5px',
        textTransform: 'uppercase', color: 'var(--bark)', marginBottom: '8px'
      }}>{label}</label>
      {children}
    </div>
  )
}

function CheckItem({ label, checked, onChange }) {
  return (
    <button
      onClick={onChange}
      style={{
        display: 'flex', alignItems: 'center', gap: '10px',
        padding: '10px 12px', background: checked ? 'rgba(74,103,65,0.08)' : 'var(--cream)',
        border: `1px solid ${checked ? 'var(--moss)' : 'rgba(74,103,65,0.2)'}`,
        borderRadius: '4px', cursor: 'pointer', fontSize: '12px',
        color: checked ? 'var(--moss)' : 'var(--soil)',
        fontFamily: 'DM Mono, monospace', textAlign: 'left',
        transition: 'all 0.2s'
      }}
    >
      <span style={{
        width: '16px', height: '16px', flexShrink: 0, display: 'flex',
        alignItems: 'center', justifyContent: 'center',
        border: `1.5px solid ${checked ? 'var(--moss)' : 'rgba(74,103,65,0.4)'}`,
        borderRadius: '3px', background: checked ? 'var(--moss)' : 'transparent',
        color: 'white', fontSize: '10px'
      }}>
        {checked ? '✓' : ''}
      </span>
      {label}
    </button>
  )
}

function BtnRow({ left, right }) {
  return (
    <div style={{
      display: 'flex', justifyContent: left && right ? 'space-between' : right ? 'flex-end' : 'flex-start',
      alignItems: 'center', marginTop: '32px', paddingTop: '24px',
      borderTop: '1px solid rgba(74,103,65,0.1)'
    }}>
      {left}
      {right}
    </div>
  )
}
