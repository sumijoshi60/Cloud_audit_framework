# Cloud Security Audit Framework

A comprehensive client-side cloud security assessment tool built with React + Vite.

## Features

- 🔒 **100% Client-Side** - All data stays in your browser, complete privacy
- 💾 **Auto-Save Progress** - Responses automatically saved to localStorage
- 📊 **Detailed Analysis** - Get actionable recommendations based on security gaps
- 🎯 **6 Audit Domains** - Covers IAM, Network Security, Data Protection, Logging, Configuration, and Incident Response
- ⚡ **Quick Assessment** - 26 targeted questions covering all critical security areas
- 📈 **Risk Scoring** - Weighted scoring system with visual risk indicators

## Getting Started

### Development

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

### Deployment to Netlify

1. **Via Netlify CLI:**
```bash
npm install -g netlify-cli
npm run build
netlify deploy --prod
```

2. **Via Netlify Dashboard:**
- Connect your GitHub repository
- Build command: `npm run build`
- Publish directory: `dist`

## Architecture

- **Framework Data**: `/src/assets/framework.json`
- **Scoring Logic**: `/src/utils/scoring.js`
- **User Responses**: localStorage (browser-based persistence)
- **State Management**: React Context API
- **Routing**: React Router v6

## Project Structure

```
cloud-audit-framework/
├── src/
│   ├── assets/          # Framework JSON data
│   ├── components/      # Reusable components
│   │   ├── common/      # Button, Card, ProgressBar, Layout
│   │   ├── assessment/  # QuestionCard, DomainSelector
│   │   └── results/     # ScoreCard, DomainBreakdown, RecommendationList
│   ├── pages/           # Home, DomainAssessment, Results
│   ├── context/         # AuditContext (global state)
│   ├── utils/           # Scoring, storage, constants
│   └── hooks/           # Custom React hooks
├── public/              # Static assets
└── netlify.toml         # Netlify configuration
```

## Technology Stack

- React 18+
- Vite (build tool)
- React Router v6
- Vanilla CSS with CSS Modules
- localStorage API

## License

MIT
