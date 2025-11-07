# SSA Form-Assist: Autonomous Development Prompt for Claude Code

## Project Overview

You are tasked with building **SSA Form-Assist**, a Progressive Web Application (PWA) that helps individuals complete the SSA Adult Function Report (Form SSA-3373) using AI assistance. This is a privacy-first, local-first application with HIPAA-level security through client-side encryption.

**Primary Use Case**: Mobile device usage (responsive design required)  
**Target Timeline**: 9 weeks to production-ready MVP  
**Critical Priority**: Security and privacy above all else

---

## Available Documentation

You have access to the following complete specifications:

1. **Technical Specification** (`ssa-assist-tech-spec.md`)
   - Complete architecture (React + TypeScript + Vite)
   - Security architecture (AES-256-GCM encryption, PBKDF2 key derivation)
   - Data storage (IndexedDB schemas)
   - LLM integration strategy
   - Cloud sync architecture
   - Complete technology stack decisions

2. **Prompt Templates** (`prompt-templates-complete.ts`)
   - Complete AI prompt engineering system
   - 5 functional domain templates (daily activities, physical limitations, social functioning, concentration/persistence, adaptation)
   - Provider-specific adjustments (Claude, OpenAI, Gemini)
   - Example responses for musculoskeletal, mental health, and respiratory disorders
   - Complete PromptTemplateBuilder implementation

3. **Project Plan** (`COMPREHENSIVE_PROJECT_PLAN.md`)
   - Week-by-week implementation schedule
   - Detailed component specifications
   - Quality gates and success criteria
   - Risk management strategies

4. **Blue Book Data** (`ssa_bluebook_adult_complete.json`)
   - Complete structure of all 13 Blue Book categories (1.00-14.00)
   - URLs, titles, listing IDs for each category
   - Metadata for each category

5. **SSA-3373 Schema** (`ssa_3373_schema.json` and `ssa-3373-bk_parsed.json`)
   - Complete form structure
   - All sections and questions
   - Data model for form responses

---

## Core Implementation Constraints

### Security Requirements (NON-NEGOTIABLE)

1. **Encryption First**
   - Use Web Crypto API for all encryption operations
   - AES-256-GCM for data encryption
   - PBKDF2 (600,000+ iterations) for key derivation from passphrase
   - Store salt unencrypted in IndexedDB (required for key derivation)
   - Master encryption key (MEK) only in memory, never persisted
   - Clear MEK from memory on logout/timeout

2. **Zero-Knowledge Architecture**
   - Passphrase never leaves client
   - Passphrase never stored anywhere
   - All sensitive data encrypted before storage
   - No server-side storage of user data

3. **Session Management**
   - 15-30 minute auto-lock timeout (configurable)
   - Require passphrase re-entry after timeout
   - Clear sensitive data from memory on lock

### UI/UX Requirements (Mobile-First)

1. **Responsive Design**
   - Mobile: < 640px (1 column, bottom navigation)
   - Tablet: 640-1024px (2 columns)
   - Desktop: > 1024px (3 columns)

2. **Touch-Friendly**
   - 44px minimum touch targets
   - Swipe gestures for wizard navigation
   - Bottom navigation for main actions on mobile

3. **Accessibility (WCAG 2.1 AA Minimum)**
   - Full keyboard navigation
   - Screen reader compatible
   - Color contrast ratio ≥ 4.5:1
   - Focus indicators visible
   - Support for high contrast mode

4. **UI Framework**
   - Use Tailwind CSS + Radix UI (or shadcn/ui)
   - Component library provides accessibility primitives
   - Clean, professional design suitable for government form completion

### Technology Stack (Pre-Decided)

```json
{
  "framework": "React 18+ with TypeScript",
  "build": "Vite",
  "state": "Zustand or Context API + useReducer",
  "storage": "IndexedDB via 'idb' wrapper",
  "pwa": "Workbox 7+ for service worker",
  "ui": "Tailwind CSS + Radix UI or shadcn/ui",
  "testing": "Vitest + Playwright"
}
```

