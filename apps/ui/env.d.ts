/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly HTTPS: boolean
  // more env variables...
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
