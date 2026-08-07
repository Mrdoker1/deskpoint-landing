"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import { DemoVideoPlayer } from "./demo-video-player";
import { DoodlePattern } from "./doodle-pattern";
import { Doodle, type DoodleName } from "./doodles";

type FlowItem = { doodle: DoodleName; title: string; description: string };

const intake: FlowItem[] = [
  {
    doodle: "handset",
    title: "Телефония",
    description: "Входящие звонки, запись и ИИ-разбор разговора.",
  },
  {
    doodle: "bubble",
    title: "Мессенджеры",
    description: "Telegram, MAX, WhatsApp, VK, Avito — в одном контуре.",
  },
  {
    doodle: "monitor",
    title: "Виджет",
    description: "Чат на сайте клиента без отдельного инбокса.",
  },
];

const analytics: FlowItem[] = [
  {
    doodle: "wave",
    title: "Анализ звонков и диалогов",
    description: "Расшифровка, саммари и теги по каждому обращению.",
  },
  {
    doodle: "headset",
    title: "Эффективность операторов",
    description: "Кто как справляется, где грубит, где теряет клиента.",
  },
  {
    doodle: "chart",
    title: "Дашборд для владельца",
    description: "Воронка, проблемные диалоги и usage по всей команде.",
  },
];

/**
 * Коньячный акцент на тёмном фоне почти сливается с ним, поэтому в этой секции
 * знак и отклики красятся осветлённым вариантом того же цвета.
 */
const CORE_ACCENT = "color-mix(in oklch, var(--dp-primary) 55%, var(--dp-background))";

/**
 * Лучи ядра: каждый идёт из центра наружу, поэтому его можно прочертить.
 * Ноды — только на диагоналях, как в самом знаке. Порядок задаёт обход по
 * кругу: граф собирается веером, а не вспыхивает целиком.
 */
const RAYS: { x: number; y: number; node: boolean }[] = [
  { x: 100, y: 54, node: false },
  { x: 132.5, y: 67.5, node: true },
  { x: 146, y: 100, node: false },
  { x: 132.5, y: 132.5, node: true },
  { x: 100, y: 146, node: false },
  { x: 67.5, y: 132.5, node: true },
  { x: 54, y: 100, node: false },
  { x: 67.5, y: 67.5, node: true },
];
/** Цикл сборки графа. */
const CORE_DUR = "7s";
/** Когда начинает чертиться луч i и когда он дошёл до конца. */
const rayFrom = (i: number) => 0.08 + i * 0.05;
const rayTo = (i: number) => rayFrom(i) + 0.06;
/** Всё держится до этой доли цикла, потом гаснет и собирается заново. */
const CORE_HOLD = 0.86;

/** Высота колонки и связки — по ней же расставлены концы дуг. */
const FLOW_H = 372;
/** Опорная ширина связки; по ней строятся дуги, растягивается она по месту. */
const LINK_W = 200;
/** Куда приходят и откуда уходят дуги: центры трёх строк. */
const ROW_Y = [52, 186, 320];

function revealStyle(active: boolean, delayMs: number, fromY = 12): CSSProperties {
  return {
    opacity: active ? 1 : 0,
    transform: active ? "translate3d(0,0,0)" : `translate3d(0,${fromY}px,0)`,
    transition: `opacity 650ms cubic-bezier(0.22, 1, 0.36, 1) ${delayMs}ms, transform 650ms cubic-bezier(0.22, 1, 0.36, 1) ${delayMs}ms`,
  };
}

/**
 * Связка между колонкой и ядром. Дуги идут от строк к центру (или наоборот),
 * по ним постоянно бегут импульсы. Наведение на строку подсвечивает её дугу —
 * так видно, какой канал куда приходит.
 */
