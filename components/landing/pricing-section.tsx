"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowRight, Check } from "lucide-react";

/**
 * TODO(business): заменить плейсхолдеры после согласования коммерции.
 * Менять только значения здесь — UI читает из этого объекта.
 */
export const PRICING_PLACEHOLDERS = {
  /** ₽ за минуту звонка */
  pricePerCallMinuteLabel: "[уточняется]",
  /** ₽ за обработанное сообщение */
  pricePerMessageLabel: "[уточняется]",
  /**
   * Бесплатный старт: первые N минут звонков.
   * В обсуждении звучали 60 / 100 — финальное число за бизнесом.
   */
  freeCallMinutes: "[N]",
  /**
   * Бесплатный старт: первые M обработанных сообщений.
   * В обсуждении звучали 1000–3000 — финальное число за бизнесом.
   */
  freeMessages: "[M]",
  /**
   * Якорь «обычно интеграция такого уровня стоит от X ₽».
   * Публиковать ли на сайте — решение бизнеса (см. showIntegrationMarketAnchor).
   */
  integrationMarketAnchorLabel: "[сумма]",
  /** false = не показывать сумму-якорь на лендинге, пока не согласовано */
  showIntegrationMarketAnchor: false,
} as const;

const featurePackages = [
  {
    id: "analytics",
    name: "Аналитика",
    tagline: "Разбор и статистика",
    description:
      "Дашборд и ИИ-анализ диалогов — если каналы связи у вас уже есть, а нужен прозрачный разбор работы команды.",
    features: [
      "Дашборд по операторам и отделу",
      "ИИ-анализ качества диалогов",
      "Проблемные обращения и выводы",
      "Таблицы и отчёты без vanity-метрик",
    ],
    recommended: false,
  },
  {
    id: "channels",
    name: "Телефония и каналы",
    tagline: "Единый приём обращений",
    description:
      "ИИ-обработка звонков, мессенджеров и виджета в одном кабинете — с базовыми метриками, без расширенной аналитики команды.",
    features: [
      "Телефония с записью и ИИ-разбором",
      "Мессенджеры и виджет в одном инбоксе",
      "Базовые метрики потока",
      "Без прыжков между приложениями",
    ],
    recommended: false,
  },
  {
    id: "full",
    name: "Аналитика + Телефония",
    tagline: "Комплексный пакет",
    description:
      "Оба столпа вместе: единая точка приёма и полная аналитика команды. Основной рекомендуемый вариант.",
    features: [
      "Всё из «Телефония и каналы»",
      "Всё из «Аналитика»",
      "Единый кабинет без разрывов",
      "Приоритетная настройка под старт",
    ],
    recommended: true,
  },
];

