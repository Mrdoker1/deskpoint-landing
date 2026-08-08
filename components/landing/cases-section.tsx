"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowRight } from "lucide-react";

/**
 * TODO(business): заполнить кейсы согласованным текстом.
 *
 * Правило прежнее и важное: НЕ подставлять выдуманные метрики, отрасли и цитаты.
 * Пока данные не согласованы с клиентом, поле остаётся плейсхолдером — блок
 * рассчитан на это и с прочерками выглядит опрятно, а не сломанно.
 *
 * Чтобы добавить кейс — допишите объект в CASES. Чтобы убрать — удалите его же.
 * Вёрстка подстроится: на десктопе сетка, на телефоне лента с прокруткой.
 */
const CASES = [
  {
    id: "algard",
    name: "Альгард",
    /** Короткая строка про отрасль/масштаб — попадает под названием. */
    industry: "[отрасль]",
    status: "Пилот",
    /** Что подключили. 2–4 пункта, коротко. */
    connected: ["[канал]", "[канал]", "[что настроили]"],
    /** Метрики: подпись + значение. Значение — плейсхолдер до согласования. */
    metrics: [
      { label: "[метрика]", value: "[—]" },
      { label: "[метрика]", value: "[—]" },
    ],
  },
  {
    id: "case-2",
    name: "[Клиент]",
    industry: "[отрасль]",
    status: "В работе",
    connected: ["[канал]", "[канал]", "[что настроили]"],
    metrics: [
      { label: "[метрика]", value: "[—]" },
      { label: "[метрика]", value: "[—]" },
    ],
  },
  {
    id: "case-3",
    name: "[Клиент]",
    industry: "[отрасль]",
    status: "В работе",
    connected: ["[канал]", "[канал]", "[что настроили]"],
    metrics: [
      { label: "[метрика]", value: "[—]" },
      { label: "[метрика]", value: "[—]" },
    ],
  },
];

/**
 * Декоративные потоки — тот же приём, что на первом экране и у кнопки заявки:
 * первая контрольная точка уносится вперёд на высоте истока, вторая
 * возвращается назад на высоту цели, отчего кривая идёт извилисто, а не прямым
 * лучом. Сходятся в узел справа.
 *
 * Живут в правой половине секции, куда заголовок не достаёт (у него max-w-2xl),
 * и обрезаются по overflow-hidden секции. Ниже lg не показываем: там ширины на
 * них нет и они полезли бы на текст.
 */
const CASE_FLOWS = [
  { d: "M-40 26C300 6 180 150 520 150", op: 0.18, dur: "11s", delay: "-1.4s" },
  { d: "M-30 96C320 84 220 150 520 150", op: 0.22, dur: "8.5s", delay: "-4.2s" },
  { d: "M-40 210C330 206 260 150 520 150", op: 0.16, dur: "13s", delay: "-2.1s" },
  { d: "M60 288C360 268 310 150 520 150", op: 0.12, dur: "9.5s", delay: "-6.8s" },
];

function CaseFlows() {
  return (
    <svg
      viewBox="0 0 520 300"
      fill="none"
      aria-hidden="true"
      className="pointer-events-none absolute -top-10 right-0 hidden h-[300px] w-[520px] select-none lg:block"
    >
      <style>{`
        .cf-pulse {
          fill: none;
          stroke-linecap: round;
          stroke-dasharray: 0.12 0.88;
          animation: cf-flow linear infinite;
        }
        @keyframes cf-flow {
          from { stroke-dashoffset: 1; }
          to { stroke-dashoffset: 0; }
        }
        @media (prefers-reduced-motion: reduce) {
          .cf-pulse { display: none; }
        }
      `}</style>
      {CASE_FLOWS.map((f) => (
        <path
          key={f.d}
          d={f.d}
          stroke="#402718"
          strokeOpacity={f.op}
          strokeWidth="1.6"
        />
      ))}
      {CASE_FLOWS.map((f) => (
        <path
          key={`pulse-${f.d}`}
          className="cf-pulse"
          d={f.d}
          pathLength="1"
          stroke="#74452c"
          strokeOpacity="0.6"
          strokeWidth="2.2"
          style={{ animationDuration: f.dur, animationDelay: f.delay }}
        />
      ))}
      <circle cx="520" cy="150" r="26" stroke="#402718" strokeOpacity="0.2" fill="none" />
      <circle cx="520" cy="150" r="5" fill="#74452c" fillOpacity="0.75" />
    </svg>
  );
}