function FlowLink({
  direction,
  active,
  hovered,
}: {
  direction: "in" | "out";
  active: boolean;
  hovered: number | null;
}) {
  const mid = FLOW_H / 2;
  // «in» — из колонки в ядро, «out» — из ядра в колонку.
  const paths = ROW_Y.map((y) =>
    direction === "in"
      ? `M0 ${y}C${LINK_W * 0.45} ${y} ${LINK_W * 0.55} ${mid} ${LINK_W} ${mid}`
      : `M0 ${mid}C${LINK_W * 0.45} ${mid} ${LINK_W * 0.55} ${y} ${LINK_W} ${y}`
  );

  return (
    // Связка тянется на всё свободное место между колонкой и ядром, иначе дуги
    // обрываются на полпути. Высота при этом жёстко равна колонке, чтобы концы
    // дуг попадали в строки, — отсюда preserveAspectRatio="none".
    <div className="hidden lg:block min-w-[120px] max-w-[280px] flex-1 self-center" aria-hidden>
      <svg
        viewBox={`0 0 ${LINK_W} ${FLOW_H}`}
        preserveAspectRatio="none"
        className="w-full"
        style={{ height: FLOW_H }}
      >
        {paths.map((d, i) => {
          const lit = hovered === i;
          return (
            <g key={d}>
              <path
                d={d}
                fill="none"
                stroke="currentColor"
                strokeWidth={lit ? 1.6 : 1}
                className="text-background"
                opacity={lit ? 0.5 : 0.18}
                style={{
                  strokeDasharray: 460,
                  strokeDashoffset: active ? 0 : 460,
                  transition: `stroke-dashoffset 900ms cubic-bezier(0.22,1,0.36,1) ${
                    260 + i * 120
                  }ms, opacity 300ms ease, stroke-width 300ms ease`,
                }}
              />
              {active ? (
                <path
                  d={d}
                  pathLength="1"
                  fill="none"
                  stroke={CORE_ACCENT}
                  strokeWidth={lit ? 3.5 : 2.5}
                  strokeLinecap="round"
                  strokeDasharray="0.18 0.82"
                  style={{ transition: "stroke-width 300ms ease" }}
                >
                  <animate
                    attributeName="stroke-dashoffset"
                    values="1;0"
                    dur="3.4s"
                    begin={`${(i * 1.1).toFixed(2)}s`}
                    repeatCount="indefinite"
                  />
                </path>
              ) : null}
            </g>
          );
        })}
      </svg>
    </div>
  );
}

/** Вертикальная связка для узкого экрана. */
function FlowLinkMobile({ active, delayMs }: { active: boolean; delayMs: number }) {
  return (
    <div className="lg:hidden flex justify-center" aria-hidden>
      <svg viewBox="0 0 40 64" className="h-16 w-10">
        <path
          d="M20 0C20 22 20 42 20 64"
          fill="none"
          stroke="currentColor"
          className="text-background"
          strokeWidth="1"
          opacity="0.2"
          style={{
            strokeDasharray: 64,
            strokeDashoffset: active ? 0 : 64,
            transition: `stroke-dashoffset 700ms ease ${delayMs}ms`,
          }}
        />
        {active ? (
          <circle r="3" fill={CORE_ACCENT}>
            <animate attributeName="cx" values="20;20" dur="2.4s" repeatCount="indefinite" />
            <animate attributeName="cy" values="0;64" dur="2.4s" repeatCount="indefinite" />
            <animate
              attributeName="opacity"
              values="0;1;1;0"
              keyTimes="0;0.12;0.8;1"
              dur="2.4s"
              repeatCount="indefinite"
            />
          </circle>
        ) : null}
      </svg>
    </div>
  );
}

function FlowRow({
  item,
  align,
  active,
  delayMs,
  onHover,
}: {
  item: FlowItem;
  align: "left" | "right";
  active: boolean;
  delayMs: number;
  onHover: (v: boolean) => void;
}) {
  return (
    <div
      className={`group flex items-start gap-4 ${
        align === "right" ? "lg:flex-row-reverse lg:text-right" : ""
      }`}
      style={revealStyle(active, delayMs, 14)}
      onMouseEnter={() => onHover(true)}
      onMouseLeave={() => onHover(false)}
    >
      <Doodle
        name={item.doodle}
        strokeWidth={1.3}
        className="mt-1 h-14 w-14 shrink-0 text-background/75 transition-all duration-500 group-hover:scale-110 group-hover:text-background lg:h-16 lg:w-16"
      />
      <div>
        <div className="font-display text-xl leading-tight">{item.title}</div>
        <p className="mt-1.5 text-sm leading-relaxed text-background/55">
          {item.description}
        </p>
      </div>
    </div>
  );
}