---

## Development Phases

### Phase 1: Foundation (Weeks 1-3) - START HERE

**Week 1: Project Setup & Security Core**

1. Initialize Project
   ```bash
   npm create vite@latest ssa-form-assist -- --template react-ts
   ```

2. Install Core Dependencies
   ```bash
   npm install zustand idb @radix-ui/react-dialog @radix-ui/react-select @radix-ui/react-tabs lucide-react clsx tailwind-merge
   npm install -D @types/node autoprefixer postcss tailwindcss vite-plugin-pwa workbox-window
   ```

3. Implement Security Core
   - Create `src/services/encryption/EncryptionService.ts` (implementation provided in tech spec)
   - Create `src/services/storage/IndexedDBService.ts` (implementation provided in tech spec)
   - Write unit tests for encryption/decryption round-trip
   - Write unit tests for IndexedDB operations

4. Build Passphrase UI
   - First-time setup flow (create passphrase with strength indicator)
   - Login/unlock screen
   - Passphrase confirmation
   - Warning modal about lost passphrase = lost data

**Week 2: Core UI & Navigation**

1. Set Up Design System
   - Configure Tailwind CSS with custom colors (see tech spec 2.00D3 for palette)
   - Create base component library (Button, Input, Card, Modal, etc.)
   - Implement responsive breakpoints

2. Build Core Pages
   - Dashboard (report list, empty state, create new button)
   - Settings page (LLM config, cloud sync toggle, security settings)
   - Help/About page with disclaimers

3. Report List Component
   - Display encrypted report titles
   - Last modified timestamps
   - Sync status indicators
   - Action menu (Open, Duplicate, Export, Delete)

**Week 3: Report Creation Wizard**

1. Multi-Step Wizard Framework
   - Progress indicator (steps 1-4)
   - Back/Next navigation
   - Auto-save draft functionality
   - Mobile-friendly navigation (swipe gestures)

2. Step 1: Blue Book Selection
   - Category accordion (13 categories from `ssa_bluebook_adult_complete.json`)
   - Search/filter functionality
   - Multiple selection support
   - Selected listings sidebar (mobile: bottom sheet)

3. Step 2: Functional Input Collection
   - Dynamic form generation based on selected Blue Book listings
   - Map to SSA-3373 questions from schema
   - Question types: text input, textarea, scale, yes/no, checklist
   - Progressive disclosure (show 3-5 questions at a time)
   - Auto-save every 30 seconds

### Phase 2: AI Integration (Weeks 4-5)

**Week 4: LLM Service Layer**

1. Implement LLM Service
   - Create `src/services/llm/LLMService.ts` (interface provided in tech spec)
   - Implement provider adapters:
     - `GeminiProvider.ts`
     - `OpenAIProvider.ts`
     - `ClaudeProvider.ts`
   - Use prompt templates from `prompt-templates-complete.ts`

2. API Key Management
   - Secure input UI (masked field)
   - Encrypt with MEK before storing in IndexedDB
   - Test connection functionality
   - Provider selection (dropdown)

3. Cost Estimation
   - Token counting (approximate based on character count)
   - Display estimated cost before generation
   - Warning at threshold (e.g., >$0.10 per generation)

**Week 5: AI Generation UI**

1. Step 3: AI Generation View
   - Display SSA question prominently
   - Show user inputs (with edit button to go back)
   - Generate button with loading state
   - Display generated text in editable textarea
   - Character count indicator
   - Regenerate and manual edit options
   - Copy to clipboard button

2. Error Handling
   - API key invalid
   - Network errors
   - Rate limiting
   - Token limit exceeded
   - Retry logic with exponential backoff

### Phase 3: Report Completion (Week 6)

**Week 6: Review & Export**

1. Step 4: Final Review
   - Display all completed sections
   - Edit buttons for each section
   - Progress indicator (sections completed)

