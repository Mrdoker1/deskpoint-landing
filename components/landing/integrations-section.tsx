"use client";

import { useEffect, useRef, useState } from "react";
import { withBase } from "@/lib/base-path";

/**
 * Логотипы вендорские и цветные, а нужны монохромные. Обесцвечиваем фильтром.
 *
 * Сначала пробовал CSS-маску — она даёт настоящий одноцветный силуэт, но не
 * годится: маска берёт альфа-канал, а не цвет. Логотипы, нарисованные как
 * цветная плашка с вырезанным внутри знаком (VK, MAX, MTS Exolve), в альфе
 * сплошные, и вместо марки получался закрашенный прямоугольник.
 *
 * Фильтр сохраняет внутренние перепады яркости, поэтому вырезы остаются видны.
 * sepia подмешан, чтобы серый не выпадал холодным пятном на тёплом фоне.
 */
const LOGO_FILTER = "grayscale(1) sepia(0.35) brightness(0.85)";

/** Знаки без названия внутри файла — подписываем рядом. */
const ICON_ONLY = ["gigachat"];

/**
 * Логотипы, которым в общем боксе тесно: у файла много пустоты внутри viewBox,
 * и при общей высоте знак выходит мельче соседей. Значение — класс высоты.
 */
const LOGO_HEIGHT: Record<string, string> = {
  mango: "h-9",
  gigachat: "h-7",
};

/**
 * Интеграции. Логотип берётся из public/logos/<slug>.svg.
 */
const integrations = [
  { name: "Telegram", category: "Мессенджер", slug: "telegram" },
  { name: "MAX", category: "Мессенджер", slug: "max" },
  { name: "WhatsApp", category: "Мессенджер", slug: "whatsapp" },
  { name: "VK", category: "Соцсеть / сообщения", slug: "vk" },
  { name: "Avito", category: "Объявления", slug: "avito" },
  { name: "amoCRM", category: "CRM", slug: "amocrm" },
  { name: "Bitrix24", category: "CRM", slug: "bitrix24" },
  { name: "Mango Office", category: "Телефония", slug: "mango" },
  { name: "UIS", category: "Телефония", slug: "uis" },
  { name: "MTS Exolve", category: "Телефония", slug: "mts-exolve" },
  { name: "ЮKassa", category: "Оплата", slug: "yookassa" },
  { name: "YandexGPT", category: "ИИ", slug: "yandexgpt" },
  { name: "GigaChat", category: "ИИ", slug: "gigachat" },
  { name: "cal.com", category: "Бронирование", slug: "calcom" },
];

type Integration = (typeof integrations)[number];

function IntegrationCard({ item }: { item: Integration }) {
  const src = withBase(`/logos/${item.slug}.svg`);
  const height = LOGO_HEIGHT[item.slug] ?? "h-6";

  return (
    <div className="group flex h-[92px] w-56 shrink-0 flex-col justify-center border border-foreground/10 px-8 transition-all duration-300 hover:border-foreground/30 hover:bg-foreground/[0.02]">
      {/* Фиксированная высота ряда: логотипы разной пропорции, и без неё
          карточки в бегущей строке скакали бы по высоте. */}
      <div className="flex h-9 items-center gap-2">
        <img
          src={src}
          alt={item.name}
          className={`${height} w-auto max-w-[124px] object-contain object-left opacity-85 transition-opacity group-hover:opacity-100`}
          style={{ filter: LOGO_FILTER }}
        />
        {ICON_ONLY.includes(item.slug) && (
          <span className="text-lg font-medium">{item.name}</span>
        )}
      </div>
      <div className="mt-1 text-sm text-muted-foreground">{item.category}</div>
    </div>
  );
}

export function IntegrationsSection() {
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
      id="integrations"
      ref={sectionRef}
      className="relative py-24 lg:py-32 overflow-hidden"
    >
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
        <div
          className={`text-center max-w-3xl mx-auto mb-16 lg:mb-24 transition-all duration-700 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <span className="inline-flex items-center gap-3 text-sm font-mono text-muted-foreground mb-6">
            <span className="w-8 h-px bg-foreground/30" />
            Интеграции
            <span className="w-8 h-px bg-foreground/30" />
          </span>
          <h2 className="text-4xl lg:text-6xl font-display tracking-tight mb-6">
            Каналы и сервисы,
            <br />
            с которыми работаем.
          </h2>
          {/* Прежняя формулировка обещала «без чужих западных
              маркетплейс-логотипов» — с настоящими логотипами она сама себе
              противоречила бы. Смысл сохранён: в списке только то, что
              действительно подключаем. */}
          <p className="text-xl text-muted-foreground">
            Список под российский сервисный бизнес — только то, что
            действительно подключаем, без витрины «для красоты».
          </p>
        </div>
      </div>

      <div className="w-full mb-6">
        <div className="flex gap-6 marquee">
          {[...Array(2)].map((_, setIndex) => (
            <div key={setIndex} className="flex gap-6 shrink-0">
              {integrations.map((item) => (
                <IntegrationCard key={`${item.slug}-${setIndex}`} item={item} />
              ))}
            </div>
          ))}
        </div>
      </div>

      <div className="w-full">
        <div className="flex gap-6 marquee-reverse">
          {[...Array(2)].map((_, setIndex) => (
            <div key={setIndex} className="flex gap-6 shrink-0">
              {[...integrations].reverse().map((item) => (
                <IntegrationCard
                  key={`${item.slug}-reverse-${setIndex}`}
                  item={item}
                />
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
