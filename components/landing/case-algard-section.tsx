"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Stub case study — placeholder until agreed copy from «Альгард» is ready.
 *
 * TODO: нужны реальные данные/цифры/цитаты от бизнеса перед запуском рекламы.
 * Не подставлять выдуманные метрики в этот блок.
 */
export function CaseAlgardSection() {
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

  return (
    <section
      id="case-algard"
      ref={sectionRef}
      className="relative py-24 lg:py-32 border-t border-foreground/10"
    >
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
        <div
          className={`grid lg:grid-cols-[1fr_1.2fr] gap-12 lg:gap-20 transition-all duration-700 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          }`}
        >
          <div>
            <span className="inline-flex items-center gap-3 text-sm font-mono text-muted-foreground mb-6">
              <span className="w-8 h-px bg-foreground/30" />
              Кейс
            </span>
            <h2 className="text-4xl lg:text-5xl font-display tracking-tight mb-4">
              Альгард
            </h2>
            <p className="text-sm font-mono text-muted-foreground uppercase tracking-widest">
              Заглушка · текст согласовывается
            </p>
          </div>

          <div className="border border-foreground/10 p-8 lg:p-10">
            <p className="text-lg lg:text-xl text-muted-foreground leading-relaxed mb-6">
              Здесь появится согласованный кейс пилота «Альгард»: контекст
              бизнеса, какие каналы подключены к Deskpoint и какой результат
              увидела команда в кабинете.
            </p>
            <p className="text-sm text-muted-foreground leading-relaxed border-t border-foreground/10 pt-6">
              Пока без выдуманных метрик и цитат. После согласования с клиентом
              заменим этот блок реальным описанием и цифрами.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
