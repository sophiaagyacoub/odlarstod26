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
  'Gårdsbutik','REKO-ring','Bondesmarknad','Restauranger',
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
      setResult(data.result || data.error || 'Kunde inte hämta analys.')
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
    window.scrollTo({ top: 0, behavior: 'smooth' })
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
              <p className={styles.sectionDesc}>Baserat på din profil analyserar agenten relevanta bidrag och stöd.</p>

              {loading && (
                <div className={styles.card} style={{ textAlign: 'center', padding: '48px' }}>
                  <div className={styles.loadingDots}>
                    <span /><span /><span />
                  </div>
                  <div style={{ marginTop: '16px', fontSize: '12px', opacity: 0.6 }}>
                    Analyserar din profil och söker igenom Jordbruksverket, Leader, Region & EU-fonder...
                  </div>
                </div>
              )}

              {!loading && result && (
                <div className={styles.aiResponse}>
                  <div className={styles.aiLabel}>
                    <span className={styles.aiDot} />
                    Bidragsanalys för {farm || 'din gård'}
                  </div>
                  <div
                    className={styles.aiContent}
                    dangerouslySetInnerHTML={{ __html: formatResult(result) }}
                  />
                  <div className={styles.resultActions}>
                    <button className={styles.actionCard} onClick={copyResult}>
                      <div className={styles.actionIcon}>{copied ? '✓' : '📋'}</div>
                      <div className={styles.actionLabel}>{copied ? 'Kopierad!' : 'Kopiera analys'}</div>
                    </button>
                    <button className={styles.actionCard} onClick={() => window.print()}>
                      <div className={styles.actionIcon}>🖨️</div>
                      <div className={styles.actionLabel}>Skriv ut</div>
                    </button>
                    <button className={styles.actionCard} onClick={reset}>
                      <div className={styles.actionIcon}>🔄</div>
                      <div className={styles.actionLabel}>Ny sökning</div>
                    </button>
                  </div>
                </div>
              )}

              <BtnRow
                left={<button className={styles.btnSecondary} onClick={() => { setScreen(3); window.scrollTo({top:0,behavior:'smooth'}) }}>← Ändra uppgifter</button>}
              />
            </div>
          )}

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
