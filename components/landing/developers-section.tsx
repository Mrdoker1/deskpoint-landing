"use client";

import { useEffect, useRef, useState } from "react";
import { Check, Copy } from "lucide-react";

/** Compact API block for owners who have a contractor — real Dashboard API curl. */
const curlExample = `curl -s "http://localhost:4002/api/v1/dashboard/{slug}?days=30" \\
  -H "Authorization: Bearer <team_api_key>" \\
  -H "Accept: application/json"

# Ответ: conversations, funnel, usage, booking
# Спека: GET /api/v1/dashboard/openapi.json`;

export function DevelopersSection() {
  const [copied, setCopied] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setIsVisible(true);
      },
      { threshold: 0.1 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  async function copyCode() {
    try {
      await navigator.clipboard.writeText(curlExample);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      /* ignore */
    }
  }

  return (
    <section id="api" ref={sectionRef} className="relative py-16 lg:py-20 border-y border-foreground/10">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
        <div
          className={`grid lg:grid-cols-[1fr_1.2fr] gap-10 lg:gap-16 items-start transition-all duration-700 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
          }`}
        >
          <div>
            <span className="inline-flex items-center gap-3 text-sm font-mono text-muted-foreground mb-4">
              <span className="w-8 h-px bg-foreground/30" />
              API
            </span>
            <h2 className="text-3xl lg:text-4xl font-display tracking-tight mb-4">
              Открытый API для интеграций
            </h2>
            <p className="text-muted-foreground leading-relaxed max-w-lg">
              Если у вас есть подрядчик или своя CRM — кабинет отдаёт агрегаты по
              REST. Блок компактный: основная аудитория Deskpoint — владельцы
              бизнеса, не разработчики.
            </p>
          </div>

          <div className="border border-foreground/10 rounded-2xl overflow-hidden bg-foreground text-background">
            <div className="flex items-center justify-between px-4 py-3 border-b border-background/10">
              <span className="font-mono text-xs text-background/60">
                curl · Dashboard API
              </span>
              <button
                type="button"
                onClick={copyCode}
                className="p-2 text-background/60 hover:text-background"
                aria-label="Копировать"
              >
                {copied ? <Check size={16} /> : <Copy size={16} />}
              </button>
            </div>
            <pre className="p-5 font-mono text-xs sm:text-sm leading-relaxed whitespace-pre-wrap">
              {curlExample}
            </pre>
          </div>
        </div>
      </div>
    </section>
  );
}
