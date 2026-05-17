# PitchCraft AI

Premium AI-powered pitch creation and optimization. Built with Next.js 14, TailwindCSS, Framer Motion, and Claude Opus 4.7.

## Setup

### 1. Install Node.js

If you don't have Node.js installed:
- **Recommended:** Install via [nvm](https://github.com/nvm-sh/nvm): `curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash` then `nvm install 20`
- **Or:** Download directly from [nodejs.org](https://nodejs.org) (LTS version)

### 2. Install dependencies

```bash
cd ~/Desktop/pitchcraft-ai
npm install
```

### 3. Add your API key

```bash
cp .env.local.example .env.local
```

Edit `.env.local` and add your Anthropic API key:
```
ANTHROPIC_API_KEY=sk-ant-...
```

Get your key at [console.anthropic.com](https://console.anthropic.com)

### 4. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Project Structure

```
pitchcraft-ai/
├── app/
│   ├── layout.tsx              # Root layout + metadata
│   ├── page.tsx                # Landing page
│   ├── globals.css             # Global styles
│   ├── dashboard/
│   │   └── page.tsx            # Main dashboard (dual-mode editor)
│   └── api/pitch/
│       ├── analyze/route.ts    # Analyze existing pitch (streaming)
│       ├── create/route.ts     # Create pitch from answers (streaming)
│       └── improve/route.ts    # Quick improvement actions (streaming)
├── components/
│   ├── landing/                # Hero, Features, HowItWorks, CTA
│   └── dashboard/              # ConfigPanel, ChatMode, ResultsPanel,
│                               # AnalysisScore, QuickActions
└── lib/
    ├── anthropic.ts            # Anthropic client singleton
    ├── prompts.ts              # AI prompt builders
    └── types.ts                # TypeScript interfaces
```

## Features

- **Mode 1 — Improve pitch:** Paste any pitch for AI analysis + optimized rewrite
- **Mode 2 — Create from scratch:** 8-question guided flow → complete pitch script
- **6-dimension scoring:** Clarity, Impact, Persuasion, Storytelling, Confidence, Differentiation
- **8 quick-action buttons:** Make more persuasive, shorter, emotional, professional, etc.
- **Full configuration:** Duration (1/3/5/10 min), Tone (8 options), Audience (7 options)
- **Streaming responses:** Real-time AI output for best UX
- **Copy & Download:** Export your pitch as text file
