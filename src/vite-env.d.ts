/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_ANTHROPIC_API_KEY?: string
  readonly VITE_ANTHROPIC_API_MODEL?: string
  readonly VITE_GOOGLE_API_KEY?: string
  readonly VITE_GEMINI_API_MODEL?: string
  readonly VITE_OPENAI_API_KEY?: string
  readonly VITE_OPENAI_API_MODEL?: string
  readonly VITE_XAI_API_KEY?: string
  readonly VITE_XAI_API_MODEL?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
