# SSA Form-Assist

A privacy-first Progressive Web Application that helps individuals complete the SSA Adult Function Report (Form SSA-3373) using AI assistance with HIPAA-level security through client-side encryption.

## 🎉 Status: MVP Feature-Complete!

All core features have been implemented and tested. Ready for user testing and deployment.

## Features

- 🔐 **End-to-End Encryption**: AES-256-GCM encryption with PBKDF2 (600,000 iterations)
- 🏠 **Local-First**: All data stored securely in IndexedDB on your device
- 📱 **Mobile-Friendly**: Fully responsive design optimized for mobile devices
- 🤖 **Multi-LLM Support**: Integrated with 4 providers (Claude, Gemini, OpenAI, xAI)
- 🔒 **Zero-Knowledge**: Passphrase never leaves your device, no server storage
- ✨ **PWA**: Installable as native app on any device with offline support
- 🎯 **4-Step Wizard**: Guided report creation process
- 📋 **Smart AI Prompts**: Context-aware generation based on your inputs
- 💾 **Auto-Save**: Drafts saved every 30 seconds
- 📤 **Multiple Export Options**: Copy to clipboard, print, or save encrypted

## Quick Start

### Prerequisites

- Node.js 18+ (LTS)
- npm 9+

### Installation

1. Clone and install:
```bash
git clone <repository-url>
cd ssa-form-assist
npm install
```

2. (Optional) Configure API keys:
```bash
cp .env.example .env.local
# Edit .env.local with your API keys
```

3. Run development server:
```bash
npm run dev
```

4. Build for production:
```bash
npm run build
npm run preview
```

## Usage

### First Time Setup
1. Create a strong passphrase (this encrypts ALL your data)
2. Configure your preferred LLM provider in Settings
3. Enter API key (or use .env file)

### Creating a Report
1. **Step 1: Select Blue Book Listings** - Choose relevant disability categories
2. **Step 2: Functional Inputs** - Complete comprehensive assessment (10 question groups)
3. **Step 3: AI Generation** - Generate AI-assisted responses (6 SSA questions)
4. **Step 4: Review & Export** - Review, edit, and export your report

### API Keys

**Option 1: Environment Variables** (Development)
```env
VITE_ANTHROPIC_API_KEY="sk-ant-..."
VITE_ANTHROPIC_API_MODEL=claude-sonnet-4-5-20250929

VITE_GOOGLE_API_KEY="..."
VITE_GEMINI_API_MODEL=gemini-2.0-flash-exp

VITE_OPENAI_API_KEY="sk-proj..."
VITE_OPENAI_API_MODEL=gpt-4o-mini

VITE_XAI_API_KEY="xai-..."
VITE_XAI_API_MODEL=grok-beta
```

**Option 2: Settings Page** (Production/Mobile)
- Navigate to Settings
- Select provider
- Enter API key and model name
- Keys are encrypted before storage

## Testing

### Unit Tests
```bash
npm test
```

Coverage includes:
- Encryption service (23 tests)
- IndexedDB service (15+ tests)
- Prompt builder (15+ tests)

### E2E Tests
```bash
npm run test:e2e
```

Playwright tests covering:
- Complete wizard flow
- Authentication
- Accessibility
- Mobile responsiveness

## Deployment

See [DEPLOYMENT.md](./DEPLOYMENT.md) for comprehensive deployment guide.

### Quick Deploy

**Netlify:**
```bash
# Configuration already included (netlify.toml)
# Connect repo → Auto-deploys
```

**Vercel:**
```bash
npm install -g vercel
vercel
```

**GitHub Pages:**
```bash
npm run build
npx gh-pages -d dist
```

## Security

### Encryption Architecture
- **Algorithm**: AES-256-GCM (NIST recommended)
- **Key Derivation**: PBKDF2 with 600,000 iterations
- **Salt**: 128-bit cryptographically secure random
- **Session**: 30-minute auto-lock timeout
- **Zero-Knowledge**: Passphrase never stored, master key in memory only

### Data Privacy
- ✅ No cookies
- ✅ No tracking/analytics
- ✅ No server-side storage
- ✅ All data encrypted client-side
- ✅ LLM calls only on user action

### Security Headers
```
X-Frame-Options: DENY
X-Content-Type-Options: nosniff
X-XSS-Protection: 1; mode=block
Referrer-Policy: strict-origin-when-cross-origin
Permissions-Policy: camera=(), microphone=(), geolocation=()
```

⚠️ **CRITICAL**: If you lose your passphrase, there is NO WAY to recover your data!

## Project Structure

