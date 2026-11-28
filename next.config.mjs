import path from 'node:path';
import { fileURLToPath } from 'node:url';

const projectRoot = path.dirname(fileURLToPath(import.meta.url));

// GODADDY_NODE=1 builds a self-contained Node.js server (.next/standalone/server.js)
// for GoDaddy cPanel "Setup Node.js App" hosting. Normal builds (Vercel) are unaffected.
// Run it with: node scripts/package-godaddy-node.mjs
const godaddyNode = process.env.GODADDY_NODE === '1';

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [{ protocol: 'https', hostname: 'images.unsplash.com' }],
    // Shared hosting often cannot load the native image library (sharp), which would
    // break images; serve them as-is there instead.
    ...(godaddyNode && { unoptimized: true }),
  },
  ...(godaddyNode && { output: 'standalone' }),
  // This project sits inside another folder that has its own lockfile; pin the root here
  // so builds and the standalone output are traced from this project only.
  turbopack: { root: projectRoot },
  outputFileTracingRoot: projectRoot,
};

export default nextConfig;
