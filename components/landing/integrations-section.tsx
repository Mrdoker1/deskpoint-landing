"use client";

import { useEffect, useRef, useState } from "react";
import { withBase } from "@/lib/base-path";

/**
 * Логотипы из public/logos. Файлы вендорские и цветные, а нужны монохромные,
 * поэтому подключаются CSS-маской, а не картинкой: маска берёт из файла только
 * форму, а цвет даёт currentColor. Так работает с любым числом путей и цветов
 * внутри файла — перекрашивать его не нужно.
 *
 * Бокс маски задан один на всех (h-6 w-32) с mask-size: contain: пропорции у
 * логотипов разные, от 3.4:1 до 5.75:1, и без общего бокса они шли бы разной
 * величины.
 */
const FILE_LOGOS = ["vk", "avito", "amocrm", "bitrix24", "mango"];

/**
 * Монохромные логотипы, встроенные контурами.
 *
 * Источник — simple-icons (CC0), бокс 24×24, один путь. Встроены в код, а не
 * подключены картинками: через <img> цвет не задать, а нам нужен currentColor,
 * чтобы логотипы шли в тон странице.
 *
 * Здесь только те бренды, в которых я уверен. В наборе есть ещё «Max» и
 * «Yandex Cloud», но это стриминговый Max, а не российский мессенджер, и
 * облако, а не YandexGPT, — чужие марки ставить нельзя. Российских сервисов
 * (Avito, amoCRM, Bitrix24, Mango Office, UIS, MTS Exolve, ЮKassa, GigaChat,
 * MAX) в общих наборах иконок нет вовсе, их нужно брать с брендбуков вендоров.
 */
const LOGOS: Record<string, string> = {
  telegram:
    "M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z",
  whatsapp:
    "M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z",
  calcom:
    "M2.408 14.488C1.035 14.488 0 13.4 0 12.058c0-1.346.982-2.443 2.408-2.443.758 0 1.282.233 1.691.765l-.66.55a1.343 1.343 0 0 0-1.03-.442c-.93 0-1.44.711-1.44 1.57 0 .86.559 1.557 1.44 1.557.413 0 .765-.147 1.043-.443l.651.573c-.391.51-.929.743-1.695.743zM6.948 10.913h.89v3.49h-.89v-.51c-.185.362-.493.604-1.083.604-.943 0-1.695-.82-1.695-1.826 0-1.007.752-1.825 1.695-1.825.585 0 .898.241 1.083.604zm.026 1.758c0-.546-.374-.998-.964-.998-.568 0-.938.457-.938.998 0 .528.37.998.938.998.586 0 .964-.456.964-.998zM8.467 9.503h.89v4.895h-.89zM9.752 13.937a.53.53 0 0 1 .542-.528c.313 0 .533.242.533.528a.527.527 0 0 1-.533.537.534.534 0 0 1-.542-.537zM14.23 13.839c-.33.403-.832.658-1.426.658a1.806 1.806 0 0 1-1.84-1.826c0-1.007.778-1.825 1.84-1.825.572 0 1.07.241 1.4.622l-.687.577c-.172-.215-.396-.376-.713-.376-.568 0-.938.456-.938.998 0 .541.37.997.938.997.343 0 .58-.179.757-.42zM14.305 12.671c0-1.007.78-1.825 1.84-1.825 1.061 0 1.84.818 1.84 1.825 0 1.007-.779 1.826-1.84 1.826-1.06-.005-1.84-.82-1.84-1.826zm2.778 0c0-.546-.37-.998-.938-.998-.568-.004-.937.452-.937.998 0 .542.37.998.937.998.568 0 .938-.456.938-.998zM24 12.269v2.13h-.89v-1.911c0-.604-.281-.864-.704-.864-.396 0-.678.197-.678.864v1.91h-.89v-1.91c0-.604-.285-.864-.704-.864-.396 0-.744.197-.744.864v1.91h-.89v-3.49h.89v.484c.185-.376.52-.564 1.035-.564.489 0 .898.241 1.123.649.224-.417.554-.65 1.153-.65.731.005 1.299.56 1.299 1.442z",
};

/**
 * Интеграции. У кого есть контур в LOGOS — показываем логотип, у остальных
 * название текстом. Добавить логотип: положить контур в LOGOS под тем же slug.
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
  const path = LOGOS[item.slug];
  const file = FILE_LOGOS.includes(item.slug)
    ? withBase(`/logos/${item.slug}.svg`)
    : null;

  return (
    <div className="group flex h-[92px] w-56 shrink-0 flex-col justify-center border border-foreground/10 px-8 transition-all duration-300 hover:border-foreground/30 hover:bg-foreground/[0.02]">
      {/* Фиксированная высота: логотипы и названия занимают разное место, и без
          неё карточки в бегущей строке скакали бы по высоте. */}
      <div className="flex h-6 items-center">
        {file ? (
          <span
            role="img"
            aria-label={item.name}
            className="block h-6 w-32 bg-current opacity-75 transition-opacity group-hover:opacity-100"
            style={{
              maskImage: `url(${file})`,
              WebkitMaskImage: `url(${file})`,
              maskRepeat: "no-repeat",
              WebkitMaskRepeat: "no-repeat",
              maskSize: "contain",
              WebkitMaskSize: "contain",
              maskPosition: "left center",
              WebkitMaskPosition: "left center",
            }}
          />
        ) : path ? (
          <svg
            viewBox="0 0 24 24"
            fill="currentColor"
            role="img"
            aria-label={item.name}
            className="h-6 w-6 opacity-75 transition-opacity group-hover:opacity-100"
          >
            <path d={path} />
          </svg>
        ) : (
          <span className="text-lg font-medium transition-transform group-hover:translate-x-1">
            {item.name}
          </span>
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
