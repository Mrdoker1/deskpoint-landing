"use client";

import { useEffect, useRef, useState } from "react";
import { MapPin, Scale, Server } from "lucide-react";

/** Honest data residency for RU market — no fabricated PoP latency map. */
const points = [
  {
    icon: Server,
    title: "Серверы в России",
    description:
      "Данные тенанта хранятся на инфраструктуре в РФ — без маркетинговой «глобальной» карты дата-центров.",
  },
  {
    icon: Scale,
    title: "Ориентир на 152-ФЗ",
    description:
      "Проектируем обработку и хранение персональных данных с учётом требований законодательства РФ о персональных данных.",
  },
  {
    icon: MapPin,
    title: "Без выдуманных задержек",
    description:
      "Не публикуем красивые цифры задержки и uptime без реальной production-телеметрии. Когда появятся измеренные SLA — покажем их здесь.",
  },
];

export function DataResidencySection() {
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
    <section id="data" ref={sectionRef} className="relative py-24 lg:py-32">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
        <div className="mb-16 lg:mb-20 max-w-3xl">
          <span className="inline-flex items-center gap-3 text-sm font-mono text-muted-foreground mb-6">
            <span className="w-8 h-px bg-foreground/30" />
            Данные
          </span>
          <h2
            className={`text-4xl lg:text-6xl font-display tracking-tight transition-all duration-700 ${
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            }`}
          >
            Данные в России.
            <br />
            <span className="text-muted-foreground">Без красивой сказки.</span>
          </h2>
          <p className="mt-6 text-lg text-muted-foreground leading-relaxed">
            Для владельцев клиник, автосервисов и салонов важнее понятное
            размещение данных, чем карта городов с выдуманными миллисекундами.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {points.map((point, index) => (
            <div
              key={point.title}
              className={`border border-foreground/10 bg-white p-8 transition-all duration-700 lg:p-10 ${
                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
              }`}
              style={{ transitionDelay: `${index * 80}ms` }}
            >
              <div className="mb-5 w-10 h-10 flex items-center justify-center border border-foreground/10">
                <point.icon className="w-5 h-5" />
              </div>
              <h3 className="text-xl font-display mb-3">{point.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {point.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
