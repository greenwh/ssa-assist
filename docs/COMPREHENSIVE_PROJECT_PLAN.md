# SSA Form-Assist: Comprehensive Project Plan
**Version:** 1.0  
**Date:** November 5, 2025  
**Status:** Planning Phase

---

## Executive Summary

This document provides a complete roadmap for developing SSA Form-Assist, a Progressive Web Application that helps individuals complete the SSA Adult Function Report (Form SSA-3373) using AI assistance while maintaining HIPAA-level security through local-first, encrypted data storage.

**Timeline:** 13 weeks to production-ready MVP  
**Team Size:** 1 full-time developer (or autonomous agent)  
**Key Risk:** Blue Book data acquisition and legal compliance

---

## Table of Contents

1. [Project Documents Overview](#project-documents-overview)
2. [Missing Components & Deliverables](#missing-components--deliverables)
3. [Phase-by-Phase Implementation Plan](#phase-by-phase-implementation-plan)
4. [Document Creation Checklist](#document-creation-checklist)
5. [Quality Gates & Success Criteria](#quality-gates--success-criteria)
6. [Risk Management](#risk-management)
7. [Post-Launch Roadmap](#post-launch-roadmap)

---

## Project Documents Overview

### Existing Documents ✅
- **Technical Specification** (`ssa_tech_spec.md`) - Architecture, security, data models
- **Prompt Templates** (`prompt-templates-complete.ts`) - Complete AI prompt engineering system

### Required Documents 📋
*Listed in priority order for development*

---

## Missing Components & Deliverables

### Priority 1: Core Data Requirements (Week 1)

#### 1.1 Blue Book Data Files
**Location:** `/public/data/bluebook/`

**Deliverables:**
- `index.json` - Master listing index
- `version.json` - SSA Blue Book version tracking
- `categories/1.00-musculoskeletal.json` (MVP)
- `categories/12.00-mental-disorders.json` (MVP)
- `categories/3.00-respiratory.json` (MVP)

**Structure per file:**
```json
{
  "category": "1.00",
  "title": "Musculoskeletal System",
  "version": "2024-Q4",
  "lastUpdated": "2024-10-15",
  "listings": [
    {
      "listingId": "1.02",
      "title": "Major dysfunction of a joint",
      "fullCitation": "20 CFR 404, Subpart P, Appendix 1, Section 1.02",
      "criteria": [
        {
          "letter": "A",
          "description": "Chronic joint pain and stiffness with...",
          "medicalFindings": [
            "Imaging showing joint space narrowing",
            "Documented range of motion limitations"
          ],
          "functionalLoss": [
            {
              "domain": "physical",
              "specificLimitation": "inability to ambulate effectively",
              "severity": "marked"
            }
          ]
        }
      ],
      "functionalMapping": [
        {
          "ssaQuestionId": "Q8-walking",
          "relevantCriteria": ["A"],
          "keyPhrases": [
            "cannot walk without assistive device",
            "limited to X feet before rest required",
            "cannot climb stairs"
          ]
        }
      ],
      "comorbidityTags": ["mobility", "pain", "lower-extremity"],
      "lastUpdated": "2024-10-15"
    }
  ]
}
```

**Data Source:** 
- Official SSA Blue Book: https://www.ssa.gov/disability/professionals/bluebook/
- Requires manual extraction and structuring
- **Estimated Effort:** 40-60 hours for 3 categories

#### 1.2 SSA-3373 Form Structure
**Location:** `/public/data/ssa-3373-mapping.json`

**Deliverable:**
Complete question mapping for all 15 sections of Form SSA-3373

```json
{
  "formVersion": "SSA-3373-BK (08-2016)",
  "totalSections": 15,
  "sections": [
    {
      "sectionNumber": "1",
      "sectionTitle": "General Information",
      "questions": []
    },
    {
      "sectionNumber": "3",
      "sectionTitle": "Information About Your Daily Activities",
      "questions": [
        {
          "questionId": "Q3-1",
          "questionText": "Describe what you do from the time you wake up until going to bed.",
          "expectationType": "narrative",
          "functionalDomain": ["daily-activities"],
          "characterLimit": 2000,
          "relevantListingCategories": ["1.00", "3.00", "12.00"],
          "promptContext": {
            "tone": "descriptive",
            "focus": ["chronological routine", "assistance needed", "rest periods"],
            "avoidances": ["diagnosis names", "speculation about improvement"]
          }
        }
      ]
    }
  ]
}
```

**Data Source:**
- Official Form SSA-3373: https://www.ssa.gov/forms/ssa-3373.pdf
- Requires manual transcription of all questions
- **Estimated Effort:** 8-12 hours

#### 1.3 Sample Test Data
**Location:** `/src/test-data/`

**Deliverables:**
- `sample-user-inputs.json` - 5-10 complete sample scenarios
- `sample-bluebook-matches.json` - Expected listing matches for each scenario
- `expected-ai-outputs.json` - Target outputs for testing

---

### Priority 2: Technical Setup Documents (Week 1)

#### 2.1 Development Environment Setup
**File:** `SETUP.md`

**Contents:**
```markdown
# Development Environment Setup

## Prerequisites
- Node.js 18+ (LTS)
- npm 9+ or yarn 1.22+
- Git
- Modern browser (Chrome/Edge/Firefox latest)

## Initial Setup

### 1. Clone and Install
```bash
git clone <repository-url>
cd ssa-form-assist
npm install
```

### 2. Environment Variables
Copy `.env.example` to `.env.local`:
```bash
cp .env.example .env.local
```

Required variables:
- `VITE_APP_VERSION` - App version (auto from package.json)
- `VITE_ONEDRIVE_CLIENT_ID` - Microsoft Azure app ID (optional for MVP)
- `VITE_ENABLE_ANALYTICS` - true/false
- `VITE_SENTRY_DSN` - Error tracking (production only)

### 3. Run Development Server
```bash
npm run dev
```

Visit http://localhost:5173

### 4. Run Tests
```bash
npm test                 # Unit tests
npm run test:e2e        # End-to-end tests
npm run test:coverage   # Coverage report
```

## Project Structure
[Detailed directory tree]

## Common Issues
[Troubleshooting guide]
```

#### 2.2 Configuration Files
**Files to create:**

**`package.json`**
```json
{
  "name": "ssa-form-assist",
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "preview": "vite preview",
    "test": "vitest",
    "test:e2e": "playwright test",
    "lint": "eslint . --ext ts,tsx --report-unused-disable-directives --max-warnings 0",
    "type-check": "tsc --noEmit"
  },
  "dependencies": {
    "react": "^18.3.1",
    "react-dom": "^18.3.1",
    "zustand": "^4.5.0",
    "idb": "^8.0.0",
    "@radix-ui/react-dialog": "^1.0.5",
    "@radix-ui/react-select": "^2.0.0",
    "@radix-ui/react-tabs": "^1.0.4",
    "lucide-react": "^0.344.0",
    "clsx": "^2.1.0",
    "tailwind-merge": "^2.2.1"
  },
  "devDependencies": {
    "@types/react": "^18.3.0",
    "@types/react-dom": "^18.3.0",
    "@typescript-eslint/eslint-plugin": "^7.0.0",
    "@typescript-eslint/parser": "^7.0.0",
    "@vitejs/plugin-react": "^4.2.1",
    "autoprefixer": "^10.4.18",
    "eslint": "^8.57.0",
    "eslint-plugin-react-hooks": "^4.6.0",
    "eslint-plugin-react-refresh": "^0.4.5",
    "postcss": "^8.4.35",
    "tailwindcss": "^3.4.1",
    "typescript": "^5.4.2",
    "vite": "^5.1.4",
    "vite-plugin-pwa": "^0.19.0",
    "vitest": "^1.3.1",
    "workbox-window": "^7.0.0",
    "@playwright/test": "^1.42.0"
  }
}
```

**`tsconfig.json`**
```json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    "noUncheckedIndexedAccess": true,
    "noImplicitReturns": true,
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": ["src"],
  "references": [{ "path": "./tsconfig.node.json" }]
}
```

**`.env.example`**
```bash
# Application
VITE_APP_NAME="SSA Form-Assist"
VITE_APP_VERSION="1.0.0"

# Features
VITE_ENABLE_CLOUD_SYNC=false
VITE_ENABLE_ANALYTICS=false

# Cloud Integration (Optional)
VITE_ONEDRIVE_CLIENT_ID=
VITE_GOOGLE_DRIVE_CLIENT_ID=

# Monitoring (Production)
VITE_SENTRY_DSN=

# LLM Defaults (User can override)
VITE_DEFAULT_LLM_PROVIDER=gemini
```

**`vite.config.ts`**
```typescript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';
import path from 'path';

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'robots.txt', 'apple-touch-icon.png'],
      manifest: {
        name: 'SSA Form-Assist',
        short_name: 'SSA Assist',
        description: 'AI-assisted SSA Adult Function Report completion',
        theme_color: '#1e40af',
        background_color: '#ffffff',
        display: 'standalone',
        icons: [
          {
            src: '/icon-192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: '/icon-512.png',
            sizes: '512x512',
            type: 'image/png'
          }
        ]
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,json}'],
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/api\./i,
            handler: 'NetworkFirst',
            options: {
              cacheName: 'api-cache',
              expiration: {
                maxEntries: 10,
                maxAgeSeconds: 60 * 60 // 1 hour
              }
            }
          }
        ]
      }
    })
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  },
  build: {
    target: 'esnext',
    minify: 'terser',
    sourcemap: true
  }
});
```

---

### Priority 3: UI/UX Specifications (Week 1-2)

#### 3.1 Component Architecture
**File:** `UI_SPECIFICATIONS.md`

**Contents:**
```markdown
# UI Specifications

## Component Hierarchy

### App Structure
```
App
├── Router
│   ├── LoginPage (Passphrase Entry)
│   ├── DashboardPage
│   │   ├── ReportList
│   │   └── CreateReportButton
│   ├── ReportWizardPage
│   │   ├── WizardProgress
│   │   ├── BlueBookSelector
│   │   ├── FunctionalInputForms
│   │   ├── AIGenerationView
│   │   └── ExportOptions
│   ├── SettingsPage
│   │   ├── LLMConfiguration
│   │   ├── CloudSyncSettings
│   │   └── SecuritySettings
│   └── HelpPage
└── GlobalComponents
    ├── Header
    ├── ErrorBoundary
    └── ToastNotifications
```

## Page Specifications

### 1. Login/Passphrase Page
**Route:** `/`
**Purpose:** Passphrase entry or first-time setup

**Layout:**
- Centered card (max-w-md)
- App logo and name
- Passphrase input field (password type)
- "Unlock" button
- "First time? Set up encryption" link

**First-Time Setup Flow:**
1. Welcome screen with explanation
2. Passphrase creation (min 12 chars, strength indicator)
3. Passphrase confirmation
4. Recovery warning modal
5. Auto-login after setup

**States:**
- Initial (empty)
- Validating (loading spinner)
- Error (invalid passphrase, shake animation)
- Success (transition to dashboard)

**Accessibility:**
- Auto-focus on passphrase field
- Enter key submits form
- Screen reader announcements for errors
- High contrast support

---

### 2. Dashboard Page
**Route:** `/dashboard`
**Purpose:** View and manage reports

**Layout:**
```
+--------------------------------------------------+
| Header: "My Reports" | [New Report] [Settings]   |
+--------------------------------------------------+
| Search/Filter Bar                                 |
+--------------------------------------------------+
| Report Cards Grid (3 columns on desktop)          |
| +-------------+  +-------------+  +-------------+ |
| | Report 1    |  | Report 2    |  | Report 3    | |
| | Date: X     |  | Date: Y     |  | Date: Z     | |
| | Status: ✓   |  | Status: ⟳   |  | Status: ⚠   | |
| | [Open][⋮]   |  | [Open][⋮]   |  | [Open][⋮]   | |
| +-------------+  +-------------+  +-------------+ |
+--------------------------------------------------+
```

**Report Card Details:**
- Title (user-editable or auto: "Report - Date")
- Last modified timestamp
- Sync status icon (synced/pending/conflict)
- Progress indicator (0-100%)
- Action menu (Open, Duplicate, Export, Delete)

**Empty State:**
- Illustration
- "No reports yet"
- Large "Create Your First Report" button

---

### 3. Report Wizard Page
**Route:** `/report/:id`
**Purpose:** Step-by-step report creation

**Wizard Steps:**
1. Blue Book Selection
2. Functional Inputs Collection
3. AI Generation & Review
4. Final Review & Export

**Layout:**
```
+--------------------------------------------------+
| Progress: [1●]━━[2○]━━[3○]━━[4○]                 |
+--------------------------------------------------+
| [< Back]              Step Title        [Next >] |
+--------------------------------------------------+
|                                                   |
|              Step Content Area                    |
|                                                   |
+--------------------------------------------------+
| [Save Draft]                         [Next Step] |
+--------------------------------------------------+
```

#### Step 1: Blue Book Selection
**Purpose:** User selects relevant disability listings

**Components:**
- Search bar (filters listings by keyword)
- Category accordion (13 categories)
- Listing cards with:
  - Listing ID and title
  - Brief description
  - Checkbox for selection
- "Selected Listings" sidebar (mobile: bottom sheet)
- Helper text explaining multiple selections

#### Step 2: Functional Inputs
**Purpose:** Collect user's functional limitation details

**Dynamic Form Generation:**
- Questions generated based on selected Blue Book listings
- Question types:
  - Text input (short answer)
  - Textarea (long answer)
  - Scale (1-5 severity)
  - Yes/No radio
  - Checklist

**Example Questions:**
- "How far can you walk before needing to rest?"
- "How long can you stand in one place?"
- "Describe your typical daily routine"
- "What assistive devices do you use?"

**Progressive Disclosure:**
- Show 3-5 questions at a time
- "Add More Details" expands additional questions
- Auto-save every 30 seconds

#### Step 3: AI Generation
**Purpose:** Generate SSA-appropriate text using AI

**Layout:**
```
+--------------------------------------------------+
| SSA Question:                                     |
| "Describe what you do from the time you wake up  |
|  until going to bed."                            |
+--------------------------------------------------+
| Your Inputs:                                      |
| • Walking distance: 100 feet                      |
| • Standing time: 10 minutes                       |
| • Assistance: Wife helps with dressing            |
| • [Edit Inputs]                                   |
+--------------------------------------------------+
| Generated Response:                               |
| +----------------------------------------------+ |
| | [Generated text appears here]                | |
| | [Editable textarea]                          | |
| +----------------------------------------------+ |
| Characters: 245 / 1000                           |
+--------------------------------------------------+
| [Regenerate] [Accept] [Edit Manually]            |
+--------------------------------------------------+
```

**States:**
- Pre-generation (button to generate)
- Generating (loading animation, "Generating response...")
- Complete (editable text)
- Error (retry button with error message)

**Features:**
- Copy to clipboard button
- Regenerate with same inputs
- Manual editing with auto-save
- Character count with warning at 90%

#### Step 4: Final Review
**Purpose:** Review all generated sections before export

**Layout:**
- All SSA questions with generated answers
- Edit buttons for each section
- Export options:
  - Copy all to clipboard
  - Download as PDF
  - Print view
  - Save to cloud (if configured)

---

### 4. Settings Page
**Route:** `/settings`
**Purpose:** Configure app preferences

**Tabs:**
1. **LLM Configuration**
   - Provider selection (Gemini/OpenAI/Claude)
   - API key input (masked)
   - Test connection button
   - Cost estimate toggle

2. **Cloud Sync**
   - Enable/disable toggle
   - Provider selection (OneDrive/Google Drive)
   - Authentication status
   - Last sync timestamp
   - Manual sync button

3. **Security**
   - Change passphrase
   - Auto-lock timeout (5/15/30/60 min)
   - Export recovery key
   - Clear all data (danger zone)

4. **Accessibility**
   - High contrast mode toggle
   - Font size adjustment
   - Keyboard shortcuts help

---

## Design System

### Colors
```css
:root {
  --primary: #1e40af;      /* Blue 700 */
  --primary-hover: #1e3a8a; /* Blue 800 */
  --secondary: #64748b;    /* Slate 500 */
  --success: #16a34a;      /* Green 600 */
  --warning: #f59e0b;      /* Amber 500 */
  --error: #dc2626;        /* Red 600 */
  --background: #ffffff;
  --surface: #f8fafc;      /* Slate 50 */
  --text: #0f172a;         /* Slate 900 */
  --text-muted: #64748b;   /* Slate 500 */
}

/* Dark mode support */
@media (prefers-color-scheme: dark) {
  :root {
    --background: #0f172a;
    --surface: #1e293b;
    --text: #f8fafc;
  }
}
```

### Typography
- **Headings:** Inter, system-ui
- **Body:** Inter, system-ui
- **Monospace:** 'JetBrains Mono', monospace

**Scale:**
- H1: 2.25rem (36px)
- H2: 1.875rem (30px)
- H3: 1.5rem (24px)
- Body: 1rem (16px)
- Small: 0.875rem (14px)

### Spacing
- xs: 0.25rem (4px)
- sm: 0.5rem (8px)
- md: 1rem (16px)
- lg: 1.5rem (24px)
- xl: 2rem (32px)

### Component Library
Using **Radix UI** primitives + **Tailwind CSS**

**Example Button Component:**
```tsx
<Button 
  variant="primary" | "secondary" | "ghost" | "danger"
  size="sm" | "md" | "lg"
  loading={boolean}
  disabled={boolean}
>
  Click Me
</Button>
```

---

## Responsive Breakpoints

- **Mobile:** < 640px (1 column)
- **Tablet:** 640-1024px (2 columns)
- **Desktop:** > 1024px (3 columns)

### Mobile Considerations
- Bottom navigation for main actions
- Swipe gestures for wizard navigation
- Touch-friendly targets (44px minimum)
- Reduced motion option

---

## Accessibility Requirements (WCAG 2.1 AA)

### Keyboard Navigation
- Tab order follows visual flow
- Focus indicators (2px solid outline)
- Skip to main content link
- Escape closes modals/menus

### Screen Reader Support
- Semantic HTML (nav, main, article)
- ARIA labels on icon buttons
- Live regions for dynamic content
- Form field associations (label + input)

### Visual
- Color contrast ratio ≥ 4.5:1
- Focus indicators visible
- No content relies solely on color
- Text resizable to 200%

### Testing Tools
- Chrome Lighthouse
- axe DevTools
- NVDA/JAWS screen readers
- Keyboard-only navigation testing

---

## Loading States & Animations

### Loading Indicators
- Skeleton screens for content loading
- Spinner for quick actions (< 2 seconds)
- Progress bar for long operations (AI generation)

### Transitions
- Page transitions: 150ms ease-in-out
- Modal entrance: 200ms slide-up
- Hover effects: 100ms
- Respect `prefers-reduced-motion`

---

## Error Handling UI

### Toast Notifications
- Success: Green, 3 seconds auto-dismiss
- Warning: Yellow, 5 seconds
- Error: Red, manual dismiss
- Position: Top-right (desktop), bottom (mobile)

### Inline Errors
- Form validation: Red text below field
- API errors: Alert banner with retry button
- Network offline: Persistent banner "You're offline. Changes saved locally."

### Error Boundaries
- Component-level error boundaries
- Fallback UI with "Report Bug" button
- Automatic error logging to Sentry (production)

```

---

### Priority 4: Implementation Starter Code (Week 2)

#### 4.1 Core Encryption Module
**File:** `src/services/encryption/EncryptionService.ts`

```typescript
/**
 * Encryption Service
 * Handles all cryptographic operations using Web Crypto API
 * Implements AES-256-GCM with PBKDF2 key derivation
 */

export class EncryptionService {
  private static readonly ITERATIONS = 600000;
  private static readonly SALT_LENGTH = 16;
  private static readonly KEY_LENGTH = 256;
  private static readonly IV_LENGTH = 12;

  private masterKey: CryptoKey | null = null;

  /**
   * Generate a cryptographically random salt
   */
  async generateSalt(): Promise<Uint8Array> {
    return crypto.getRandomValues(new Uint8Array(EncryptionService.SALT_LENGTH));
  }

  /**
   * Derive encryption key from passphrase using PBKDF2
   */
  async deriveKey(
    passphrase: string,
    salt: Uint8Array
  ): Promise<CryptoKey> {
    const passphraseKey = await crypto.subtle.importKey(
      'raw',
      new TextEncoder().encode(passphrase),
      'PBKDF2',
      false,
      ['deriveBits', 'deriveKey']
    );

    return crypto.subtle.deriveKey(
      {
        name: 'PBKDF2',
        salt,
        iterations: EncryptionService.ITERATIONS,
        hash: 'SHA-256'
      },
      passphraseKey,
      { name: 'AES-GCM', length: EncryptionService.KEY_LENGTH },
      false,
      ['encrypt', 'decrypt']
    );
  }

  /**
   * Encrypt data using AES-256-GCM
   */
  async encrypt(
    plaintext: string,
    key: CryptoKey
  ): Promise<{ ciphertext: string; iv: string }> {
    const iv = crypto.getRandomValues(new Uint8Array(EncryptionService.IV_LENGTH));
    const encoded = new TextEncoder().encode(plaintext);

    const ciphertext = await crypto.subtle.encrypt(
      { name: 'AES-GCM', iv },
      key,
      encoded
    );

    return {
      ciphertext: this.bufferToBase64(ciphertext),
      iv: this.bufferToBase64(iv)
    };
  }

  /**
   * Decrypt data using AES-256-GCM
   */
  async decrypt(
    ciphertext: string,
    iv: string,
    key: CryptoKey
  ): Promise<string> {
    const ciphertextBuffer = this.base64ToBuffer(ciphertext);
    const ivBuffer = this.base64ToBuffer(iv);

    const plaintext = await crypto.subtle.decrypt(
      { name: 'AES-GCM', iv: ivBuffer },
      key,
      ciphertextBuffer
    );

    return new TextDecoder().decode(plaintext);
  }

  /**
   * Set the master encryption key for the session
   */
  setMasterKey(key: CryptoKey): void {
    this.masterKey = key;
  }

  /**
   * Get the master encryption key
   */
  getMasterKey(): CryptoKey {
    if (!this.masterKey) {
      throw new Error('Master key not initialized. User must unlock first.');
    }
    return this.masterKey;
  }

  /**
   * Clear master key from memory (logout)
   */
  clearMasterKey(): void {
    this.masterKey = null;
  }

  // Utility methods
  private bufferToBase64(buffer: ArrayBuffer): string {
    const bytes = new Uint8Array(buffer);
    let binary = '';
    for (let i = 0; i < bytes.length; i++) {
      binary += String.fromCharCode(bytes[i]!);
    }
    return btoa(binary);
  }

  private base64ToBuffer(base64: string): ArrayBuffer {
    const binary = atob(base64);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
      bytes[i] = binary.charCodeAt(i);
    }
    return bytes.buffer;
  }
}

export const encryptionService = new EncryptionService();
```

#### 4.2 IndexedDB Service
**File:** `src/services/storage/IndexedDBService.ts`

```typescript
import { openDB, DBSchema, IDBPDatabase } from 'idb';

interface SSAFormAssistDB extends DBSchema {
  config: {
    key: string;
    value: {
      id: string;
      salt: Uint8Array;
      selectedLLM: 'gemini' | 'openai' | 'claude';
      encryptedAPIKeys: string;
      encryptedCloudConfig: string;
      lastModified: number;
    };
  };
  reports: {
    key: string;
    value: {
      id: string;
      encryptedData: string;
      title: string; // encrypted
      lastModified: number;
      lastSyncTimestamp: number | null;
      syncStatus: 'synced' | 'pending' | 'conflict';
    };
  };
  'bluebook-cache': {
    key: string;
    value: {
      listingId: string;
      category: string;
      title: string;
      criteria: any;
      functionalDomains: string[];
      keywords: string[];
      version: string;
    };
  };
}

export class IndexedDBService {
  private db: IDBPDatabase<SSAFormAssistDB> | null = null;

  async initialize(): Promise<void> {
    this.db = await openDB<SSAFormAssistDB>('SSAFormAssist', 1, {
      upgrade(db) {
        // Config store
        if (!db.objectStoreNames.contains('config')) {
          db.createObjectStore('config', { keyPath: 'id' });
        }

        // Reports store
        if (!db.objectStoreNames.contains('reports')) {
          const reportStore = db.createObjectStore('reports', { keyPath: 'id' });
          reportStore.createIndex('lastModified', 'lastModified');
          reportStore.createIndex('syncStatus', 'syncStatus');
        }

        // Blue Book cache
        if (!db.objectStoreNames.contains('bluebook-cache')) {
          const blueBookStore = db.createObjectStore('bluebook-cache', {
            keyPath: 'listingId'
          });
          blueBookStore.createIndex('category', 'category');
        }
      }
    });
  }

  // Config operations
  async getConfig(): Promise<SSAFormAssistDB['config']['value'] | undefined> {
    return this.db!.get('config', 'user-config');
  }

  async setConfig(config: SSAFormAssistDB['config']['value']): Promise<void> {
    await this.db!.put('config', config);
  }

  // Report operations
  async getAllReports(): Promise<SSAFormAssistDB['reports']['value'][]> {
    return this.db!.getAll('reports');
  }

  async getReport(id: string): Promise<SSAFormAssistDB['reports']['value'] | undefined> {
    return this.db!.get('reports', id);
  }

  async saveReport(report: SSAFormAssistDB['reports']['value']): Promise<void> {
    await this.db!.put('reports', report);
  }

  async deleteReport(id: string): Promise<void> {
    await this.db!.delete('reports', id);
  }

  // Blue Book cache operations
  async cacheBlueBookListing(
    listing: SSAFormAssistDB['bluebook-cache']['value']
  ): Promise<void> {
    await this.db!.put('bluebook-cache', listing);
  }

  async getBlueBookListing(
    listingId: string
  ): Promise<SSAFormAssistDB['bluebook-cache']['value'] | undefined> {
    return this.db!.get('bluebook-cache', listingId);
  }

  async searchBlueBookByCategory(
    category: string
  ): Promise<SSAFormAssistDB['bluebook-cache']['value'][]> {
    return this.db!.getAllFromIndex('bluebook-cache', 'category', category);
  }
}

export const indexedDBService = new IndexedDBService();
```

#### 4.3 LLM Service Interface
**File:** `src/services/llm/LLMService.ts`

```typescript
export interface LLMProvider {
  name: 'claude' | 'openai' | 'gemini';
  generateResponse(prompt: string, maxTokens?: number): Promise<string>;
  validateAPIKey(apiKey: string): Promise<boolean>;
  estimateCost(inputTokens: number, outputTokens: number): number;
}

export interface LLMServiceConfig {
  provider: 'claude' | 'openai' | 'gemini';
  apiKey: string;
}

export class LLMService {
  private providers: Map<string, LLMProvider>;
  private currentProvider: LLMProvider | null = null;

  constructor() {
    this.providers = new Map();
    // Providers will be registered dynamically
  }

  registerProvider(provider: LLMProvider): void {
    this.providers.set(provider.name, provider);
  }

  setProvider(name: string, apiKey: string): void {
    const provider = this.providers.get(name);
    if (!provider) {
      throw new Error(`Provider ${name} not registered`);
    }
    this.currentProvider = provider;
    // Store API key securely (implementation specific)
  }

  async generate(prompt: string, maxTokens: number = 500): Promise<string> {
    if (!this.currentProvider) {
      throw new Error('No LLM provider configured');
    }
    return this.currentProvider.generateResponse(prompt, maxTokens);
  }

  async validateKey(provider: string, apiKey: string): Promise<boolean> {
    const providerInstance = this.providers.get(provider);
    if (!providerInstance) {
      throw new Error(`Provider ${provider} not found`);
    }
    return providerInstance.validateAPIKey(apiKey);
  }
}

export const llmService = new LLMService();
```

---

### Priority 5: Legal & Compliance (Week 2)

#### 5.1 Privacy Policy
**File:** `PRIVACY_POLICY.md`

```markdown
# Privacy Policy
**Effective Date:** [Date]

## Overview
SSA Form-Assist is a local-first Progressive Web Application designed with privacy as a core principle.

## Data We Do NOT Collect
- Personal health information
- Disability details
- Form responses
- User identities
- Usage analytics (unless explicitly opted in)

## Data Storage
- **Location:** All data is stored locally on your device in encrypted format
- **Encryption:** AES-256-GCM encryption with PBKDF2 key derivation
- **Passphrase:** Only you know your passphrase; we cannot recover it

## Optional Cloud Sync
- If you enable cloud synchronization, encrypted files are stored in YOUR personal cloud account (OneDrive/Google Drive)
- We have no access to your cloud accounts or files
- You can disable sync at any time

## LLM API Keys
- API keys you provide are encrypted and stored locally
- API calls to OpenAI/Anthropic/Google are made directly from your browser
- We do not intercept or log these communications

## Analytics (Optional)
- If enabled, we collect anonymous usage data via Plausible Analytics
- No cookies, no personal data, GDPR compliant
- You can opt out at any time

## Third-Party Services
When you use this application, you may interact with:
- **LLM Providers:** OpenAI, Anthropic, Google (see their privacy policies)
- **Cloud Storage:** Microsoft OneDrive, Google Drive (see their privacy policies)

## Your Rights
- Delete all your data at any time (Settings > Clear All Data)
- Export your data in plain text
- Use the app completely offline with no external services

## Contact
For privacy concerns: [email]

## Changes
We will notify users of material changes to this policy via in-app notification.
```

#### 5.2 Terms of Service
**File:** `TERMS_OF_SERVICE.md`

```markdown
# Terms of Service

## Disclaimer
**IMPORTANT NOTICE:**

1. **Not Affiliated with SSA:** This application is NOT affiliated with, endorsed by, or connected to the Social Security Administration.

2. **Not Legal or Medical Advice:** This tool provides guidance only and does not constitute legal, medical, or professional advice.

3. **User Responsibility:** You are solely responsible for the accuracy and completeness of information submitted to the SSA. Always review generated content carefully.

4. **No Guarantees:** Use of this tool does not guarantee approval of your disability claim or any specific outcome.

5. **No Warranty:** This software is provided "as is" without warranty of any kind.

## Acceptable Use
You may use this application only for:
- Personal, non-commercial purposes
- Completing your own SSA Adult Function Report
- Legal and ethical purposes

You may NOT:
- Use this for fraudulent purposes
- Submit false or misleading information to the SSA
- Reverse engineer or redistribute this application

## Data Responsibility
- You are responsible for maintaining your passphrase
- Lost passphrases cannot be recovered
- We recommend exporting backups of important reports

## Limitation of Liability
In no event shall the creators be liable for any damages arising from use of this application.

## Changes to Terms
We reserve the right to modify these terms. Continued use constitutes acceptance.
```

#### 5.3 In-App Disclaimer
**File:** `src/components/DisclaimerModal.tsx`

```typescript
// Display on first launch and accessible from Help menu
export const DisclaimerModal: React.FC = () => {
  return (
    <Modal>
      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-red-600">Important Notice</h2>
        
        <div className="bg-yellow-50 border border-yellow-200 p-4 rounded">
          <p className="font-semibold">This application is NOT affiliated with the Social Security Administration.</p>
        </div>

        <div className="space-y-2">
          <p>• This tool provides <strong>guidance only</strong> and does not constitute legal or medical advice.</p>
          <p>• You are <strong>solely responsible</strong> for the accuracy of information submitted to the SSA.</p>
          <p>• All data is stored <strong>encrypted on your device</strong> and (optionally) your personal cloud.</p>
          <p>• We <strong>do not have access</strong> to your information.</p>
          <p>• Always <strong>review and verify</strong> all generated content before submission.</p>
        </div>

        <div className="flex items-center gap-2">
          <input type="checkbox" id="understand" required />
          <label htmlFor="understand">I understand and agree to these terms</label>
        </div>

        <button disabled={!checked}>Continue</button>
      </div>
    </Modal>
  );
};
```

---

### Priority 6: Testing Specifications (Week 3)

#### 6.1 Test Plan Document
**File:** `TEST_PLAN.md`

```markdown
# Test Plan

## Unit Tests (Target: 80% coverage)

### Encryption Module
- ✅ Key derivation produces consistent results
- ✅ Encryption/decryption round-trip succeeds
- ✅ Different IVs produce different ciphertexts
- ✅ Wrong key fails decryption
- ✅ Corrupted ciphertext fails decryption

### IndexedDB Service
- ✅ Database initializes correctly
- ✅ CRUD operations on reports
- ✅ Config storage and retrieval
- ✅ Blue Book cache operations
- ✅ Index queries work correctly

### Prompt Template Builder
- ✅ Selects correct template for domain
- ✅ Formats Blue Book criteria correctly
- ✅ Includes relevant examples
- ✅ Applies provider-specific adjustments
- ✅ Validates character limits

### LLM Service
- ✅ Provider registration
- ✅ API key validation (mocked)
- ✅ Cost estimation accuracy
- ✅ Error handling for failed API calls

## Integration Tests

### End-to-End User Flows
1. **First-Time Setup**
   - User sets passphrase
   - Encryption key is derived and stored
   - User is redirected to dashboard

2. **Report Creation**
   - User creates new report
   - Selects Blue Book listings
   - Enters functional inputs
   - Generates AI response
   - Saves report (encrypted)

3. **Report Editing**
   - User opens existing report
   - Decryption succeeds
   - User edits content
   - Changes are saved
   - Report list updates

4. **Cloud Sync**
   - User enables OneDrive sync
   - Authentication flow completes
   - Report uploads successfully
   - Sync status updates

5. **Offline -> Online**
   - User makes changes while offline
   - Network reconnects
   - Changes sync automatically

## Security Tests

### Penetration Testing
- ✅ IndexedDB contains only encrypted data
- ✅ No plaintext in localStorage or sessionStorage
- ✅ No sensitive data in console logs
- ✅ No sensitive data in network requests (except to LLM APIs)
- ✅ Service Worker doesn't cache sensitive data

### XSS/CSRF Tests
- ✅ User inputs are sanitized
- ✅ HTML injection blocked
- ✅ Script injection blocked
- ✅ CSRF tokens not needed (no server-side state)

## Accessibility Tests

### Automated Testing (axe DevTools)
- ✅ No critical accessibility violations
- ✅ Color contrast ratios pass (4.5:1 minimum)
- ✅ All interactive elements keyboard accessible
- ✅ Form fields have labels

### Manual Testing
- ✅ Tab navigation follows logical order
- ✅ Focus indicators visible
- ✅ Screen reader announces all content correctly (NVDA/JAWS)
- ✅ All functionality available without mouse

## Performance Tests

### Lighthouse Scores (Targets)
- Performance: > 90
- Accessibility: 100
- Best Practices: 100
- SEO: > 90
- PWA: ✅ Installable

### Specific Metrics
- ✅ First Contentful Paint < 1.5s
- ✅ Largest Contentful Paint < 2.5s
- ✅ Time to Interactive < 3.5s
- ✅ Cumulative Layout Shift < 0.1

### Encryption Performance
- ✅ Key derivation: < 2 seconds
- ✅ Report encryption: < 100ms
- ✅ Report decryption: < 50ms

## Cross-Browser Testing

### Desktop
- ✅ Chrome (latest)
- ✅ Firefox (latest)
- ✅ Safari (latest)
- ✅ Edge (latest)

### Mobile
- ✅ Chrome Android (latest)
- ✅ Safari iOS (latest)

### PWA Installation
- ✅ Installable on Android
- ✅ Installable on iOS
- ✅ Installable on Desktop (Chrome/Edge)

## Test Data Sets

### Sample User Scenarios
1. **Musculoskeletal (Spine):**
   - Walking: 50 feet
   - Standing: 10 minutes
   - Sitting: 20 minutes
   - Lifting: 5 lbs max

2. **Mental Health (Depression):**
   - Sleep: 14-16 hours/day
   - Social: No contact for 3 months
   - Hygiene: 2-3x/week
   - Concentration: 5-10 minutes

3. **Respiratory (COPD):**
   - Walking: 20-30 feet
   - Oxygen: 24/7
   - Attacks: 2-3x/week
   - ER visits: Monthly

## Regression Testing
- Run full test suite before each release
- Critical path tests run on every PR
- Visual regression testing (Percy/Chromatic)

## Test Automation
```yaml
# .github/workflows/test.yml
name: Test Suite
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: npm ci
      - run: npm test
      - run: npm run test:e2e
      - run: npm run lint
      - run: npm run type-check
```
```

---

## Phase-by-Phase Implementation Plan

### Week 1: Foundation & Data Preparation
**Goal:** Working encrypted storage and Blue Book data

**Deliverables:**
- [ ] Complete Blue Book data extraction (3 categories minimum)
- [ ] Complete SSA-3373 question mapping
- [ ] Project setup (all config files)
- [ ] Encryption service with tests
- [ ] IndexedDB service with tests
- [ ] Passphrase UI (setup + unlock)

**Success Criteria:**
- User can create passphrase
- Data encrypts/decrypts correctly
- Blue Book data loads from static files

---

### Week 2: Core UI & Data Flow
**Goal:** Basic report creation without AI

**Deliverables:**
- [ ] Dashboard page (report list)
- [ ] Report wizard (steps 1-2)
- [ ] Blue Book selector component
- [ ] Functional input forms (dynamic generation)
- [ ] Manual text entry (without AI)
- [ ] Report save/load functionality

**Success Criteria:**
- User can create report
- User can select Blue Book listings
- User can enter functional inputs
- User can manually type responses
- Reports save encrypted

---

### Week 3: AI Integration
**Goal:** AI-powered text generation

**Deliverables:**
- [ ] LLM service implementation
- [ ] Gemini provider implementation
- [ ] OpenAI provider implementation
- [ ] Claude provider implementation
- [ ] API key management UI
- [ ] AI generation UI (step 3 of wizard)
- [ ] Prompt template integration

**Success Criteria:**
- User can enter API keys
- User can generate AI responses
- Generated text follows SSA format
- Cost estimation works
- User can regenerate/edit

---

### Week 4: Report Review & Export
**Goal:** Complete report creation flow

**Deliverables:**
- [ ] Final review step (step 4)
- [ ] Copy to clipboard
- [ ] Print view
- [ ] PDF export (basic)
- [ ] Report editing after creation
- [ ] Report duplication

**Success Criteria:**
- User can complete full report
- User can export in multiple formats
- User can edit existing reports
- All sections populate correctly

---

### Week 5: Cloud Sync (Optional for MVP)
**Goal:** OneDrive integration

**Deliverables:**
- [ ] OneDrive adapter implementation
- [ ] OAuth flow (MSAL.js)
- [ ] Upload encrypted reports
- [ ] Download encrypted reports
- [ ] Sync status indicators
- [ ] Conflict resolution UI

**Success Criteria:**
- User can authenticate with OneDrive
- Reports upload/download successfully
- Conflicts detected and resolved
- Offline changes sync when online

---

### Week 6: Polish & Accessibility
**Goal:** Production-ready UI

**Deliverables:**
- [ ] Complete accessibility audit
- [ ] Keyboard navigation refinement
- [ ] Screen reader testing
- [ ] High contrast mode
- [ ] Loading states and animations
- [ ] Error handling improvements
- [ ] Help documentation

**Success Criteria:**
- WCAG 2.1 AA compliance
- Lighthouse accessibility score 100
- All features keyboard accessible
- Screen reader compatible

---

### Week 7: Testing & Bug Fixes
**Goal:** Stable, tested application

**Deliverables:**
- [ ] Complete unit test suite
- [ ] E2E tests (Playwright)
- [ ] Security audit
- [ ] Performance optimization
- [ ] Cross-browser testing
- [ ] Bug fixes from testing

**Success Criteria:**
- 80% code coverage
- All critical paths tested
- No known security issues
- Lighthouse score > 90

---

### Week 8: Documentation & Deployment
**Goal:** Live application

**Deliverables:**
- [ ] User documentation
- [ ] Setup guide
- [ ] FAQ
- [ ] Privacy policy
- [ ] Terms of service
- [ ] Deployment to Vercel/Netlify
- [ ] Error monitoring (Sentry)
- [ ] Analytics (optional)

**Success Criteria:**
- App deployed and accessible
- Documentation complete
- Error tracking working
- Ready for beta users

---

### Week 9: Beta Testing
**Goal:** Real-world validation

**Deliverables:**
- [ ] Recruit 5-10 beta testers
- [ ] Collect feedback
- [ ] Bug fixes based on feedback
- [ ] Usability improvements
- [ ] Performance tuning

**Success Criteria:**
- Beta testers complete full reports
- No critical bugs
- Positive user feedback
- Performance meets targets

---

## Document Creation Checklist

### ✅ Complete
- [x] Technical Specification
- [x] Prompt Templates

### 📋 High Priority (Week 1)
- [ ] Blue Book Data Files (3 categories)
- [ ] SSA-3373 Question Mapping
- [ ] SETUP.md (Development environment)
- [ ] package.json
- [ ] tsconfig.json
- [ ] vite.config.ts
- [ ] .env.example

### 📋 Medium Priority (Week 1-2)
- [ ] UI_SPECIFICATIONS.md
- [ ] Component starter files
- [ ] Encryption service implementation
- [ ] IndexedDB service implementation
- [ ] TEST_PLAN.md

### 📋 Lower Priority (Week 2-3)
- [ ] PRIVACY_POLICY.md
- [ ] TERMS_OF_SERVICE.md
- [ ] User documentation
- [ ] API integration guides

---

## Quality Gates & Success Criteria

### Phase 1 Gate (Week 3)
**Must Pass:**
- ✅ All unit tests passing
- ✅ Encryption verified secure
- ✅ Basic report creation works
- ✅ Data persists correctly

### Phase 2 Gate (Week 6)
**Must Pass:**
- ✅ AI generation working for all 3 providers
- ✅ Full report creation flow complete
- ✅ Accessibility audit passed
- ✅ Performance targets met

### Production Gate (Week 8)
**Must Pass:**
- ✅ All tests passing (unit + E2E)
- ✅ Security audit passed
- ✅ Cross-browser testing complete
- ✅ Documentation complete
- ✅ Legal disclaimers in place

---

## Risk Management

### High Risk Items

| Risk | Impact | Mitigation |
|------|--------|------------|
| Blue Book data extraction labor-intensive | **Critical** | Start early, use OCR tools, consider hiring help |
| User forgets passphrase → data loss | **Critical** | Clear warnings, recovery key export option |
| LLM API costs unexpected | **High** | Token limits, cost warnings, local caching |
| Accessibility gaps | **High** | Early testing, use accessible component library |
| Browser compatibility issues | **Medium** | Progressive enhancement, polyfills |

### Mitigation Strategies

1. **Blue Book Data:**
   - Start with 3 most common categories
   - Use AI to help structure extraction
   - Verify against official sources
   - Plan for incremental additions

2. **Passphrase Recovery:**
   - Implement encrypted recovery key export
   - Clear setup instructions with examples
   - Warning modal before deletion
   - FAQ with passphrase guidance

3. **Cost Management:**
   - Default token limits (500-1000)
   - Cost estimation before generation
   - Cache common prompts
   - Option to use cheaper providers

---

## Post-Launch Roadmap

### Version 1.1 (Weeks 10-12)
- [ ] Complete all 13 Blue Book categories
- [ ] Google Drive sync support
- [ ] Dropbox sync support
- [ ] Advanced PDF export (fill official form)

### Version 1.2 (Weeks 13-16)
- [ ] Comorbidity logic (multiple disabilities)
- [ ] Template suggestions based on listings
- [ ] Blue Book update checker
- [ ] Batch export multiple reports

### Version 2.0 (Future)
- [ ] Mobile apps (React Native)
- [ ] Collaborative editing
- [ ] Professional assistance marketplace
- [ ] Direct SSA submission (if API available)

---

## Success Metrics

### Technical Metrics
- Lighthouse Performance > 90
- Lighthouse Accessibility = 100
- Test Coverage > 80%
- Zero critical security vulnerabilities

### User Metrics
- Report completion rate > 70%
- Average time to complete < 30 minutes
- User satisfaction (NPS) > 40
- Support request rate < 5% of users

### Business Metrics
- 1,000 reports created (Month 1)
- 5,000 reports created (Month 6)
- < $0.50 AI cost per report
- 95% uptime

---

## Resource Requirements

### Human Resources
- 1 Full-Stack Developer (13 weeks)
- OR Autonomous AI Agent with oversight

### Tools & Services (Estimated Costs)
- **Hosting:** Vercel/Netlify (Free tier adequate for MVP)
- **Error Monitoring:** Sentry (Free tier)
- **Analytics:** Plausible ($9/month, optional)
- **Testing:** Playwright (Free)
- **LLM APIs:** User-provided (BYOK model)
- **Cloud Storage:** User's own accounts

**Total Monthly Cost:** $0-20 (excluding domain)

---

## Handoff Checklist

Before handing off to autonomous agent:

### Documentation
- [x] Technical specification complete
- [x] Prompt templates complete
- [ ] Blue Book data extracted
- [ ] SSA-3373 mapping complete
- [ ] All config files created
- [ ] Setup instructions written
- [ ] UI specifications documented

### Code Assets
- [ ] Encryption service skeleton
- [ ] IndexedDB service skeleton
- [ ] Component starters
- [ ] Test examples
- [ ] Sample data

### Access & Credentials
- [ ] GitHub repository created
- [ ] Vercel/Netlify account ready
- [ ] Domain registered (optional)
- [ ] Sentry project created

### Success Criteria Defined
- [ ] Clear acceptance criteria for each phase
- [ ] Testing requirements documented
- [ ] Performance targets specified
- [ ] Accessibility requirements clear

---

**Next Steps:**
1. Extract Blue Book data for 3 categories (40-60 hours)
2. Create SSA-3373 question mapping (8-12 hours)
3. Set up project repository with all config files (2-4 hours)
4. Create UI specification document (4-8 hours)
5. Begin Phase 1 development

**Estimated Time to "Handoff Ready":** 60-80 hours of preparation work

