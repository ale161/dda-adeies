import { jsxLocPlugin } from "@builder.io/vite-plugin-jsx-loc";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import fs from "node:fs";
import path from "path";
import { defineConfig } from "vite";
import { VitePWA } from "vite-plugin-pwa";

// Conditional import for manus-runtime
let manus;
try {
  manus = (await import("vite-plugin-manus-runtime")).default;
} catch (e) {
  // Plugin not available (e.g. in GitHub Actions), use a no-op plugin
  manus = () => ({ name: "manus-runtime-noop" });
}

const plugins = [
  react(), 
  tailwindcss(), 
  jsxLocPlugin(),
  manus(),
  VitePWA({
    registerType: 'autoUpdate',
    devOptions: {
      enabled: true
    },
    includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'mask-icon.svg', '*.png'],
    manifest: {
      name: 'Αιτήσεις Αδειών Δικαστικής Αστυνομίας',
      short_name: 'Άδειες ΔΑ',
      description: 'Εφαρμογή συμπλήρωσης και έκδοσης αιτήσεων αδειών για το προσωπικό της Δικαστικής Αστυνομίας',
      theme_color: '#ffffff',
      background_color: '#ffffff',
      display: 'standalone',
      start_url: '/',
      icons: [
        {
          src: 'pwa-192x192.png',
          sizes: '192x192',
          type: 'image/png',
          purpose: 'maskable any'
        },
        {
          src: 'pwa-512x512.png',
          sizes: '512x512',
          type: 'image/png',
          purpose: 'maskable any'
        }
      ]
    },
    workbox: {
      globPatterns: ['**/*.{js,css,html,ico,png,svg}']
    }
  })
];

export default defineConfig({
  base: "/",
  plugins,
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "client", "src"),
      "@shared": path.resolve(import.meta.dirname, "shared"),
      "@assets": path.resolve(import.meta.dirname, "attached_assets"),
    },
  },
  envDir: path.resolve(import.meta.dirname),
  root: path.resolve(import.meta.dirname, "client"),
  build: {
    outDir: path.resolve(import.meta.dirname, "dist/public"),
    emptyOutDir: true,
  },
  server: {
    port: 3000,
    strictPort: false, // Will find next available port if 3000 is busy
    host: true,
    allowedHosts: [
      ".manuspre.computer",
      ".manus.computer",
      ".manus-asia.computer",
      ".manuscomputer.ai",
      ".manusvm.computer",
      "localhost",
      "127.0.0.1",
    ],
    fs: {
      strict: true,
      deny: ["**/.*"],
    },
  },
});
