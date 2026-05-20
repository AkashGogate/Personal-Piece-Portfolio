# Akash Gogate Portfolio Website

Personal portfolio with an editorial minimalist aesthetic. Built with Next.js 14, Tailwind CSS, Framer Motion, and anime.js — featuring scroll-driven animations, a dark/light mode toggle, and all content managed from a single data file.

**Live at:** (https://akashgogate.github.io/PersonalPortfolio/)

---

## Stack

| Tool | Role |
|---|---|
| **Next.js 14** (App Router) | Framework, static export |
| **TypeScript** | Type safety throughout |
| **Tailwind CSS** | Layout utilities only — all colors via CSS custom properties |
| **Framer Motion** | Scroll-triggered fade/slide animations |
| **anime.js** | Imperative entrance sequences on mount |

---

## Getting Started

```bash
npm install
npm run dev
```

```bash
npx tsc --noEmit   # typecheck
npm run lint       # lint
npm run build      # production build (static export to ./out)
```

---

## Project Structure

```
app/
  layout.tsx        # root layout, fonts, metadata
  page.tsx          # section assembly only
  globals.css       # CSS variables, animation utilities
components/         # one file per section (Hero, Experience, Projects, ...)
data/
  resume.ts         # ALL content lives here — single source of truth
lib/
  navigate.ts       # smooth scroll utility for all #hash links
public/
  resumes/          # PDF variants — not committed, add manually
```

---

## Content

All experience bullets, project descriptions, skills, and resume links live in `data/resume.ts`. Edit there — nowhere else. Components read from this file and render dynamically.

---

## Deployment

Deployed to [GitHub Pages](https://pages.github.com/) via GitHub Actions. On every push to `main`, the workflow:

1. Builds a fully static export (`output: 'export'`) with `basePath: /PortfolioWebsite`
2. Uploads the `./out` directory as a Pages artifact
3. Deploys to `https://akashgogate.github.io/PortfolioWebsite`

To enable: GitHub repo → **Settings → Pages → Source → GitHub Actions**.

---

## Notes

- Resume PDFs go in `public/resumes/` — gitignored, must be added manually before launch
- Dark mode toggled by `.dark` class on `<html>` — no Tailwind `dark:` prefix used
- All hover/accent colors resolve to `var(--mint)` (`#52b788`)
- `doNavigate` from `lib/navigate.ts` handles all `#hash` scroll — accounts for fixed nav offset and scroll-animated section boundaries
