# AI-DNA Profiler

SCG PSD × AI Champions — event profiling app.

## Deploy to Vercel (3 steps)

### Option A — Vercel CLI (fastest)
```bash
npm install -g vercel
cd ai-dna-app
vercel --prod
```

### Option B — GitHub + Vercel dashboard
1. Push this folder to a GitHub repo
2. Go to vercel.com → "Add New Project"
3. Import the repo → Vercel auto-detects Vite → click **Deploy**

### Option C — Drag & drop the `dist/` folder
1. Run `npm run build` locally
2. Go to vercel.com/new → drag the `dist/` folder onto the page
3. Done — instant deploy, no account needed for preview

---

## Local dev
```bash
npm install
npm run dev
```

## What it does
- 4 screens: Welcome (name + email) → Problem → Impact → DNA Card
- 21 profiles (7 problems × 3 impact dimensions)
- DNA card saves as a PNG image (name stamped on card)
- "Profile another participant" resets for the next person
- Fully client-side, no backend required
