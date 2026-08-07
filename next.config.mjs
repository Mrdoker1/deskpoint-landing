import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

/** @type {import('next').NextConfig} */
const nextConfig = {
  // No next/image usage in landing yet (no <img> in components except Metrika noscript);
  // leave images defaults — do not force unoptimized.
  // @deskpoint/design-tokens is vendored at ./packages/design-tokens, so the
  // project directory itself is the correct Turbopack root.
  turbopack: {
    root: __dirname,
  },
}

export default nextConfig