export function PricingSection() {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);
  const p = PRICING_PLACEHOLDERS;

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setIsVisible(true);
      },
      { threshold: 0.12 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      id="pricing"
      ref={sectionRef}
      className="relative py-32 lg:py-40 border-t border-foreground/10"
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div
          className={`max-w-3xl mb-12 transition-all duration-700 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          }`}
        >
          <span className="font-mono text-xs tracking-widest text-muted-foreground uppercase block mb-6">
            Тарифы
          </span>
          <h2 className="font-display text-5xl md:text-6xl tracking-tight text-foreground mb-6">
            Оплата по факту использования,
            <br />
            <span className="text-muted-foreground">
              пакеты — по набору функций.
            </span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-xl leading-relaxed">
            Нет уровней «малый / средний / большой поток». Считаем минуты звонков
            и обработанные сообщения; сверху выбираете пакет функций — аналитика,
            каналы или оба вместе.
          </p>
        </div>

        {/* Usage rates */}
        <div
          className={`mb-10 border border-foreground/15 p-6 lg:p-8 transition-all duration-700 delay-75 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          }`}
        >
          <p className="font-mono text-[11px] uppercase tracking-widest text-muted-foreground mb-4">
            Базовый принцип · usage
          </p>
          <div className="flex flex-col sm:flex-row sm:flex-wrap sm:items-baseline gap-3 sm:gap-x-8 sm:gap-y-2">
            <p className="font-display text-2xl lg:text-3xl tracking-tight">
              {p.pricePerCallMinuteLabel}{" "}
              <span className="text-lg text-muted-foreground font-sans">
                ₽ за минуту звонка
              </span>
            </p>
            <span className="hidden sm:inline text-muted-foreground/50" aria-hidden>
              ·
            </span>
            <p className="font-display text-2xl lg:text-3xl tracking-tight">
              {p.pricePerMessageLabel}{" "}
              <span className="text-lg text-muted-foreground font-sans">
                ₽ за обработанное сообщение
              </span>
            </p>
          </div>
          <p className="mt-4 text-sm text-muted-foreground leading-relaxed max-w-2xl">
            Точные ставки согласуются отдельно и подставляются в одно место в
            коде. Пакеты ниже не ограничивают объём — они задают набор функций.
          </p>
        </div>

        {/* Free start */}
        <div
          className={`mb-14 border-2 border-primary/40 bg-primary/[0.06] p-6 lg:p-8 transition-all duration-700 delay-100 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          }`}
        >
          <p className="font-mono text-[11px] uppercase tracking-widest text-primary mb-3">
            Бесплатный старт
          </p>
          <h3 className="font-display text-2xl lg:text-3xl tracking-tight mb-4">
            Интеграция бесплатно · первый период без оплаты usage
          </h3>
          <ul className="space-y-3 text-muted-foreground leading-relaxed max-w-3xl">
            <li className="flex gap-3">
              <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
              <span>
                Интеграция и настройка — бесплатно для первых клиентов: нам тоже
                важен ваш результат на реальном потоке.
                {p.showIntegrationMarketAnchor ? (
                  <>
                    {" "}
                    Обычно интеграция такого уровня стоит от{" "}
                    <span className="text-foreground font-medium">
                      {p.integrationMarketAnchorLabel} ₽
                    </span>{" "}
                    в зависимости от объёма.
                  </>
                ) : (
                  <>
                    {" "}
                    <span className="font-mono text-xs text-foreground/70">
                      {/* TODO(business): включить showIntegrationMarketAnchor и
                          задать integrationMarketAnchorLabel, если публикуем якорь */}
                      [якорь «от … ₽» — на согласовании]
                    </span>
                  </>
                )}
              </span>
            </li>
            <li className="flex gap-3">
              <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
              <span>
                Первые{" "}
                <span className="text-foreground font-medium">
                  {p.freeCallMinutes} минут
                </span>{" "}
                звонков и первые{" "}
                <span className="text-foreground font-medium">
                  {p.freeMessages} сообщений
                </span>{" "}
                — бесплатно.{" "}
                <span className="font-mono text-xs">
                  {/* TODO(business): заменить freeCallMinutes / freeMessages */}
                  [N и M — плейсхолдеры]
                </span>
              </span>
            </li>
          </ul>
        </div>

        {/* Feature packages */}
        <div className="mb-6">
          <p className="font-mono text-[11px] uppercase tracking-widest text-muted-foreground mb-6">
            Пакеты по набору функций
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-px bg-foreground/10">
          {featurePackages.map((pkg, idx) => (
            <div
              key={pkg.id}
              className={`relative p-8 lg:p-10 bg-background transition-all duration-700 ${
                isVisible
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-8"
              } ${
                pkg.recommended ? "md:-my-4 md:py-12 border-2 border-primary z-[1]" : ""
              }`}
              style={{ transitionDelay: `${150 + idx * 120}ms` }}
            >
              {pkg.recommended && (
                <span className="absolute -top-3 left-8 px-3 py-1 bg-primary text-primary-foreground text-xs font-mono uppercase tracking-widest">
                  Рекомендуем
                </span>
              )}

              <div className="mb-8">
                <span className="font-mono text-xs text-muted-foreground">
                  {String(idx + 1).padStart(2, "0")}
                </span>
                <h3 className="font-display text-3xl text-foreground mt-2">
                  {pkg.name}
                </h3>
                <p className="text-sm font-medium text-primary mt-2">
                  {pkg.tagline}
                </p>
                <p className="text-sm text-muted-foreground mt-3 leading-relaxed">
                  {pkg.description}
                </p>
              </div>

              <div className="mb-8 pb-8 border-b border-foreground/10">
                <span className="font-display text-xl text-foreground">
                  Usage + пакет
                </span>
                <p className="text-sm text-muted-foreground mt-2">
                  Минуты и сообщения — по факту; функции — по пакету
                </p>
              </div>

              <ul className="space-y-4 mb-10">
                {pkg.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-3">
                    <Check className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                    <span className="text-sm text-muted-foreground">{feature}</span>
                  </li>
                ))}
              </ul>

              <a
                href="#lead"
                className={`w-full py-4 flex items-center justify-center gap-2 text-sm font-medium transition-all group rounded-full ${
                  pkg.recommended
                    ? "bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg"
                    : "border border-foreground/20 text-foreground hover:border-primary/50 hover:bg-primary/10"
                }`}
              >
                Оставить заявку
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
