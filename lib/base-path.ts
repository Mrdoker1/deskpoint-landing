/**
 * Префикс, под которым отдаётся сайт.
 *
 * На своём домене пусто, на GitHub Pages — "/deskpoint-landing" (значение
 * приходит из NEXT_PUBLIC_BASE_PATH, его выставляет workflow сборки).
 *
 * next/link и next/router подставляют basePath сами, поэтому helper нужен
 * только там, где абсолютный внутренний адрес пишется руками: обычные <a>,
 * src у картинок из public/.
 */
export const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

/** Абсолютный внутренний путь ("/privacy", "/#lead", "/logo.svg") с префиксом. */
export function withBase(path: string): string {
  return path.startsWith("/") ? `${basePath}${path}` : path;
}