/** Ядро: кольца вокруг точки, отклик расходится в такт приходящим импульсам. */
function CoreNode({ active }: { active: boolean }) {
  return (
    <div
      className="relative flex flex-col items-center text-center"
      style={revealStyle(active, 520, 10)}
    >
      <div className="relative flex items-center justify-center">
        <svg viewBox="0 0 200 200" className="h-56 w-56 lg:h-64 lg:w-64" aria-hidden>
          {/* Ореол и отклик — тот же приём, что у узлов в хиро */}
          <circle cx="100" cy="100" r="94" fill="none" stroke="currentColor" className="text-background" strokeWidth="0.8" strokeDasharray="2 8" opacity="0.22" />
          <circle cx="100" cy="100" r="72" fill="none" stroke="currentColor" className="text-background" strokeWidth="1.2" opacity="0.55" />
          {active ? (
            <circle cx="100" cy="100" r="72" fill="none" stroke={CORE_ACCENT} strokeWidth="1.2">
              <animate attributeName="r" values="58;98" dur="3.4s" repeatCount="indefinite" />
              <animate attributeName="opacity" values="0.5;0" dur="3.4s" repeatCount="indefinite" />
            </circle>
          ) : null}

          {/* Граф собирается на глазах: лучи выходят из центра по очереди,
              на концах загораются ноды. Потом гаснет и строится заново. */}
          <g>
            {RAYS.map((ray, i) => {
              const times = `0;${rayFrom(i).toFixed(3)};${rayTo(i).toFixed(3)};${CORE_HOLD};1`;
              return (
                <g key={i}>
                  <line
                    x1="100"
                    y1="100"
                    x2={ray.x}
                    y2={ray.y}
                    stroke={CORE_ACCENT}
                    strokeWidth="1"
                    strokeLinecap="round"
                    pathLength="1"
                    strokeDasharray="1 1"
                    strokeDashoffset={active ? undefined : 1}
                    opacity="0.75"
                  >
                    {active ? (
                      <animate
                        attributeName="stroke-dashoffset"
                        values="1;1;0;0;1"
                        keyTimes={times}
                        dur={CORE_DUR}
                        repeatCount="indefinite"
                      />
                    ) : null}
                  </line>
                  {ray.node ? (
                    <circle cx={ray.x} cy={ray.y} r="5" fill={CORE_ACCENT} opacity="0">
                      {active ? (
                        <>
                          <animate
                            attributeName="opacity"
                            values="0;0;1;1;0"
                            keyTimes={times}
                            dur={CORE_DUR}
                            repeatCount="indefinite"
                          />
                          <animate
                            attributeName="r"
                            values="0;0;5;5;5"
                            keyTimes={times}
                            dur={CORE_DUR}
                            repeatCount="indefinite"
                          />
                        </>
                      ) : null}
                    </circle>
                  ) : null}
                </g>
              );
            })}

            <circle cx="100" cy="100" r="9" fill={CORE_ACCENT}>
              {active ? (
                <animate
                  attributeName="r"
                  values="0;9;9;9"
                  keyTimes={`0;0.06;${CORE_HOLD};1`}
                  dur={CORE_DUR}
                  repeatCount="indefinite"
                />
              ) : null}
            </circle>
          </g>
        </svg>
      </div>
      <div className="mt-4 font-display text-3xl tracking-tight">Deskpoint</div>
      <p className="mt-3 max-w-[24ch] text-sm leading-relaxed text-background/60">
        Единый слой приёма: ИИ-разбор, эскалация и поток обращений.
      </p>
    </div>
  );
}

