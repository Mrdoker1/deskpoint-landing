import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

/**
 * Статический экспорт для превью на GitHub Pages включается через
 * NEXT_OUTPUT=export (его ставит .github/workflows/pages.yml). Обычная сборка
 * и dev этой ветки не касаются — там остаётся полноценный Next с /api/leads.
 *
 * Pages отдаёт сайт по подпути /<repo>/, поэтому в этом режиме задаются
 * basePath и assetPrefix. Ссылки и картинки, написанные руками, берут тот же
 * префикс из NEXT_PUBLIC_BASE_PATH через lib/base-path.ts.
 */
const isExport = process.env.NEXT_OUTPUT === 'export'
const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? ''

/** @type {import('next').NextConfig} */
const nextConfig = {
  // No next/image usage in landing yet (no <img> in components except Metrika noscript);
  // leave images defaults — do not force unoptimized.
  // @deskpoint/design-tokens is vendored at ./packages/design-tokens, so the
  // project directory itself is the correct Turbopack root.
  turbopack: {
    root: __dirname,
  },
  ...(isExport
    ? {
        output: 'export',
        basePath,
        assetPrefix: basePath ? `${basePath}/` : undefined,
        images: { unoptimized: true },
        trailingSlash: true,
      }
    : {}),
}

export default nextConfig