2. Export Options
   - Copy all to clipboard (formatted)
   - Print view (clean layout)
   - Save encrypted report to IndexedDB
   - Basic PDF export (stretch goal)

### Phase 4: Polish & Testing (Weeks 7-9)

**Week 7: Cloud Sync (Optional for MVP)**
- If time permits, implement OneDrive adapter
- Otherwise, defer to post-MVP

**Week 8: Testing & Accessibility**

1. Unit Tests
   - 80% coverage target
   - All critical paths covered

2. E2E Tests (Playwright)
   - Complete report creation flow
   - Passphrase setup
   - Offline functionality

3. Accessibility Audit
   - Run axe DevTools
   - Manual keyboard navigation testing
   - Screen reader testing (NVDA/JAWS)

**Week 9: Deployment & Documentation**

1. Deployment
   - Deploy to Vercel or Netlify
   - Configure PWA manifest
   - Set up service worker caching
   - Enable HTTPS

2. Documentation
   - User guide (how to use the app)
   - Setup instructions
   - FAQ
   - Privacy policy
   - Terms of service (with prominent disclaimers)

---

## Critical Implementation Details

### Encryption Implementation

```typescript
// Key points from EncryptionService
- Salt: 16 bytes, cryptographically random
- PBKDF2 iterations: 600,000+
- AES-256-GCM for encryption
- Unique IV per encryption operation
- Master key stored only in memory during session
```

### IndexedDB Schema

```typescript
// Three object stores:
1. 'config' - User configuration, salt, encrypted API keys
2. 'reports' - Encrypted report data with metadata
3. 'bluebook-cache' - Cached Blue Book listings for offline use
```

### Prompt Template Usage

```typescript
// Use PromptTemplateBuilder from prompt-templates-complete.ts
import { promptTemplateBuilder } from './prompt-templates-complete';

const prompt = promptTemplateBuilder.buildPrompt(
  ssaQuestion,           // From SSA-3373 schema
  bluebookListings,      // User-selected listings
  userInputs,            // Functional limitation inputs
  'claude'               // Or 'openai' or 'gemini'
);

// Send prompt to LLM provider
const response = await llmService.generate(prompt);
```

### Blue Book Data Integration

```typescript
// Blue Book categories are already structured
import bluebookData from './ssa_bluebook_adult_complete.json';

// Filter by category
const musculoskeletalListings = bluebookData.filter(
  item => item.listing_id === '1.00'
);

// Search functionality
const searchResults = bluebookData.filter(
  item => item.listing_name.toLowerCase().includes(query.toLowerCase())
);
```

---

## Design Guidelines

### Color Palette (Mobile-Optimized)

```css
:root {
  --primary: #1e40af;      /* Blue 700 - main actions */
  --primary-hover: #1e3a8a; /* Blue 800 */
  --secondary: #64748b;    /* Slate 500 - secondary actions */
  --success: #16a34a;      /* Green 600 - success states */
  --warning: #f59e0b;      /* Amber 500 - warnings */
  --error: #dc2626;        /* Red 600 - errors */
  --background: #ffffff;   /* White background */
  --surface: #f8fafc;      /* Slate 50 - cards */
  --text: #0f172a;         /* Slate 900 - primary text */
  --text-muted: #64748b;   /* Slate 500 - secondary text */
}
```

### Typography

```css
/* Mobile-optimized sizes */
H1: 1.875rem (30px) - Page titles
H2: 1.5rem (24px) - Section headers
H3: 1.25rem (20px) - Subsections
Body: 1rem (16px) - Body text
Small: 0.875rem (14px) - Helper text

/* Font stack */
font-family: Inter, system-ui, -apple-system, sans-serif;
```

### Spacing

```css
/* Mobile-friendly spacing */
xs: 0.25rem (4px)
sm: 0.5rem (8px)
md: 1rem (16px)
lg: 1.5rem (24px)
xl: 2rem (32px)

/* Touch target minimum: 44px × 44px */
```

