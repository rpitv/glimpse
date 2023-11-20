import { fileURLToPath, URL } from "url";

import {defineConfig, loadEnv} from "vite";
import vue from "@vitejs/plugin-vue";
import vuetify from "vite-plugin-vuetify";


// https://vitejs.dev/config/
export default ({ mode }: { mode: string }) => {
  process.env = {...process.env, ...loadEnv(mode, process.cwd())};

  // import.meta.env.VITE_NAME available here with: process.env.VITE_NAME
  // import.meta.env.VITE_PORT available here with: process.env.VITE_PORT

  return defineConfig({
    plugins: [
      vue(),
      vuetify({
        autoImport: true
      })
    ],
    resolve: {
      alias: {
        "@": fileURLToPath(new URL("./src", import.meta.url)),
      },
    },
    build: {
      sourcemap: true,
    },
    css: {
      devSourcemap: true,
    },
    server: {
      strictPort: true,
      proxy: {
        "/api": {
          target: process.env.VITE_HTTPS === "true" ? "https://localhost:4000" : "http://localhost:4000",
          changeOrigin: true,
          secure: false,
          rewrite: (path) => path.replace(/^\/api/, ""),
        },
      },
    },
  });
}