```
ssa-form-assist/
├── src/
│   ├── components/
│   │   ├── Auth/              # Passphrase setup & unlock
│   │   ├── Dashboard/         # Report list & dashboard
│   │   ├── Help/              # Help & about
│   │   ├── Navigation/        # Main navigation
│   │   ├── Settings/          # LLM configuration
│   │   ├── ReportWizard/      # 4-step wizard
│   │   │   ├── steps/
│   │   │   │   ├── BlueBookSelection.tsx
│   │   │   │   ├── FunctionalInputs.tsx
│   │   │   │   ├── AIGeneration.tsx
│   │   │   │   └── ReviewAndExport.tsx
│   │   │   ├── WizardContext.tsx
│   │   │   ├── WizardProgress.tsx
│   │   │   └── WizardNavigation.tsx
│   │   └── ui/                # Reusable UI components
│   ├── services/
│   │   ├── encryption/        # EncryptionService
│   │   ├── storage/           # IndexedDBService
│   │   └── llm/               # LLM service layer
│   │       ├── LLMService.ts
│   │       ├── PromptBuilder.ts
│   │       └── providers/     # Gemini, OpenAI, Claude, xAI
│   ├── stores/                # Zustand state management
│   ├── types/                 # TypeScript definitions
│   ├── config/                # Form questions & config
│   └── utils/                 # Utility functions
├── tests/
│   ├── unit/                  # Vitest unit tests
│   └── e2e/                   # Playwright E2E tests
├── public/
│   └── data/                  # Blue Book & SSA-3373 schema
├── netlify.toml               # Netlify config
├── vercel.json                # Vercel config
└── playwright.config.ts       # E2E test config
```

## Development Roadmap

### ✅ Phase 1: Foundation (Weeks 1-3) - COMPLETE
- [x] Security core (AES-256-GCM, PBKDF2)
- [x] Core UI and navigation
- [x] Report wizard framework
- [x] Step 1: Blue Book selection
- [x] Step 2: Functional inputs

### ✅ Phase 2: AI Integration (Weeks 4-5) - COMPLETE
- [x] LLM service abstraction
- [x] 4 provider adapters (Gemini, OpenAI, Claude, xAI)
- [x] Prompt engineering system
- [x] Step 3: AI generation UI
- [x] Cost estimation & error handling

### ✅ Phase 3: Report Completion (Week 6) - COMPLETE
- [x] Step 4: Review & export
- [x] Copy to clipboard
- [x] Print view
- [x] Save to IndexedDB

### ✅ Phase 4: Polish & Testing (Weeks 7-9) - COMPLETE
- [x] Unit test suite (40+ tests)
- [x] E2E test framework (Playwright)
- [x] Deployment configurations
- [x] Comprehensive documentation
- [x] Accessibility improvements
- [ ] Cloud sync (deferred to v2.0)

## Performance Metrics

- **Bundle Size**: 284 KB (84 KB gzipped) ✅ Target: <500 KB
- **Build Time**: ~7 seconds ✅
- **Lighthouse Scores** (Target):
  - Performance: 90+
  - Accessibility: 100
  - Best Practices: 100
  - SEO: 90+
  - PWA: 100

## Browser Support

- Chrome/Edge: 90+
- Firefox: 88+
- Safari: 14+
- Mobile Safari: 14+
- Mobile Chrome: 90+

PWA features require HTTPS in production.

## Contributing

This is an open-source project. Contributions welcome!

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## Disclaimers

⚠️ **IMPORTANT LEGAL NOTICES**

- **NOT affiliated** with the Social Security Administration
- Provides **GUIDANCE ONLY** - not legal or medical advice
- You are **SOLELY RESPONSIBLE** for accuracy of submitted information
- Always **REVIEW AND VERIFY** all AI-generated content
- **NO WARRANTY** - use at your own risk
- AI outputs may contain errors or inaccuracies
- Consult with a disability attorney for legal advice

## FAQ

**Q: Is my data safe?**
A: Yes. All data is encrypted with AES-256-GCM before storage. Your passphrase never leaves your device.

**Q: What if I forget my passphrase?**
A: Unfortunately, data cannot be recovered without the passphrase. This is by design for security.

**Q: Do I need an API key?**
A: Yes, to use AI generation features. You need at least one LLM provider API key.

**Q: How much does it cost?**
A: The app is free. You only pay for LLM API usage (typically $0.001-0.01 per report).

**Q: Can I use this on mobile?**
A: Yes! The app is fully responsive and works great on mobile devices.

**Q: Is it offline?**
A: Partially. After first load, the app works offline except for AI generation (requires internet).

**Q: Where is my data stored?**
A: Locally in your browser's IndexedDB. Nothing is sent to our servers.

## License

MIT License - See LICENSE file for details

## Support

- **Issues**: [GitHub Issues](link-to-issues)
- **Documentation**: [Full Docs](./docs/)
- **Deployment**: [Deployment Guide](./DEPLOYMENT.md)

## Acknowledgments

Built with:
- React + TypeScript + Vite
- Tailwind CSS + Radix UI
- IndexedDB (via idb)
- Web Crypto API
- Vitest + Playwright

---

**Made with ❤️ for those navigating the disability benefits process**
