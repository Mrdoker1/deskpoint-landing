"use client";

import { useCallback, useState } from "react";
import { Play } from "lucide-react";

/**
 * TODO(product): подставить источник демо одним местом.
 * - file: задайте `src` (mp4/webm) и опционально `poster`
 * - youtube / vimeo: задайте `provider` + `embedId`
 * Пока оба пусты — режим «Демо скоро» (без битой ссылки).
 */
export const DEMO_VIDEO_CONFIG = {
  provider: "file" as "file" | "youtube" | "vimeo",
  /** URL файла или пусто */
  src: "",
  /** Постер для <video> / обложка */
  poster: "",
  /** ID ролика YouTube/Vimeo */
  embedId: "",
  title: "Как работает Deskpoint",
} as const;

function isDemoReady(cfg: typeof DEMO_VIDEO_CONFIG) {
  if (cfg.provider === "file") return Boolean(cfg.src);
  return Boolean(cfg.embedId);
}

function embedUrl(cfg: typeof DEMO_VIDEO_CONFIG) {
  if (cfg.provider === "youtube") {
    return `https://www.youtube-nocookie.com/embed/${cfg.embedId}?autoplay=1&rel=0`;
  }
  if (cfg.provider === "vimeo") {
    return `https://player.vimeo.com/video/${cfg.embedId}?autoplay=1`;
  }
  return "";
}

type DemoVideoPlayerProps = {
  className?: string;
  /** Override config for tests / story */
  config?: Partial<typeof DEMO_VIDEO_CONFIG>;
};

export function DemoVideoPlayer({
  className = "",
  config: configOverride,
}: DemoVideoPlayerProps) {
  const cfg = { ...DEMO_VIDEO_CONFIG, ...configOverride };
  const ready = isDemoReady(cfg);
  const [playing, setPlaying] = useState(false);

  const onPlayClick = useCallback(() => {
    if (!ready) return;
    setPlaying(true);
  }, [ready]);

  return (
    <div
      className={`relative aspect-video w-full overflow-hidden border border-background/20 bg-background/5 ${className}`}
    >
      {!playing && (
        <button
          type="button"
          onClick={onPlayClick}
          disabled={!ready}
          aria-label={ready ? "Смотреть демо" : "Демо скоро"}
          className="group absolute inset-0 z-10 flex flex-col items-center justify-center gap-5 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-background/40"
        >
          {/* Poster surface */}
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: cfg.poster
                ? `url(${cfg.poster})`
                : undefined,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
            aria-hidden
          />
          {!cfg.poster && (
            <div
              className="absolute inset-0"
              style={{
                background:
                  "radial-gradient(ellipse at 30% 20%, rgba(142,71,30,0.35), transparent 55%), linear-gradient(135deg, #4a3224, #2e1f16)",
              }}
              aria-hidden
            />
          )}
          <div
            className="absolute inset-0 opacity-[0.12] pointer-events-none"
            style={{
              backgroundImage: `repeating-linear-gradient(-45deg, transparent, transparent 24px, currentColor 24px, currentColor 25px)`,
            }}
            aria-hidden
          />

          <span
            className={`relative z-10 flex h-16 w-16 items-center justify-center rounded-full border transition-transform duration-300 ${
              ready
                ? "border-background/40 bg-background/15 group-hover:scale-105 group-hover:bg-background/25"
                : "border-background/25 bg-background/10 cursor-default"
            }`}
          >
            <Play
              className={`h-6 w-6 fill-current ${ready ? "text-background" : "text-background/50"}`}
              aria-hidden
            />
          </span>

          <div className="relative z-10 text-center px-6">
            <p className="font-mono text-[11px] uppercase tracking-widest text-background/50 mb-2">
              {ready ? "Демо продукта" : "Демо скоро"}
            </p>
            <p className="font-display text-xl lg:text-2xl text-background/90 tracking-tight">
              {cfg.title}
            </p>
            {!ready && (
              <p className="mt-2 text-sm text-background/45 max-w-md mx-auto leading-relaxed">
                Ролик в подготовке. Когда будет готов — подставим источник в одну
                константу, без смены вёрстки.
              </p>
            )}
          </div>
        </button>
      )}

      {playing && ready && cfg.provider === "file" && (
        <video
          className="absolute inset-0 h-full w-full object-cover"
          src={cfg.src}
          poster={cfg.poster || undefined}
          controls
          autoPlay
          playsInline
        />
      )}

      {playing && ready && (cfg.provider === "youtube" || cfg.provider === "vimeo") && (
        <iframe
          className="absolute inset-0 h-full w-full"
          src={embedUrl(cfg)}
          title={cfg.title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      )}
    </div>
  );
}
