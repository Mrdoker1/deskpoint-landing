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
  /** ₽ за обработанное сообщение в чате */
  pricePerMessageLabel: "[уточняется]",
  /** ₽ за проанализированный диалог (звонок или переписка) */
  pricePerAnalyzedDialogLabel: "[уточняется]",
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

/**
 * Три вида usage — ровно то, за что идёт оплата по факту. Аналитика вынесена
 * отдельной позицией: она тарифицируется и в младшем пакете, где каналы клиента
 * свои, поэтому свести её к минутам и сообщениям нельзя.
 */
const usageRates = [
  { key: "calls", unit: "₽ за минуту звонка", price: "pricePerCallMinuteLabel" },
  { key: "chats", unit: "₽ за сообщение в чате", price: "pricePerMessageLabel" },
  {
    key: "analytics",
    unit: "₽ за разобранный диалог",
    price: "pricePerAnalyzedDialogLabel",
  },
] as const;

/**
 * Два пакета лестницей: младший — только аналитика поверх ваших каналов,
 * старший — то же плюс приём звонков и мессенджеров через ИИ. Скидка за комплект
 * не нужна: старший пакет и есть комплект, а не третий вариант рядом.
 */
const featurePackages = [
  {
    id: "analytics",
    name: "Аналитика",
    tagline: "Поверх ваших каналов",
    description:
      "Если телефония и мессенджеры у вас уже есть и менять их незачем — подключаемся к ним и даём разбор работы команды.",
    features: [
      "Дашборд по операторам и отделу",
      "ИИ-анализ качества диалогов",
      "Проблемные обращения и выводы",
      "Отчёты и выгрузки без vanity-метрик",
      "Бот и группа в Telegram для руководителей",
    ],
    note: "Каналы связи остаются вашими — мы к ним подключаемся.",
    recommended: false,
  },
  {
    id: "full",
    name: "Аналитика + телефония и мессенджеры",
    tagline: "Всё в одном кабинете",
    description:
      "То же самое плюс приём обращений: ИИ отвечает на звонки и сообщения, а весь поток и его разбор живут в одном окне.",
    features: [
      "Всё из пакета «Аналитика»",
      "Телефония с ИИ-оператором и записью",
      "Мессенджеры и виджет в одном инбоксе",
      "Единый кабинет без прыжков между приложениями",
      "Приоритетная настройка на старте",
    ],
    note: "Телефонию подключаем вашу или настраиваем через партнёров.",
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

  const reveal = (delay: string) =>
    `transition-all duration-700 ${delay} ${
      isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
    }`;

  return (
    <section
      id="pricing"
      ref={sectionRef}
      className="relative py-32 lg:py-40 border-t border-foreground/10"
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className={`max-w-3xl mb-12 ${reveal("")}`}>
          <span className="font-mono text-xs tracking-widest text-muted-foreground uppercase block mb-6">
            Тарифы
          </span>
          <h2 className="font-display text-5xl md:text-6xl tracking-tight text-foreground mb-6">
            Интеграция бесплатно,
            <br />
            <span className="text-muted-foreground">
              платите только за использование.
            </span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-xl leading-relaxed">
            Нет абонентской платы и уровней «малый / средний / большой поток».
            Считаем минуты звонков, сообщения в чатах и разобранные диалоги.
            Пакет выбираете один из двух — он задаёт набор функций, а не объём.
          </p>
        </div>

        {/* Бесплатная интеграция — отдельный тезис, а не часть usage */}
        <div
          className={`mb-10 border-2 border-primary/40 bg-primary/[0.06] p-6 lg:p-8 ${reveal(
            "delay-75"
          )}`}
        >
          <p className="font-mono text-[11px] uppercase tracking-widest text-primary mb-3">
            Подключение
          </p>
          <h3 className="font-display text-2xl lg:text-3xl tracking-tight mb-3">
            Интеграция и настройка — бесплатно
          </h3>
          <p className="text-muted-foreground leading-relaxed max-w-3xl">
            Подключаем каналы, настраиваем ИИ под ваши сценарии и заводим команду
            в кабинет — без оплаты и без обязательств. Понравится результат на
            реальном потоке — продолжаете работать, нет — ничего не платите.
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
          </p>
        </div>

        {/* Usage: три позиции */}
        <div
          className={`mb-14 border border-foreground/15 p-6 lg:p-8 ${reveal(
            "delay-100"
          )}`}
        >
          <p className="font-mono text-[11px] uppercase tracking-widest text-muted-foreground mb-6">
            Оплата по факту · usage
          </p>
          <div className="grid gap-6 sm:grid-cols-3 sm:gap-8">
            {usageRates.map((rate) => (
              <div key={rate.key}>
                <p className="font-display text-2xl lg:text-3xl tracking-tight">
                  {p[rate.price]}
                </p>
                <p className="mt-1 text-sm text-muted-foreground">{rate.unit}</p>
              </div>
            ))}
          </div>
          <p className="mt-6 text-sm text-muted-foreground leading-relaxed max-w-2xl">
            Первые{" "}
            <span className="text-foreground font-medium">
              {p.freeCallMinutes} минут
            </span>{" "}
            звонков и{" "}
            <span className="text-foreground font-medium">
              {p.freeMessages} сообщений
            </span>{" "}
            — бесплатно.{" "}
            <span className="font-mono text-xs">
              {/* TODO(business): заменить ставки, freeCallMinutes и freeMessages */}
              [ставки и лимиты — плейсхолдеры]
            </span>
          </p>
        </div>

        <div className="mb-6">
          <p className="font-mono text-[11px] uppercase tracking-widest text-muted-foreground">
            Два пакета по набору функций
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {featurePackages.map((pkg, idx) => (
            <div
              key={pkg.id}
              className={`relative flex flex-col bg-white p-8 transition-all duration-700 lg:p-10 ${
                isVisible
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-8"
              } ${
                pkg.recommended
                  ? "border-2 border-primary z-[1] md:-my-4 md:py-12"
                  : "border border-foreground/10"
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
                <h3 className="font-display text-3xl text-foreground mt-2 leading-tight">
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
                  Интеграция 0 ₽ + usage
                </span>
                <p className="text-sm text-muted-foreground mt-2">
                  Подключение бесплатно, дальше — только за использованное
                </p>
              </div>

              <ul className="space-y-4 mb-8">
                {pkg.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-3">
                    <Check className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                    <span className="text-sm text-muted-foreground">
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>

              <p className="mb-8 text-sm text-muted-foreground/80 leading-relaxed">
                {pkg.note}
              </p>

              <a
                href="#lead"
                className={`mt-auto w-full py-4 flex items-center justify-center gap-2 text-sm font-medium transition-all group rounded-full ${
                  pkg.recommended
                    ? "bg-primary text-primary-foreground hover:bg-[color-mix(in_oklch,var(--dp-primary)_90%,var(--dp-background))] shadow-lg"
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