---

## Mobile-Specific Patterns

### Navigation

```typescript
// Bottom navigation bar for mobile (< 640px)
<nav className="fixed bottom-0 left-0 right-0 bg-white border-t">
  <div className="flex justify-around p-2">
    <NavButton icon="Home" label="Reports" />
    <NavButton icon="Plus" label="New" />
    <NavButton icon="Settings" label="Settings" />
  </div>
</nav>

// Top navigation for tablet/desktop
<nav className="sticky top-0 bg-white border-b">
  <div className="max-w-7xl mx-auto px-4">
    <div className="flex justify-between items-center h-16">
      <Logo />
      <NavLinks />
    </div>
  </div>
</nav>
```

### Wizard Navigation on Mobile

```typescript
// Enable swipe gestures
import { useSwipeable } from 'react-swipeable';

const handlers = useSwipeable({
  onSwipedLeft: () => nextStep(),
  onSwipedRight: () => previousStep(),
});

<div {...handlers}>
  {/* Wizard content */}
</div>
```

### Mobile-Optimized Modals

```typescript
// Full-screen on mobile, centered on desktop
<Dialog>
  <DialogContent className="
    sm:max-w-lg 
    max-sm:min-h-screen 
    max-sm:w-full 
    max-sm:rounded-none
  ">
    {/* Modal content */}
  </DialogContent>
</Dialog>
```

---

## Essential Disclaimers (Must Include)

### In-App Disclaimer (First Launch)

```typescript
// Display as modal on first app launch
const DISCLAIMER = `
IMPORTANT NOTICE

This application is NOT affiliated with the Social Security Administration.

• This tool provides GUIDANCE ONLY and does not constitute legal or medical advice.
• You are SOLELY RESPONSIBLE for the accuracy of information submitted to the SSA.
• All data is stored ENCRYPTED on your device and (optionally) your personal cloud.
• We DO NOT HAVE ACCESS to your information.
• Always REVIEW AND VERIFY all generated content before submission.

I understand and agree to these terms.
`;
```

### Privacy Policy Key Points

