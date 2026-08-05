import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Isole le build/cache du serveur e2e (voir playwright.config.ts) dans un
  // dossier distinct, pour pouvoir le lancer même si `npm run dev` tourne
  // déjà : Next verrouille un seul `next dev` par `distDir`, pas par port.
  distDir: process.env.NEXT_DIST_DIR || '.next',
};

export default nextConfig;