export function HowItWorksSection() {
  const [headerVisible, setHeaderVisible] = useState(false);
  const [flowActive, setFlowActive] = useState(false);
  const [reduceMotion, setReduceMotion] = useState(false);
  const [hoveredIntake, setHoveredIntake] = useState<number | null>(null);
  const [hoveredAnalytics, setHoveredAnalytics] = useState<number | null>(null);
  const sectionRef = useRef<HTMLDivElement>(null);
  const flowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const apply = () => setReduceMotion(mq.matches);
    apply();
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, []);

  useEffect(() => {
    const headerObs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setHeaderVisible(true);
      },
      { threshold: 0.12 }
    );
    if (sectionRef.current) headerObs.observe(sectionRef.current);

    const flowObs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setFlowActive(true);
      },
      { threshold: 0.2, rootMargin: "0px 0px -8% 0px" }
    );
    if (flowRef.current) flowObs.observe(flowRef.current);

    return () => {
      headerObs.disconnect();
      flowObs.disconnect();
    };
  }, []);

  const active = reduceMotion || flowActive;
  const isVisible = reduceMotion || headerVisible;

  return (
    <section
      id="how-it-works"
      ref={sectionRef}
      className="relative overflow-hidden bg-foreground py-24 text-background lg:py-32"
    >
      {/* Фон из фирменных дудлов вместо диагональной штриховки */}
      <DoodlePattern className="pointer-events-none absolute inset-0 h-full w-full text-background opacity-[0.07]" />
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-foreground to-transparent"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-foreground to-transparent"
        aria-hidden
      />

      <div className="relative z-10 mx-auto max-w-[1400px] px-6 lg:px-12">
        <div className="mb-12 lg:mb-16">
          <span className="mb-6 inline-flex items-center gap-3 font-mono text-sm text-background/50">
            <span className="h-px w-8 bg-background/30" />
            Как это работает
          </span>
          <h2 className="font-display text-4xl tracking-tight lg:text-6xl">
            <span className="block" style={revealStyle(isVisible, 0, 16)}>
              Все каналы —
            </span>
            <span className="block text-background/50" style={revealStyle(isVisible, 90, 16)}>
              и вся аналитика команды —
            </span>
            <span className="block text-background/50" style={revealStyle(isVisible, 180, 16)}>
              в одном кабинете.
            </span>
          </h2>
          <p
            className="mt-6 max-w-2xl text-lg leading-relaxed text-background/60"
            style={revealStyle(isVisible, 280, 12)}
          >
            Каналы сходятся в Deskpoint: ИИ разбирает обращения, а владелец
            видит и поток, и работу каждого оператора.
          </p>
        </div>

        <div
          id="demo"
          className="mb-16 scroll-mt-28 lg:mb-24"
          style={revealStyle(isVisible, 340, 16)}
        >
          <DemoVideoPlayer />
        </div>

        <div ref={flowRef} aria-label="Схема: приём обращений → Deskpoint → аналитика команды">
          <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between lg:gap-2">
            {/* Приём */}
            <div className="lg:w-[24%] lg:shrink-0">
              <p
                className="mb-6 font-mono text-[11px] uppercase tracking-widest text-background/45"
                style={revealStyle(active, 40, 8)}
              >
                Приём обращений с ИИ
              </p>
              {/* Высота колонки фиксируется только на широком экране: по ней
                  выставлены концы дуг (FLOW_H). На узком строки идут подряд. */}
              <div className="flex flex-col gap-8 lg:h-[372px] lg:justify-between lg:gap-0">
                {intake.map((item, i) => (
                  <FlowRow
                    key={item.title}
                    item={item}
                    align="left"
                    active={active}
                    delayMs={80 + i * 110}
                    onHover={(v) => setHoveredIntake(v ? i : null)}
                  />
                ))}
              </div>
            </div>

            <FlowLink direction="in" active={active} hovered={hoveredIntake} />
            <FlowLinkMobile active={active} delayMs={420} />

            <CoreNode active={active} />

            <FlowLinkMobile active={active} delayMs={620} />
            <FlowLink direction="out" active={active} hovered={hoveredAnalytics} />

            {/* Аналитика */}
            <div className="lg:w-[24%] lg:shrink-0">
              <p
                className="mb-6 font-mono text-[11px] uppercase tracking-widest text-background/45 lg:text-right"
                style={revealStyle(active, 700, 8)}
              >
                Аналитика и контроль команды
              </p>
              {/* Высота колонки фиксируется только на широком экране: по ней
                  выставлены концы дуг (FLOW_H). На узком строки идут подряд. */}
              <div className="flex flex-col gap-8 lg:h-[372px] lg:justify-between lg:gap-0">
                {analytics.map((item, i) => (
                  <FlowRow
                    key={item.title}
                    item={item}
                    align="right"
                    active={active}
                    delayMs={760 + i * 110}
                    onHover={(v) => setHoveredAnalytics(v ? i : null)}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