- Zero-knowledge architecture
- Local-first storage
- Optional cloud sync (user's own account)
- No server-side data storage
- No analytics by default (opt-in only)

---

## Testing Requirements

### Unit Tests (80% Coverage Target)

```typescript
// Critical test coverage
✓ Encryption/decryption correctness
✓ PBKDF2 key derivation consistency
✓ IndexedDB CRUD operations
✓ LLM prompt generation
✓ Cost estimation accuracy
```

### E2E Tests (Playwright)

```typescript
// User flows to test
✓ First-time setup → passphrase → dashboard
✓ Create report → select Blue Book → enter inputs → generate AI → save
✓ Open existing report → decrypt → edit → save
✓ Offline functionality
```

### Accessibility Tests

```typescript
// Automated checks
✓ axe DevTools: 0 critical violations
✓ Lighthouse accessibility score: 100

// Manual checks
✓ Keyboard navigation (Tab, Enter, Escape)
✓ Screen reader (NVDA/JAWS)
✓ Color contrast (4.5:1 minimum)
```

---

## Performance Targets

```
Initial Load: < 3 seconds (3G connection)
Time to Interactive: < 5 seconds
Lighthouse Performance: > 90
AI Generation: 5-15 seconds (show progress)
Offline Capability: 100% for core features
```

---

## File Structure

```
ssa-form-assist/
├── public/
│   ├── data/
│   │   ├── bluebook/
│   │   │   └── (13 category JSON files)
│   │   └── ssa-3373-mapping.json
│   ├── manifest.json
│   └── icons/
├── src/
│   ├── components/
│   │   ├── ui/          (Base components: Button, Input, etc.)
│   │   ├── Dashboard/
│   │   ├── ReportWizard/
│   │   ├── Settings/
│   │   └── Auth/        (Passphrase screens)
│   ├── services/
│   │   ├── encryption/
│   │   ├── storage/
│   │   ├── llm/
│   │   └── prompts/
│   ├── data/
│   │   └── prompts/     (Import from prompt-templates-complete.ts)
│   ├── types/
│   ├── utils/
│   ├── App.tsx
│   └── main.tsx
├── tests/
│   ├── unit/
│   └── e2e/
├── package.json
├── vite.config.ts
├── tailwind.config.js
└── tsconfig.json
```

---

## Autonomous Decision-Making Guidelines

When you encounter decisions not explicitly covered in this prompt:

1. **Security**: Always choose the more secure option
2. **Privacy**: Always choose the option that keeps data local/encrypted
3. **Accessibility**: Always choose the option that improves accessibility
4. **Mobile UX**: Prioritize mobile experience over desktop
5. **Simplicity**: Choose simpler implementations over complex ones
6. **Standards**: Follow React/TypeScript best practices

**You do NOT need to ask permission for:**
- Component structure decisions
- CSS/styling choices (as long as they follow Tailwind + Radix pattern)
- Error message wording
- Loading state implementations
- Animation/transition choices (keep them subtle and respect prefers-reduced-motion)
- File organization within the specified structure

**You SHOULD surface for discussion:**
- Changes to encryption algorithms or security architecture
- Changes to data models or IndexedDB schema
- Addition of third-party dependencies beyond those specified
- Changes to the core user flow (wizard steps, navigation)

---

## Success Criteria

### MVP is Complete When:

✓ User can create and save encrypted reports  
✓ User can select Blue Book listings  
✓ User can enter functional inputs  
✓ User can generate AI responses using any of 3 providers  
✓ User can edit and finalize reports  
✓ User can export reports (copy/print)  
✓ App works 100% offline  
✓ All data is encrypted at rest  
✓ Lighthouse scores: Performance >90, Accessibility 100  
✓ All critical user flows have E2E tests  
✓ Deployed and accessible via HTTPS  
✓ User documentation complete  

---

## Getting Started (First Actions)

1. **Initialize the Project**
   ```bash
   npm create vite@latest ssa-form-assist -- --template react-ts
   cd ssa-form-assist
   npm install
   ```

2. **Install Core Dependencies** (see Phase 1, Week 1 above)

3. **Set Up Project Structure**
   - Create folder structure as outlined
   - Copy `prompt-templates-complete.ts` to `src/data/prompts/`
   - Copy Blue Book data to `public/data/bluebook/`

4. **Begin Phase 1, Week 1**
   - Implement EncryptionService.ts
   - Implement IndexedDBService.ts
   - Write tests for both
   - Build passphrase UI

5. **Proceed Week by Week** following the phases outlined above

---

## Additional Notes

- **Blue Book Data**: The complete data structure is in `ssa_bluebook_adult_complete.json`. You can reference individual category URLs if you need to fetch additional details, but the core structure is already provided.

- **SSA-3373 Mapping**: The schema files provide the complete form structure. You'll need to map Blue Book listings to specific SSA questions (this mapping is conceptually described in the tech spec but needs to be implemented based on the functional domains).

- **Prompt Templates**: The complete prompt template system is already implemented in `prompt-templates-complete.ts`. Import and use the `PromptTemplateBuilder` class.

- **Mobile-First**: Always start by designing for mobile (< 640px), then enhance for larger screens. Test on actual mobile devices or Chrome DevTools mobile emulation.

- **Offline-First**: Service worker should cache all static assets. IndexedDB provides offline storage for user data.

---

## Final Reminders

1. **Security is paramount** - Never compromise on encryption or data protection
2. **Mobile is the primary platform** - Desktop is a bonus
3. **Accessibility is required** - Not optional
4. **Test continuously** - Don't wait until the end
5. **Document as you go** - Especially security-critical code

**You have everything you need to build this application autonomously. Trust the specifications, follow the phases, and make reasonable decisions when needed. Good luck!**