export function CasesSection() {
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
      id="cases"
      ref={sectionRef}
      className="relative overflow-hidden border-t border-foreground/10 py-24 lg:py-32"
    >
      <div className="relative mx-auto max-w-[1400px] px-6 lg:px-12">
        <CaseFlows />

        <div
          className={`relative max-w-2xl transition-all duration-700 ${
            isVisible ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
          }`}
        >
          <span className="mb-6 inline-flex items-center gap-3 font-mono text-sm text-muted-foreground">
            <span className="h-px w-8 bg-foreground/30" />
            Кейсы
          </span>
          <h2 className="mb-6 font-display text-4xl tracking-tight lg:text-6xl">
            Уже работаем
            <br />
            <span className="text-muted-foreground">на реальном потоке</span>
          </h2>
          <p className="max-w-xl text-lg leading-relaxed text-muted-foreground">
            Подключаем каналы, настраиваем ИИ под сценарии клиента и остаёмся
            рядом на старте. Ниже — с кем работаем и что именно подключено.
          </p>
        </div>

        {/*
          На телефоне лента с прокруткой и защёлкиванием, на десктопе сетка.
          Карусель на JS не нужна: snap даёт то же поведение нативно, без
          библиотеки и без ломающейся клавиатурной навигации.
        */}
        <div className="relative mt-14 -mx-6 flex snap-x snap-mandatory gap-px overflow-x-auto px-6 pb-4 lg:mx-0 lg:grid lg:grid-cols-3 lg:overflow-visible lg:bg-foreground/10 lg:px-0 lg:pb-0">
          {CASES.map((c, idx) => (
            <article
              key={c.id}
              className={`group flex w-[85vw] shrink-0 snap-center flex-col border border-foreground/10 bg-background p-8 transition-all duration-700 hover:border-primary/40 sm:w-[420px] lg:w-auto lg:border-0 lg:p-10 ${
                isVisible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
              }`}
              style={{ transitionDelay: `${150 + idx * 120}ms` }}
            >
              <div className="mb-8 flex items-start justify-between gap-4">
                <span className="font-mono text-xs text-muted-foreground">
                  {String(idx + 1).padStart(2, "0")}
                </span>
                <span className="rounded-full border border-foreground/15 px-3 py-1 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                  {c.status}
                </span>
              </div>

              <h3 className="font-display text-3xl tracking-tight">{c.name}</h3>
              <p className="mt-2 font-mono text-xs uppercase tracking-widest text-primary">
                {c.industry}
              </p>

              <ul className="mt-8 space-y-3">
                {c.connected.map((item, i) => (
                  <li
                    key={`${c.id}-${i}`}
                    className="flex items-start gap-3 text-sm text-muted-foreground"
                  >
                    <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-primary" />
                    {item}
                  </li>
                ))}
              </ul>

              <div className="mt-auto grid grid-cols-2 gap-4 border-t border-foreground/10 pt-8">
                {c.metrics.map((m, i) => (
                  <div key={`${c.id}-m-${i}`}>
                    <p className="font-display text-2xl tracking-tight">
                      {m.value}
                    </p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {m.label}
                    </p>
                  </div>
                ))}
              </div>
            </article>
          ))}
        </div>

        <p
          className={`mt-10 font-mono text-xs text-muted-foreground transition-all duration-700 delay-500 ${
            isVisible ? "opacity-100" : "opacity-0"
          }`}
        >
          {/* TODO(business): убрать строку, когда кейсы заполнены согласованным текстом */}
          [Описания и цифры согласовываются с клиентами]
        </p>

        <a
          href="#lead"
          className={`mt-8 inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground ${
            isVisible ? "opacity-100" : "opacity-0"
          }`}
        >
          <span className="underline decoration-foreground/30 underline-offset-4">
            Хотите так же — оставьте заявку
          </span>
          <ArrowRight className="h-4 w-4" />
        </a>
      </div>
    </section>
  );
}
