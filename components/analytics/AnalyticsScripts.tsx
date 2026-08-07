"use client";

import Script from "next/script";

declare global {
  interface Window {
    ym?: (...args: unknown[]) => void;
  }
}

/**
 * Яндекс.Метрика — основной счётчик для рекламы в РФ.
 * Включается только при `NEXT_PUBLIC_YM_COUNTER_ID`.
 *
 * Опциональный GA4: `NEXT_PUBLIC_GA_MEASUREMENT_ID` (не обязателен на этом шаге).
 */
export function AnalyticsScripts() {
  const ymId = (process.env.NEXT_PUBLIC_YM_COUNTER_ID || "").trim();
  const gaId = (process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || "").trim();

  return (
    <>
      {ymId ? (
        <>
          <Script id="yandex-metrika" strategy="afterInteractive">{`
(function(m,e,t,r,i,k,a){m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};
m[i].l=1*new Date();
for (var j = 0; j < document.scripts.length; j++) {if (document.scripts[j].src === r) { return; }}
k=e.createElement(t),a=e.getElementsByTagName(t)[0],k.async=1,k.src=r,a.parentNode.insertBefore(k,a)})
(window, document, "script", "https://mc.yandex.ru/metrika/tag.js", "ym");
ym(${JSON.stringify(ymId)}, "init", {
  clickmap:true,
  trackLinks:true,
  accurateTrackBounce:true,
  webvisor:true
});
          `}</Script>
          <noscript>
            <div>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={`https://mc.yandex.ru/watch/${ymId}`}
                style={{ position: "absolute", left: "-9999px" }}
                alt=""
              />
            </div>
          </noscript>
        </>
      ) : null}

      {gaId ? (
        <>
          <Script
            src={`https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(gaId)}`}
            strategy="afterInteractive"
          />
          <Script id="ga4-gtag" strategy="afterInteractive">{`
window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', ${JSON.stringify(gaId)});
          `}</Script>
        </>
      ) : null}
    </>
  );
}

/** Client helper: reachGoal после успешной заявки. */
export function trackLeadGoal(): void {
  const ymId = (process.env.NEXT_PUBLIC_YM_COUNTER_ID || "").trim();
  if (!ymId || typeof window === "undefined" || typeof window.ym !== "function") {
    return;
  }
  try {
    window.ym(ymId, "reachGoal", "landing_lead");
  } catch {
    /* ignore */
  }
}
