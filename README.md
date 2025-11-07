# SSA Form-Assist

A privacy-first Progressive Web Application that helps individuals complete the SSA Adult Function Report (Form SSA-3373) using AI assistance with HIPAA-level security through client-side encryption.

## Features

- 🔐 **End-to-End Encryption**: AES-256-GCM encryption with PBKDF2 key derivation
- 🏠 **Local-First**: All data stored locally on your device
- 📱 **Mobile-Friendly**: Responsive design with bottom navigation for mobile
- 🤖 **Multi-LLM Support**: Works with Claude, Gemini, OpenAI, and xAI
- 🔒 **Zero-Knowledge**: Your passphrase never leaves your device
- ✨ **PWA**: Install as an app on any device

## Getting Started

### Prerequisites

- Node.js 18+ (LTS)
- npm 9+ or yarn 1.22+

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd ssa-form-assist
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables (optional):
```bash
cp .env.example .env.local
```

Edit `.env.local` and add your API keys:
```env
# Anthropic Claude API
VITE_ANTHROPIC_API_KEY="sk-ant-..."
VITE_ANTHROPIC_API_MODEL=claude-sonnet-4-5-20250929

# Google Gemini API
VITE_GOOGLE_API_KEY="..."
VITE_GEMINI_API_MODEL=gemini-2.0-flash-exp

# OpenAI API
VITE_OPENAI_API_KEY="sk-proj..."
VITE_OPENAI_API_MODEL=gpt-4o-mini

# xAI API
VITE_XAI_API_KEY="xai-..."
VITE_XAI_API_MODEL=grok-beta
```

**Note**: Environment variables take precedence over API keys stored in the app's settings.

4. Run the development server:
```bash
npm run dev
```

5. Build for production:
```bash
npm run build
```

6. Preview production build:
```bash
npm run preview
```

## Configuration

### Using Environment Variables

API keys can be configured in two ways:

1. **Environment Variables** (.env.local file) - Recommended for development
   - Keys are loaded at build time
   - More convenient for development
   - Keys won't be prompted in the Settings page

2. **In-App Configuration** (Settings page) - Recommended for end users
   - Keys are encrypted with your passphrase before storage
   - Can be updated without rebuilding the app
   - Required if environment variables are not set

### LLM Provider Options

- **Anthropic Claude**: Best for complex reasoning and analysis
- **Google Gemini**: Fast and cost-effective
- **OpenAI GPT-4**: Well-rounded performance
- **xAI Grok**: Emerging option with unique capabilities

## Security

### Encryption Details

- **Algorithm**: AES-256-GCM
- **Key Derivation**: PBKDF2 with 600,000+ iterations
- **Salt**: 128-bit cryptographically random
- **Session Management**: 30-minute auto-lock timeout

### Important Security Notes

⚠️ **CRITICAL**: If you lose your passphrase, there is NO WAY to recover your data. Store your passphrase securely using a password manager.

- All data is encrypted on your device before storage
- Your passphrase is never stored anywhere
- Master encryption key only exists in memory during your session
- API keys are encrypted before being saved to IndexedDB

## Testing

### Unit Tests
```bash
npm test
```

### E2E Tests (Coming Soon)
```bash
npm run test:e2e
```

## Project Structure

```
ssa-form-assist/
├── public/
│   └── data/               # Blue Book and SSA-3373 schema data
├── src/
│   ├── components/
│   │   ├── Auth/           # Passphrase UI components
│   │   ├── Dashboard/      # Dashboard and report list
│   │   ├── Help/           # Help and about pages
│   │   ├── Navigation/     # Navigation components
│   │   ├── Settings/       # Settings page
│   │   └── ui/             # Base UI components
│   ├── services/
│   │   ├── encryption/     # Encryption service
│   │   └── storage/        # IndexedDB service
│   ├── stores/             # State management (Zustand)
│   ├── types/              # TypeScript types
│   └── utils/              # Utility functions
└── tests/                  # Test files
```

## Development Roadmap

### Phase 1: Foundation (Weeks 1-3) ✅
- [x] Project setup with security core
- [x] Core UI and navigation
- [ ] Report creation wizard (In Progress)

### Phase 2: AI Integration (Weeks 4-5)
- [ ] LLM service layer
- [ ] API key management
- [ ] AI generation UI

### Phase 3: Report Completion (Week 6)
- [ ] Review & export functionality

### Phase 4: Polish & Testing (Weeks 7-9)
- [ ] Cloud sync (optional)
- [ ] Testing & accessibility audit
- [ ] Deployment & documentation

## Contributing

This project is currently in active development. Contributions are welcome!

## Disclaimers

⚠️ **IMPORTANT NOTICE**

- This application is **NOT affiliated with the Social Security Administration**
- This tool provides **GUIDANCE ONLY** and does not constitute legal or medical advice
- You are **SOLELY RESPONSIBLE** for the accuracy of information submitted to the SSA
- Always **REVIEW AND VERIFY** all generated content before submission

## License

[Add license information]

## Support

For issues and questions, please open an issue on GitHub.
