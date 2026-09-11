import type { NextConfig } from 'next';

// GitHub Pages serves a project site under `/<repo>/`. The deploy workflow sets
// NEXT_PUBLIC_BASE_PATH to "/little_sign-site"; leave it unset for local dev or
// a custom domain served from the site root.
const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? '';

const nextConfig: NextConfig = {
  // Fully static output: every route becomes an HTML file in `out/`.
  output: 'export',
  // `/privacy/` -> `out/privacy/index.html`, which GitHub Pages serves directly.
  trailingSlash: true,
  basePath,
  assetPrefix: basePath || undefined,
  images: { unoptimized: true },
  reactStrictMode: true,
};

export default nextConfig;
