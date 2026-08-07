"use client";

import { useEffect, useRef, useState } from "react";
import { BellRing, KeyRound, Lock, Scale } from "lucide-react";

const privacyFeatures = [
  {
    icon: Scale,
    title: "Хранение в РФ и 152-ФЗ",
    description:
      "Персональные данные клиентов обрабатываем с ориентацией на требования 152-ФЗ и размещение инфраструктуры в России.",
  },
  {
    icon: Lock,
    title: "Шифрование данных",
    description:
      "Передача по защищённым каналам (TLS). Доступ к кабинету — через сессию или API-ключ команды.",
  },
  {
    icon: KeyRound,
    title: "Разграничение по ролям",
    description:
      "Владелец и администраторы видят контур своего тенанта. Чужие команды и чужие обращения недоступны.",
  },
  {
    icon: BellRing,
    title: "Уведомление о записи разговора",
    description:
      "Для звонков с записью предусматриваем информирование абонента — как часть корректного процесса сервиса.",
  },
];

export function PrivacySection() {
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
      id="security"
      ref={sectionRef}
      className="relative py-24 lg:py-32 bg-foreground/[0.02] overflow-hidden"
    >
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-24">
          <div
            className={`transition-all duration-700 ${
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            }`}
          >
            <span className="inline-flex items-center gap-3 text-sm font-mono text-muted-foreground mb-6">
              <span className="w-8 h-px bg-foreground/30" />
              Безопасность
            </span>
            <h2 className="text-4xl lg:text-6xl font-display tracking-tight mb-8">
              То, что можно
              <br />
              обещать честно.
            </h2>
            <p className="text-xl text-muted-foreground leading-relaxed">
              Без международных «бейджей соответствия», которых у продукта пока
              нет. Только практики, которые реально заложены в Deskpoint.
            </p>
          </div>

          <div className="grid gap-6">
            {privacyFeatures.map((feature, index) => (
              <div
                key={feature.title}
                className={`p-6 border border-foreground/10 hover:border-foreground/20 transition-all duration-500 group ${
                  isVisible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-8"
                }`}
                style={{ transitionDelay: `${index * 100}ms` }}
              >
                <div className="flex items-start gap-4">
                  <div className="shrink-0 w-10 h-10 flex items-center justify-center border border-foreground/10 group-hover:bg-foreground group-hover:text-background transition-colors duration-300">
                    <feature.icon className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-lg font-medium mb-1 group-hover:translate-x-1 transition-transform duration-300">
                      {feature.title}
                    </h3>
                    <p className="text-muted-foreground">{feature.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
