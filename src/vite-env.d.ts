/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_WORKER_API_URL?: string;
  readonly VITE_TURNSTILE_SITE_KEY?: string;
  readonly VITE_BASE_PATH?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
