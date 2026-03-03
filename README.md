# Odlarstöd.se

Bidragsagent för hållbara småskaliga matproducenter i Sverige.

---

## Komma igång lokalt

```bash
npm install
cp .env.example .env.local
# Fyll i din Anthropic API-nyckel i .env.local
npm run dev
```

Öppna http://localhost:3000

---

## Deploya till Vercel (steg för steg)

### 1. Skapa ett GitHub-repo

1. Gå till github.com och skapa ett nytt repo (t.ex. `odlarstod`)
2. Ladda upp alla filer från den här mappen till repot
   - Ladda INTE upp `.env.local` – den innehåller din hemliga API-nyckel

### 2. Koppla Vercel till GitHub

1. Gå till vercel.com och logga in (gratis konto räcker)
2. Klicka "Add New Project"
3. Välj ditt GitHub-repo `odlarstod`
4. Klicka "Deploy" – Vercel känner automatiskt igen Next.js

### 3. Lägg till din API-nyckel i Vercel

1. Gå till ditt projekt i Vercel → Settings → Environment Variables
2. Lägg till:
   - **Name:** `ANTHROPIC_API_KEY`
   - **Value:** din nyckel från console.anthropic.com
3. Klicka Save och gör en ny deploy (Deployments → Redeploy)

### 4. Koppla din domän odlarstöd.se

1. I Vercel: Settings → Domains → Add Domain
2. Skriv in `odlarstod.se` (utan å/ä/ö – Vercel hanterar IDN-domäner)
   - Alternativt: `xn--odlarstd-n2a.se` (den tekniska formen av odlarstöd.se)
3. Vercel visar DNS-inställningar du ska lägga in hos din domänregistrator (t.ex. Loopia)
4. Kopiera de DNS-värden Vercel visar och lägg in dem hos Loopia → Domänhantering → DNS
5. Vänta 5–30 minuter – sedan är sajten live på odlarstöd.se!

---

## Projekstruktur

```
odlarstod/
├── pages/
│   ├── index.js        ← Hela frontenden
│   └── api/
│       └── analyze.js  ← Backend-proxy till Anthropic (håller API-nyckeln säker)
├── styles/
│   ├── globals.css
│   └── Home.module.css
├── .env.example        ← Mall för miljövariabler
├── .gitignore          ← .env.local är ignorerad
└── package.json
```

---

## Kostnad

- **Vercel hosting:** Gratis för denna skala
- **Domän odlarstöd.se:** ~99 kr/år
- **Anthropic API:** ~0.50–2 kr per analys (Claude Sonnet)
