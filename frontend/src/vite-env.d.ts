/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_URL: string;
  readonly MODE: string; // 👈 agregamos MODE
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
