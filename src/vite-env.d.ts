/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_URL: string
  readonly VITE_STRIPE_CHECKOUT_STARTER: string
  readonly VITE_STRIPE_CHECKOUT_PRO: string
  readonly VITE_STRIPE_PORTAL_LINK: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
